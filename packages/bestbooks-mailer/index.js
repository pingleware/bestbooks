"use strict"

const os = require("os");
const path = require("path");
const { Model } = require("@pingleware/bestbooks-core");

const model = new Model();
model.insertSync(`CREATE TABLE IF NOT EXISTS "messages" (
	"id"	INTEGER,
	"location"	TEXT CHECK( location IN ('inbox','outbox','sent','trash') ) NOT NULL DEFAULT 'inbox',
	"sender"	TEXT,
	"recipient"	TEXT,
	"date"	TIMESTAMP,
	"subject"	TEXT,
	"content"	TEXT,
	"envelope"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)`);

function base64_encode(contents) {
    try {
        const buff = Buffer.from(contents, "utf8");
        return buff.toString("base64");    
    } catch(error) {
        console.log(error);
        return contents;
    }
}

function base64_decode(contents) {
    // create a buffer
    const buff = Buffer.from(contents, 'base64');

    // decode buffer as UTF-8
    return buff.toString('utf-8');
}

function SaveToDatabase(location, from, email, date, subject, html, envelope, callback) {
    var sql = `INSERT INTO messages (location, sender, recipient, date, subject, content, envelope) VALUES ('${location}', '${from}', '${email}', '${date}', '${subject}', '${html}','${envelope}')`;
    console.log(sql);
    model.insert(sql, function(results){
        callback(results);
    })
}

function ReadFromDatabase(email, callback) {
    var sql = `SELECT * FROM messages WHERE `;
    if (email.length > 0) {
        sql += `recipient='${email}' ORDER BY date DESC`;
    } else {
        sql = `SELECT * FROM messages ORDER BY date DESC`;
    }
    model.query(sql,callback);
}

function SendEMail(sender,recipient,subject,message,smtp_port=25,callback) {
    try {
        var content = base64_encode(JSON.stringify(message.html));
        var location;

        const dns = require('./dns');
        const domain = recipient.split('@')[1]; 
        console.log(domain);
        dns.resolve(domain, 'MX',async function(err, addresses) {
            if (err) {
                err.date = new Date().toISOString();
                console.log('Error in DNS resolve %s',err);
                location = 'outbox';
                var info = {
                    sender: sender,
                    recipient: recipient,
                    subject: subject,
                    content: content,
                    date: new Date().toISOString()
                };

                var envelope = base64_encode(JSON.stringify(info));

                callback({status: 'error', message: err, location: location, domain: sender.split('@')[1],recipient: recipient, info: info, content: info.content, envelope: envelope});
            } else if (addresses && addresses.length > 0) {   
                let ehlo = [];
                addresses[0].ehlo.forEach(function(param){
                    if (param.length > 4) {
                        ehlo.push(param.substring(4));
                    }
                })
        
                const toExchange = addresses[0].exchange;
                const nodemailer = require('./nodemailer');
                const transporter = await nodemailer.createTransport({
                    port: smtp_port,
                    host: toExchange,
                });
    
                console.log('transporter sendMail [654]');

                var params = {
                    from: sender, // sender address
                    to: recipient, // list of receivers
                    subject: subject, // Subject line
                    text: message.text, // plain text body
                    html: message.html, // html body
                    headers: {
                        'Sent-By':'BestBooks Mailer (https://www.npmjs.com/package/@pingleware/bestbooks-mailer)'
                    },
                    ehlo: ehlo         
                }
                transporter.sendMail(params, function(err, info){
                    console.log(['100',err,info]);
                    //info.subject = subject;
                    const date = new Date().toISOString();
   
                    const envelope = base64_encode(JSON.stringify(info));
    
                    if (err) {
                        console.log('#63: Error %s',err);
                        location = 'outbox';
                        callback({status: 'error', message: err, location: location, domain: sender.split('@')[1],recipient: recipient, date: date, info: info, content: content, envelope: envelope});
                    } else {
                        //var msgId = info.messageId.split('@')[0].substring(1);
                        console.log([message.html,content]);
                        location = 'sent';
                        //console.log({status: 'success', location: location, subject: subject, domain: sender.split('@')[1], date: date, info: info, content:content, envelope: envelope});
                        callback({line: 115, status: 'success', location: location, subject: subject, domain: sender.split('@')[1], date: date, info: info, content: content, envelope: envelope, ehlo: ehlo});
                    }
                });
            }
        });        
    } catch(error) {
        callback({status: 'error', message: error, location: location, domain: domain, sender: sender, recipient: recipient, info: info, content:content, envelope: envelope})
    }
}

