import * as cookies from "cookie";
import session from "models/session.js";
import user from "models/user.js";
import authorization from "models/authorization.js";

import {
    InternalServerError,
    MethodNotAllowedError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
} from "infra/errors";

function onErrorHandler(error, request, response) {
    if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
    ) {
        if (
            error instanceof ValidationError ||
            error instanceof NotFoundError ||
            error instanceof ForbiddenError
        ) {
            return response.status(error.status_code).json(error);
        }

        if (error instanceof UnauthorizedError) {
            clearSessionCookie(response);
            return response.status(error.status_code).json(error);
        }
    }

    const publicErrorObject = new InternalServerError({
        cause: error,
    });
    console.error(publicErrorObject);

    response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onNoMatchHandler(request, response) {
    const publicErrorObject = new MethodNotAllowedError();
    response.status(publicErrorObject.status_code).json(publicErrorObject);
}

async function setSessionCookie(response, sessionToken) {
    const setCookie = cookies.serialize("session_id", sessionToken, {
        path: "/",
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    });

    response.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(response) {
    const setCookie = cookies.serialize("session_id", "invalid", {
        path: "/",
        maxAge: -1,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    });

    response.setHeader("Set-Cookie", setCookie);
}

async function injectAnonymousOrUser(request, response, next) {
    if (request.cookies?.session_id) {
        await injectAuthenticatedUser(request);
        return next();
    }

    injectAnonymousUser(request);
    return next();
}

async function injectAuthenticatedUser(request) {
    const sessionToken = request.cookies.session_id;
    const sessionObject = await session.findOneValidByToken(sessionToken);
    const userObject = await user.findOneById(sessionObject.user_id);
    request.context = {
        ...request.context,
        user: userObject,
    };
}

async function injectAnonymousUser(request) {
    const anonymousUserObject = {
        features: ["read:activation_token", "create:session", "create:user"],
    };
    request.context = {
        ...request.context,
        user: anonymousUserObject,
    };
}

function canRequest(feature) {
    return function canRequestMiddleware(request, response, next) {
        const useTryingToRequest = request.context.user;
        if (authorization.can(useTryingToRequest, feature)) {
            return next();
        }
        throw new ForbiddenError({
            message: "Você não possui permissão para realizar esta ação.",
            action: `Verifique se o seu usuário possui a ${feature} necessária.`,
        });
    };
}

const controller = {
    errorHandlers: {
        onNoMatch: onNoMatchHandler,
        onError: onErrorHandler,
    },
    setSessionCookie,
    clearSessionCookie,
    injectAnonymousOrUser,
    canRequest,
};

export default controller;
