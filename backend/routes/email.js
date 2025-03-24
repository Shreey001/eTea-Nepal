const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Set API key from environment variable (make sure it's properly set up in your deployment environment)
sgMail.setApiKey(process.env.EMAIL_SECRET);

const sendEmail = (email, subject, message) => {
  const msg = {
    to: email,
    from: "ashish2.775421@bumc.tu.edu.np", // Use a verified sender email
    subject: subject,
    text: message,
    html: `<b>${message}</b>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

module.exports = sendEmail;
