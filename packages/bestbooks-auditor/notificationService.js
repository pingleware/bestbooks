// notificationService.js
const nodemailer = require('nodemailer');

async function sendAlertEmail(abnormalTransactions,user,pass,sender,recipient,service='gmail') {
  const transporter = nodemailer.createTransport({
    service: service,
    auth: {
      user: user,
      pass: pass
    }
  });

  const message = `Alert: The following abnormal transactions were detected: ${JSON.stringify(abnormalTransactions)}`;

  await transporter.sendMail({
    from: sender,
    to: recipient,
    subject: 'Abnormal Transactions Detected',
    text: message
  });
}

module.exports = { sendAlertEmail };
