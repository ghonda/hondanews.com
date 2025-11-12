import {version as uuidVersion} from "uuid";
import activation from "models/activation.js";
import user from "models/user.js";
import orchestrator from "tests/orchestrator.js";
import { de } from "@faker-js/faker/.";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
    await orchestrator.clearDatabase();
    await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/activations/[token_id]", () => {
    describe("Anonymous user", () => {
        test("With nonexistent token", async () => {
            const response = await fetch(
                "http://localhost:3000/api/v1/activations/nonexistenttoken",
                { method: "PATCH" },
            );

            expect(response.status).toBe(404);



        });
    });

});