/**
 * SMTP Server
 */
function start_smtp_server(hostname, port) {
    var email = "";
    var domain = "";
    var message = "";
    
    const nodeMailin = require("./node-mailin");
    //const user = require('../clientsite-ios/engine/user');
    
    /* Start the Node-Mailin server. The available options are:
     *  options = {
     *     port: 25,
     *     logFile: '/some/local/path',
     *     logLevel: 'warn', // One of silly, info, debug, warn, error
     *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
     *        SMTPBanner: 'Hi from a custom Node-Mailin instance',
     *        // By default, the DNS validation of the sender and recipient domains is disabled so.
     *        // You can enable it as follows:
     *        disableDNSValidation: false
     *     }
     *  };
     * parsed message. */
    nodeMailin.start({
      port: port,
      tmp: path.join(os.homedir(),'.bestbooks/mailbox'),
      smtpOptions: {
          banner: hostname,
      }
    });
    
    /* Access simplesmtp server instance. */
    nodeMailin.on("authorizeUser", function(connection, username, password, done) {
      if (username == config.smtp.username && password == config.smtp.password) {
        done(null, true);
      } else {
        done(new Error("Unauthorized!"), false);
      }
    });
    
    /* Event emitted when the "From" address is received by the smtp server. */
    nodeMailin.on('validateSender', async function(session, address, callback) {
        ValidateSenderAgainstBlockList(address, function(blocked){
            if (!blocked) {
                err = new Error('You are blocked'); /*Will be the SMTP server response*/
                err.responseCode = 530; /*Will be the SMTP server return code sent back to sender*/
                callback(err);
            } else {
                callback();
            }
        });
    });
    
    /* Event emitted when the "To" address is received by the smtp server. */
    nodeMailin.on('validateRecipient', async function(session, address, callback) {
        email = address;
        domain = address.split("@")[1];
        if (config.domains[domain]) {
            callback();
        }
        /* Here you can validate the address and return an error 
         * if you want to reject it e.g: 
         *     err = new Error('Email address not found on server');
         *     err.responseCode = 550;
         *     callback(err);*/
        var err = new Error('Not permitted'); /*Will be the SMTP server response*/
        err.responseCode = 550; /*Will be the SMTP server return code sent back to sender*/
        callback(err);
    });
    
    /* Event emitted when a connection with the Node-Mailin smtp server is initiated. */
    nodeMailin.on("startMessage", function(connection) {
      /* connection = {
          from: 'sender@somedomain.com',
          to: 'someaddress@yourdomain.com',
          id: 't84h5ugf',
          authentication: { username: null, authenticated: false, status: 'NORMAL' }
        }
      }; */
    });
    
    /* Event emitted after a message was received and parsed. */
    nodeMailin.on("message", function(connection, data, content) {
        message = ""; //atob(JSON.stringify(data));
        var html = base64_encode(JSON.stringify(data.html));
        var text = data.text;
        var date = data.date;
        var subject = data.subject;
        var from = data.from.text;
        var msgid = data.messageId;
        var fromName = from.split("<")[0];
        var fromEmail = data.envelopeFrom.address;
        var envelope = base64_encode(JSON.stringify(data));
    
        SaveToDatabase("inbox",from,email,date,subject,html,envelope, function(results){
        });
    });
    
    nodeMailin.on("error", function(error) {
      console.log(error);
    });    
}

module.exports = {
    start_smtp_server,
    base64_encode,
    base64_decode,
    SendEMail,
    SaveToDatabase,
    ReadFromDatabase
}