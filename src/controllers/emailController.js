// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMail(to, subject, text) {

  const msg = {
    to: to,
    from: 'test@example.com',
    subject: subject,
    text: text,
  };
  sgMail.send(msg);

}

module.exports = sendMail;
