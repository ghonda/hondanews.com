import email from "infra/email.js";

async function sendEmailToUser(user) {
  await email.send({
    from: "Contato <contato@example.com>",
    to: user.email,
    subject: "Activate your account",
    text: `Hello ${user.username}, please activate your account by clicking the link below.
    
http://link...

Regards,
The Team
`,
  });
}

const activation = {
  sendEmailToUser,
};

export default activation;
