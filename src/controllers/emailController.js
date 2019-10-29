// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const env = process.env.NODE_ENV || 'development';



let mailer;

if(env === 'test') {
  class MockMailer {
    constructor() {
      this.sent = [];
    }

    send(msg) {
      this.sent.push(msg)
    }
  }

  mailer = new MockMailer();
} else {

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  mailer = sgMail;
}

function sendMail(to) {

  const msg = {
    to: to,
    from: 'test@blocipedia.com',
    subject: 'Welcome to blocipedia!',
    text: "You have successfully signed up!",
  };
  sgMail.send(msg);

}

module.exports = { sendMail, mailer };
