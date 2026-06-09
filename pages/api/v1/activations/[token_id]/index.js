import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import activation from "models/activation";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
    const activationTokenId = request.query.token_id;

    const validActivationToken =
        await activation.findOneValidById(activationTokenId);
    const usedActivationToken =
        await activation.markTokenAsUsed(activationTokenId);

    await activation.activateUserByUserId(validActivationToken.user_id);

    const secureOutputValues = authorization.filterOutput(
        request.context.user,
        "read:activation_token",
        usedActivationToken,
    );

    return response.status(200).json(secureOutputValues);
}
