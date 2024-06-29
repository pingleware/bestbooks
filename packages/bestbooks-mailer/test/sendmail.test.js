
const { SendEMail, SaveToDatabase, start_smtp_server } = require("../index");
const generateMessageId = require("../generateMsgId");

describe("send email", function(){
    it("1. sending email",function(){
        var message = {
            text: "The following estimate has been created",
            html: "<b>The following estimate has been created</b>"
        }
        SendEMail("sender@smtp.com",'receiver@gmail.com',"New Estimate",message,25,function(results){
            //console.log(results);
            var status = {
                status: 'success',
                location: 'sent',
                subject: results.subject,
                domain: results.domain,
                date: new Date().toISOString(),
                info: {
                    accepted: [ `receiver@${results.domain}` ],
                    rejected: [],
                    ehlo: results.ehlo,
                    envelopeTime: new Date(results.date).getTime(),
                    messageTime: new Date(results.date).getTime(),
                    messageSize: results.content.length,
                    response: '250 ok dirdel',
                    envelope: { from: `sender@${results.domain}`, to: `receiver@${results.domain}` },
                    messageId: `<${generateMessageId()}@${results.domain}>`
                },
                content: results.content,
                envelope: results.envelope
            };
            console.log(status)
                
        })
    })
    /*
    it("2. save email results to database",function(){
        var message = {
            text: "The following estimate has been created",
            html: "<b>The following estimate has been created</b>"
        }

        var results = {
            status: 'success',
            location: 'sent',
            subject: 'New Estimate',
            domain: 'smtp.com',
            date: new Date().toISOString(),
            info: {
                accepted: [ 'receiver@domain.com' ],
                rejected: [],
                ehlo: [],
                envelopeTime: 197,
                messageTime: 517,
                messageSize: 727,
                response: '250 ok dirdel',
                envelope: { from: 'sender@domain.com', to: '' },
                messageId: `<${generateMessageId()}@domain.com>`
            },
            content: status.content,
            envelope: status.envelope
        };
        console.log(results)
        SaveToDatabase(results.location,"sender@doman.com",'receiver@domain.com',results.date,results.subject,message.html,results.envelope,function(status){
            console.log(status);
        })
    
    })
    it("3. start smtp server", function(){
        start_smtp_server("smtp.com",587)
    })
    */
});