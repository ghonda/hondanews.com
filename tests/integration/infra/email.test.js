import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

describe("infra/email.js", () => {
  test("send", async () => {
    await email.send({
      from: "Honda<no-reply@honda.com>",
      to: "guilhermehonda@gmail.com",
      subject: "Teste Email",
      text: "Este é um email de teste.",
    });

    await email.send({
      from: "Honda<no-reply@honda.com>",
      to: "guilhermehonda@gmail.com",
      subject: "Teste outro Email",
      text: "Ultimo email enviado.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<no-reply@honda.com>");
    expect(lastEmail.recipients[0]).toBe("<guilhermehonda@gmail.com>");
    expect(lastEmail.subject).toBe("Teste outro Email");
    expect(lastEmail.text).toBe("Ultimo email enviado.\n");
  });
});
