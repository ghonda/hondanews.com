import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

test("POST to /api/v1/annymous user should return 200", async () => {
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
    password: "senha123",
    created_at: responseBody.created_at,
    updated_at: responseBody.updated_at,
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
});
