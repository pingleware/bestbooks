"use strict"

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

function SendEMail(sender,recipient,subject,message,smtp_port=25,callback) {
    try {
        var content = base64_encode(JSON.stringify(message.html));
        var location;

        const dns = require('dns');
        const domain = recipient.split('@')[1]; 
        console.log(domain);
        dns.resolve(domain, 'MX', function(err, addresses) {
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
                const toExchange = addresses[0].exchange;
                const nodeMailin = require('nodemailer');
                const transporter = nodeMailin.createTransport({
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
                    }               
                }
                transporter.sendMail(params, function(err, info){
                    console.log([err,info]);
                    //info.subject = subject;
                    var date = new Date().toISOString();
   
                    var envelope = base64_encode(JSON.stringify(info));
    
                    if (err) {
                        console.log('#63: Error %s',err);
                        location = 'outbox';
                        callback({status: 'error', message: err, location: location, domain: sender.split('@')[1],recipient: recipient, date: date, info: info, content: content, envelope: envelope});
                    } else {
                        //var msgId = info.messageId.split('@')[0].substring(1);
                        console.log([message.html,content]);
                        location = 'sent';
                        //console.log({status: 'success', location: location, subject: subject, domain: sender.split('@')[1], date: date, info: info, content:content, envelope: envelope});
                        callback({status: 'success', location: location, subject: subject, domain: sender.split('@')[1], date: date, info: info, content:content, envelope: envelope});
                    }
                });
            }
        });        
    } catch(error) {
        callback({status: 'error', message: error, location: location, domain: domain, sender: sender, recipient: recipient, info: info, content:content, envelope: envelope})
    }
}

module.exports = {
    SendEMail,
    SaveToDatabase
}