import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import { ForbiddenError } from "infra/errors";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(getHandler);
router.patch(controller.canRequest("update:user"), patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
    const userTryingToGet = request.context.user;
    const username = request.query.username;
    const userFound = await user.findOneByUsername(username);

    const segureOutputValues = authorization.filterOutput(
        userTryingToGet,
        "read:user",
        userFound,
    );

    return response.status(200).json(segureOutputValues);
}

async function patchHandler(request, response) {
    const username = request.query.username;
    const userInputValues = request.body;

    const userTryingToUpdate = request.context.user;

    const targetUser = await user.findOneByUsername(username);

    if (!authorization.can(userTryingToUpdate, "update:user", targetUser)) {
        throw new ForbiddenError({
            message: "Você não tem permissão para atualizar outro usuário.",
            action: "Verifique se você possui a feature necessária para atualizar outro usuário.",
        });
    }

    const updatedUser = await user.update(username, userInputValues);

    const secureOutputValues = authorization.filterOutput(
        userTryingToUpdate,
        "read:user",
        updatedUser,
    );

    return response.status(200).json(secureOutputValues);
}
