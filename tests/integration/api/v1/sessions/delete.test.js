import orchestrator from "tests/orchestrator";
import setCookieParser from "set-cookie-parser";
import session from "models/session";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
    await orchestrator.clearDatabase();
    await orchestrator.runPendingMigrations();
});

test("DELETE to /api/v1/sessions With nonexistent session", async () => {
    const nonexistentToken =
        "3245fa27dbb3a5dff2546342fd4d3b95b56b6ecfc8a68e0d5130b321c34012a4b5cdf3be74cb425b230c004b2b159632";
    const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
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
});

test("DELETE to /api/v1/sessions With expired session", async () => {
    jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
    });

    const createdUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
    });

    const sessionObject = await orchestrator.createSession(createdUser.id);

    jest.useRealTimers();

    const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
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
});

test("DELETE to /api/v1/sessions With valid session", async () => {
    const createdUser = await orchestrator.createUser({
        username: "DeleteValidSessionUser",
    });

    const sessionObject = await orchestrator.createSession(createdUser.id);

    const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
            Cookie: `session_id=${sessionObject.token}`,
        },
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
        id: sessionObject.id,
        token: sessionObject.token,
        user_id: sessionObject.user_id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
    });

    expect(
        responseBody.expires_at < sessionObject.expires_at.toISOString(),
    ).toBe(true);
    expect(
        responseBody.updated_at > sessionObject.updated_at.toISOString(),
    ).toBe(true);

    //Set-Cookie header assertion
    const parsedSetCookie = setCookieParser(response, { map: true });

    expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
    });

    // Double check assertions
    const doubleCheckResponse = await fetch(
        "http://localhost:3000/api/v1/user",
        {
            headers: {
                Cookie: `session_id=${sessionObject.token}`,
            },
        },
    );

    expect(doubleCheckResponse.status).toBe(401);

    const doubleCheckResponseBody = await doubleCheckResponse.json();

    expect(doubleCheckResponseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se o usuário está autenticado e tente novamente.",
        status_code: 401,
    });
});
