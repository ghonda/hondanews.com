import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";

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
