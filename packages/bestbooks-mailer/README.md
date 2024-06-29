# BestBooks Accounting Application Framework - Mailer

This component provides the mailer functionality for sending and receiving email from within the BestBooks Accounting Application Framework.

## SMTP Server

BestBooks Mailer has a builtin SMTP Server. When sending mail from BestBooks Mailer, the email will be placed end the recipient's spam folder unless you have properly configured your DNS settings. Please contact [https://pingleware.support](https://pingleware.support) for assistance with configuring DNS for BestBooks Mailer to properly deliver mail to the inbox and not the spam folder.

To start the SMTP server, invoke the start_smtp_server function specifying the hostname and port as the parameters.

## Exported Functions

* start_smtp_server
* base64_encode
* base64_decode
* SendEMail
* SaveToDatabase
* ReadFromDatabase

## Replacing dns, nodemailer, and node-mailin packages

The SNYK package monitor is reporting serious vulnerabilities with these packages, internal implementation of these module necessary functionality is required. The mocha sendmail.test.js, produces a passing, not functioning result,

```
  send email
domain.com
{ port: 25, host: '192.168.1.10' }
    ✔ 1. sending email
transporter sendMail [654]
{
  from: 'sender@domain.com',
  to: 'receiver@domain.com',
  subject: 'New Estimate',
  text: 'The following estimate has been created',
  html: '<b>The following estimate has been created</b>',
  headers: {
    'Sent-By': 'BestBooks Mailer (https://www.npmjs.com/package/@pingleware/bestbooks-mailer)'
  }
}
[ '100', null, { message: 'Mail sent successfully' } ]
[
  '<b>The following estimate has been created</b>',
  'IjxiPlRoZSBmb2xsb3dpbmcgZXN0aW1hdGUgaGFzIGJlZW4gY3JlYXRlZDwvYj4i'
]
{
  line: 115,
  status: 'success',
  location: 'sent',
  subject: 'New Estimate',
  domain: 'domain.com',
  date: '2024-05-16T14:09:00.810Z',
  info: { message: 'Mail sent successfully' },
  content: 'IjxiPlRoZSBmb2xsb3dpbmcgZXN0aW1hdGUgaGFzIGJlZW4gY3JlYXRlZDwvYj4i',
  envelope: 'eyJtZXNzYWdlIjoiTWFpbCBzZW50IHN1Y2Nlc3NmdWxseSJ9'
}
{
  status: 'success',
  location: 'sent',
  subject: 'New Estimate',
  domain: 'domain.com',
  date: '2024-05-16T14:09:00.811Z',
  info: {
    accepted: [ 'receiver@domain.com' ],
    rejected: [],
    ehlo: [ 'PIPELINING', 'SIZE 1', '8BITMIME', 'OK' ],
    envelopeTime: 197,
    messageTime: 517,
    messageSize: 727,
    response: '250 ok dirdel',
    envelope: { from: 'sender@domain.com', to: [Array] },
    messageId: '<5k4ru1zgv-1715868540811@domain.com>'
  },
  content: 'IjxiPlRoZSBmb2xsb3dpbmcgZXN0aW1hdGUgaGFzIGJlZW4gY3JlYXRlZDwvYj4i',
  envelope: 'eyJtZXNzYWdlIjoiTWFpbCBzZW50IHN1Y2Nlc3NmdWxseSJ9'
}
INSERT INTO messages (location, sender, recipient, date, subject, content, envelope) VALUES ('sent', 'sender@doman.com', 'receiver@domain.com', '2024-05-16T14:09:00.811Z', 'New Estimate', '<b>The following estimate has been created</b>','eyJtZXNzYWdlIjoiTWFpbCBzZW50IHN1Y2Nlc3NmdWxseSJ9')
    ✔ 2. save email results to database
{
  port: 587,
  tmp: '~/.bestbooks/mailbox',
  smtpOptions: { banner: 'domain.com' }
}
    ✔ 3. start smtp server


  3 passing (6ms)

34
```

next to complete the implementation of each...
