import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";
import sessions from "models/session";
import setCookieParser from "set-cookie-parser";
import session from "models/session";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

test("POST to /api/v1/sessions incorrect email 401", async () => {
  await orquestrator.createUser({
    password: "senha-correta",
  });

  const response = await fetch("http://localhost:3000/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "email.errado@curso.dev",
      password: "user@example.com",
    }),
  });

  expect(response.status).toBe(401);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "UnauthorizedError",
    message: "Dados de autenticação inválidos",
    action: "Verifique se o email e a senha estão digitados corretamente",
    statusCode: 401,
  });
});

test("POST to /api/v1/sessions incorrect password 401", async () => {
  await orquestrator.createUser({
    email: "email.correto@curso.dev",
    password: "senha-correta",
  });

  const response = await fetch("http://localhost:3000/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "email.correto@curso.dev",
      password: "senha-incorreta",
    }),
  });

  expect(response.status).toBe(401);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "UnauthorizedError",
    message: "Dados de autenticação inválidos",
    action: "Verifique se o email e a senha estão digitados corretamente",
    statusCode: 401,
  });
});

test("POST to /api/v1/sessions incorrect password and email 401", async () => {
  await orquestrator.createUser({});

  const response = await fetch("http://localhost:3000/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "email.incorreto@curso.dev",
      password: "senha-incorreta",
    }),
  });

  expect(response.status).toBe(401);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "UnauthorizedError",
    message: "Dados de autenticação inválidos",
    action: "Verifique se o email e a senha estão digitados corretamente",
    statusCode: 401,
  });
});

test("POST to /api/v1/sessions correct password and email 200", async () => {
  const createdUser = await orquestrator.createUser({
    email: "tudo.correto@curso.dev",
    password: "tudo-correto",
  });

  const response = await fetch("http://localhost:3000/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "tudo.correto@curso.dev",
      password: "tudo-correto",
    }),
  });

  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    id: responseBody.id,
    token: responseBody.token,
    user_id: createdUser.id,
    expires_at: responseBody.expires_at,
    created_at: responseBody.created_at,
    updated_at: responseBody.updated_at,
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
  expect(Date.parse(responseBody.expires_at)).toBeGreaterThan(Date.now());
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

  const expires_at = new Date(responseBody.expires_at);
  const created_at = new Date(responseBody.created_at);

  expires_at.setMilliseconds(0);
  created_at.setMilliseconds(0);

  expect(expires_at - created_at).toBe(sessions.EXPIRATION_IN_MILLISECONDS);

  const parsedSetCookie = setCookieParser(response, { map: true });

  expect(parsedSetCookie.session_id).toEqual({
    name: "session_id",
    value: responseBody.token,
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    path: "/",
    httpOnly: true,
  });
});
