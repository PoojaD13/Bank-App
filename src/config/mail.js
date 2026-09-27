const nodemailer = require("nodemailer");
const logger = require("./logger");

// creating transpoter using secure Gmail OAuth2
// - Starting to connect tot the SMTP server
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// to verify the connection configuration

transporter.verify((error, success) => {
  if (error) {
    logger.error("Error in mail server connection", error);
  } else {
    logger.info("Email server is ready to send message");
  }
});

module.exports = transporter;
