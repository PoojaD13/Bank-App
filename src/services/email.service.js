const transporter = require("../config/mail");
const nodemailer = require("nodemailer");

// custom function to send the eamil 
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({ // built-in sendMail method of nodemailer(transporter)
      from: `"bank-app" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      text,
      html,
    });
  // log the msg id for testing purpose 
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// function to send registration email to the user content of the email 
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Bank App!";
  const text = `Hello ${name}, \n\n Thank you for registering at Bank App. We're exicted to have you on board!\n\n Best regards,\nThe Bank App team`;

  const html = `<p>Hello ${name}, <br/> Thank you for registering at Bank App. We're exicted to have you on board!<br /> Best regards,<br/>The Bank App team</p>`;

  await sendMail(userEmail, subject, text, html);
}
module.exports = {
  sendRegistrationEmail,
};
