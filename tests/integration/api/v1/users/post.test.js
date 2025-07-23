import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

test("POST to /api/v1/user should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "ghonda",
      email: "contato@curso.dev",
      password: "senha123",
    }),
  });

  expect(response.status).toBe(201);
  const responseBody = await response.json();

  expect(responseBody).toEqual({
    id: responseBody.id,
    username: "ghonda",
    email: "contato@curso.dev",
    password: responseBody.password,
    created_at: responseBody.created_at,
    updated_at: responseBody.updated_at,
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

  const userInDatabase = await user.findOneByUsername("ghonda");
  const correctPasswordMatch = await password.compare(
    "senha123",
    userInDatabase.password,
  );

  expect(correctPasswordMatch).toBe(true);

  const incorrectPasswordMatch = await password.compare(
    "senhaErrada",
    userInDatabase.password,
  );
  expect(incorrectPasswordMatch).toBe(false);
});

test("POST to /api/v1/user duplicate email should return 400", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "emailduplicado1",
      email: "duplicado@curso.dev",
      password: "senha123",
    }),
  });

  expect(response1.status).toBe(201);

  const response2 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "emailduplicado2",
      email: "Duplicado@curso.dev",
      password: "senha123",
    }),
  });

  expect(response2.status).toBe(400);

  const responseBody = await response2.json();

  expect(responseBody).toEqual({
    name: "ValidationError",
    message: "O email informado já está sendo utilizado",
    action: "Utilize outro email para realizar esta operação.",
    statusCode: 400,
  });
});

test("POST to /api/v1/user duplicate username should return 400", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "usernameduplicado",
      email: "duplicado1@curso.dev",
      password: "senha123",
    }),
  });

  expect(response1.status).toBe(201);

  const response2 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "usernameduplicado",
      email: "duplicado2@curso.dev",
      password: "senha123",
    }),
  });

  expect(response2.status).toBe(400);

  const responseBody = await response2.json();

  expect(responseBody).toEqual({
    name: "ValidationError",
    message: "O username informado já está sendo utilizado",
    action: "Utilize outro username para realizar esta operação.",
    statusCode: 400,
  });
});
