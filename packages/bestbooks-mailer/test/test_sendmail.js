
const { SendEMail, SaveToDatabase, start_smtp_server } = require("../index");


describe("send email", function(){
    it("1. sending email",function(){
        var message = {
            text: "The following estimate has been created",
            html: "<b>The following estimate has been created</b>"
        }
        SendEMail("sender@domain.com",'receiver@domain.com',"New Estimate",message,25,function(results){
            console.log(results);
        })
    })
    it("2. save email results to database",function(){
        var message = {
            text: "The following estimate has been created",
            html: "<b>The following estimate has been created</b>"
        }

        var results = {
            status: 'success',
            location: 'sent',
            subject: 'New Estimate',
            domain: 'domain.com',
            date: '2023-03-10T17:10:34.182Z',
            info: {
                accepted: [ 'receiver@domain.com' ],
                rejected: [],
                ehlo: [ 'PIPELINING', 'SIZE 41943040', '8BITMIME', 'OK' ],
                envelopeTime: 197,
                messageTime: 517,
                messageSize: 727,
                response: '250 ok dirdel',
                envelope: { from: 'sender@domain.com', to: [Array] },
                messageId: '<9adaa7d7-d1ab-3e35-3026-2276b17edc92@domain.com>'
            },
            content: '',
            envelope: ''
        };
        SaveToDatabase(results.location,"sender@doman.com",'receiver@domain.com',results.date,results.subject,message.html,results.envelope,function(status){
            console.log(status);
        })
    
    })
    it("3. start smtp server", function(){
        start_smtp_server("domain.com",587)
    })
});