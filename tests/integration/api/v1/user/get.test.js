import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import session from "models/session.js";
import setCookieParser from "set-cookie-parser";

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

  const cacheControl = response.headers.get("Cache-Control");
  expect(cacheControl).toBe("no-store, no-cache, must-revalidate, max-age=0");

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

  // Session renewal assertions
  const renewedSessionObject = await session.findOneValidByToken(
    sessionObject.token,
  );

  expect(renewedSessionObject.expires_at > sessionObject.expires_at).toBe(true);
  expect(renewedSessionObject.updated_at > sessionObject.updated_at).toBe(true);

  //Set-Cookie header assertion
  const parsedSetCookie = setCookieParser(response, { map: true });

  expect(parsedSetCookie.session_id).toEqual({
    name: "session_id",
    value: sessionObject.token,
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    path: "/",
    httpOnly: true,
  });
});

test("GET to /api/v1/user nonexistent session", async () => {
  const nonexistentToken =
    "3245fa27dbb3a5dff2546342fd4d3b95b56b6ecfc8a68e0d5130b321c34012a4b5cdf3be74cb425b230c004b2b159632";

  const response = await fetch("http://localhost:3000/api/v1/user", {
    headers: {
      Cookie: `session_id=${nonexistentToken}`,
    },
  });

  expect(response.status).toBe(401);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "UnauthorizedError",
    message: "Usuário não possui sessão ativa.",
    action: "Verifique se o usuário está autenticado e tente novamente.",
    status_code: 401,
  });

  // Set-Cookie assertions
  const parsedSetCookie = setCookieParser(response, {
    map: true,
  });

  expect(parsedSetCookie.session_id).toEqual({
    name: "session_id",
    value: "invalid",
    maxAge: -1,
    path: "/",
    httpOnly: true,
  });
});

test("GET to /api/v1/user with expired session", async () => {
  jest.useFakeTimers({
    now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
  });

  const createdUser = await orchestrator.createUser({
    username: "UserWithExpiredSession",
  });

  const sessionObject = await orchestrator.createSession(createdUser.id);

  jest.useRealTimers();

  const response = await fetch("http://localhost:3000/api/v1/user", {
    headers: {
      Cookie: `session_id=${sessionObject.token}`,
    },
  });

  expect(response.status).toBe(401);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    name: "UnauthorizedError",
    message: "Usuário não possui sessão ativa.",
    action: "Verifique se o usuário está autenticado e tente novamente.",
    status_code: 401,
  });

  // Set-Cookie assertions
  const parsedSetCookie = setCookieParser(response, {
    map: true,
  });

  expect(parsedSetCookie.session_id).toEqual({
    name: "session_id",
    value: "invalid",
    maxAge: -1,
    path: "/",
    httpOnly: true,
  });
});
