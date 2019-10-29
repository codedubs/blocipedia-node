// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const env = process.env.NODE_ENV || 'development';

function sendMail(to) {

  const msg = {
    to: to,
    from: 'test@blocipedia.com',
    subject: 'Welcome to blocipedia!',
    text: "You have successfully signed up!",
  };
  sgMail.send(msg);

}

module.exports = sendMail;
