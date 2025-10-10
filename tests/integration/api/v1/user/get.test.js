import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

test("GET to /api/v1/user should return 200", async () => {
  const createdUser = await orchestrator.createUser({
    username: "UserWithValidSession",
  });

  const sessionObject = await orchestrator.createSession(createdUser.id);

  const response = await fetch("http://localhost:3000/api/v1/user", {
    headers: {
      Cookie: `session_id=${sessionObject.token}`,
    },
  });

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    id: createdUser.id,
    username: "UserWithValidSession",
    email: createdUser.email,
    password: createdUser.password,
    created_at: createdUser.created_at.toISOString(),
    updated_at: createdUser.updated_at.toISOString(),
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
});
