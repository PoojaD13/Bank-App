const transporter = require("../config/mail");
const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"bank-app" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Bank App!";
  const text = `Hello ${name}, \n\n Thank you for registering at Bank App. We're exicted to have you on board!\n\n Best regards,\nThe Bank App team`;

  const html = `<p>Hello ${name}, <br/> Thank you for registering at Bank App. We're exicted to have you on board!<br /> Best regards,<br/>The Bank App team</p>`;

  await sendMail(userEmail, subject, text, html);
}
module.exports = {
  sendRegistrationEmail,
};
