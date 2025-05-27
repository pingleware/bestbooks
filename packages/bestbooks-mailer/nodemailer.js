"use strict";

class Transporter {
    constructor() {}

    sendMail(params, cb) {
        console.log(params);
        // Implement your sendMail logic here
        // For example, if you want to simulate sending mail and immediately invoke the callback:
        // invoke sendmail executable and return response whether success or error
        cb(null, { message: 'Mail sent successfully' });
    }
}

async function createTransport(options) {
    console.log(options);
    return new Transporter();
}


module.exports = {
    createTransport
};
