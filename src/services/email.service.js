const transporter = require("../config/mail");
const nodemailer = require("nodemailer");

// custom function to send the eamil
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      // built-in sendMail method of nodemailer(transporter)
      from: `"bank-app" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      text,
      html,
    });
    // log the msg id for testing purpose
    // console.log("Email sent successfully:", info);
    // console.log("Message sent: %s", info.messageId.toString());
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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

async function sendTransactionEmail(user, transaction) {
  let subject = "";
  let messageBody = "";

  // 1. Dynamic content generator based on transfer type
  switch (transaction.transferType) {
    case "initial_balance":
      subject = "Welcome! Your Account Opening Balance Has Been Set";
      messageBody = `Your initial funding of $${transaction.amount} has been successfully credited to your account. Welcome to our bank app!`;
      break;

    case "deposit":
      subject = "Deposit Successful";
      messageBody = `Your deposit of $${transaction.amount} has been successfully processed and added to your balance.`;
      break;

    case "withdrawal":
      subject = "Withdrawal Processed";
      messageBody = `A withdrawal of $${transaction.amount} has been successfully processed from your account.`;
      break;

    case "transfer":
      subject = "Transfer Successful";
      messageBody = `Your transfer of $${transaction.amount} to account ${transaction.toAccountNo} has been successfully processed.`;
      break;

    default:
      subject = "Transaction Notification";
      messageBody = `Your transaction of $${transaction.amount} has been successfully processed.`;
  }

  // 2. Build standard email templates using the dynamic body
  const text = `Hello ${user.name},\n\n${messageBody}\n\nBest regards,\nThe Bank App team`;
  const html = `<p>Hello ${user.name},</p><p>${messageBody}</p><p>Best regards,<br/>The Bank App team</p>`;

  // 3. Dispatch email
  await sendMail(user.email, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
};
