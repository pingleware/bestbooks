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
