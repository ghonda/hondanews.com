import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

test("PATCH to /api/v1/[username] without user", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/users/usuarioinexistente",
    {
      method: "PATCH",
    },
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

test("PATCH to /api/v1/user duplicate username should return 400", async () => {
  const user1Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "user1",
      email: "user1@curso.dev",
      password: "senha123",
    }),
  });

  expect(user1Response.status).toBe(201);

  const user2Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "user2",
      email: "user2@curso.dev",
      password: "senha123",
    }),
  });

  expect(user2Response.status).toBe(201);

  const response = await fetch("http://localhost:3000/api/v1/users/user2", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "user1",
    }),
  });

  expect(response.status).toBe(400);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "ValidationError",
    message: "O username informado já está sendo utilizado",
    action: "Utilize outro username para realizar esta operação.",
    statusCode: 400,
  });
});

test("PATCH to /api/v1/user duplicate email should return 400", async () => {
  const user1Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "email1",
      email: "email1@curso.dev",
      password: "senha123",
    }),
  });

  expect(user1Response.status).toBe(201);

  const user2Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "email2",
      email: "email2@curso.dev",
      password: "senha123",
    }),
  });

  expect(user2Response.status).toBe(201);

  const response = await fetch("http://localhost:3000/api/v1/users/email2", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "email1@curso.dev",
    }),
  });

  expect(response.status).toBe(400);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "ValidationError",
    message: "O email informado já está sendo utilizado",
    action: "Utilize outro email para realizar esta operação.",
    statusCode: 400,
  });
});

test("PATCH to /api/v1/user unique username should return 200", async () => {
  const user1Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "uniqueUser1",
      email: "uniqueUser1@curso.dev",
      password: "senha123",
    }),
  });

  expect(user1Response.status).toBe(201);

  const response = await fetch(
    "http://localhost:3000/api/v1/users/uniqueUser1",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "uniqueUser2",
      }),
    },
  );

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    id: responseBody.id,
    username: "uniqueUser2",
    email: "uniqueUser1@curso.dev",
    password: responseBody.password,
    created_at: responseBody.created_at,
    updated_at: responseBody.updated_at,
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  expect(responseBody.updated_at > responseBody.created_at).toBe(true);
});

test("PATCH to /api/v1/user unique email should return 200", async () => {
  const user1Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "uniqueEmail1",
      email: "uniqueEmail1@curso.dev",
      password: "senha123",
    }),
  });

  expect(user1Response.status).toBe(201);

  const response = await fetch(
    "http://localhost:3000/api/v1/users/uniqueEmail1",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "uniqueEmail2@curso.dev",
      }),
    },
  );

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    id: responseBody.id,
    username: "uniqueEmail1",
    email: "uniqueEmail2@curso.dev",
    password: responseBody.password,
    created_at: responseBody.created_at,
    updated_at: responseBody.updated_at,
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  expect(responseBody.updated_at > responseBody.created_at).toBe(true);
});

test("PATCH to /api/v1/user new password should return 200", async () => {
  const user1Response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "newPassword1",
      email: "newPassword1@curso.dev",
      password: "newPassword1",
    }),
  });

  expect(user1Response.status).toBe(201);

  const response = await fetch(
    "http://localhost:3000/api/v1/users/newPassword1",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "newPassword2",
      }),
    },
  );

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    id: responseBody.id,
    username: "newPassword1",
    email: "newPassword1@curso.dev",
    password: responseBody.password,
    created_at: responseBody.created_at,
    updated_at: responseBody.updated_at,
  });

  expect(uuidVersion(responseBody.id)).toBe(4);
  expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  expect(responseBody.updated_at > responseBody.created_at).toBe(true);

  const userInDatabase = await user.findOneByUsername("newPassword1");
  const correctPasswordMatch = await password.compare(
    "newPassword2",
    userInDatabase.password,
  );

  expect(correctPasswordMatch).toBe(true);

  const incorrectPasswordMatch = await password.compare(
    "newPassword1",
    userInDatabase.password,
  );
  expect(incorrectPasswordMatch).toBe(false);
});
