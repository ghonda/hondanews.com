import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

test("Get to /api/v1/[username] should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "MesmoCase",
      email: "mesmo.case@curso.dev",
      password: "senha123",
    }),
  });

  expect(response1.status).toBe(201);

  const response2 = await fetch("http://localhost:3000/api/v1/users/MesmoCase");

  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(response2Body).toEqual({
    id: response2Body.id,
    username: "MesmoCase",
    email: "mesmo.case@curso.dev",
    password: "senha123",
    created_at: response2Body.created_at,
    updated_at: response2Body.updated_at,
  });

  expect(uuidVersion(response2Body.id)).toBe(4);
  expect(Date.parse(response2Body.created_at)).not.toBeNaN();
  expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
});

test("Get to /api/v1/[username] case mismatch", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "CaseDiferente",
      email: "case.diferente@curso.dev",
      password: "senha123",
    }),
  });

  expect(response1.status).toBe(201);

  const response2 = await fetch(
    "http://localhost:3000/api/v1/users/casediferente",
  );

  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(response2Body).toEqual({
    id: response2Body.id,
    username: "CaseDiferente",
    email: "case.diferente@curso.dev",
    password: "senha123",
    created_at: response2Body.created_at,
    updated_at: response2Body.updated_at,
  });

  expect(uuidVersion(response2Body.id)).toBe(4);
  expect(Date.parse(response2Body.created_at)).not.toBeNaN();
  expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
});

test("Get to /api/v1/[username] without user", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/users/usuarioinexistente",
  );

  expect(response.status).toBe(404);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "NotFoundError",
    message: "O username informado não foi encontrado no sistema",
    action: "Verifique se o username está digitado corretamente",
    statusCode: 404,
  });
});
