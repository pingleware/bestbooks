"use strict";

const EventEmitter = require('events');

class StartEmitter extends EventEmitter {
    constructor() {
        super();
    }

    async start(params) {
        console.log(params);
    }
}

const startEmitter = new StartEmitter();

module.exports = startEmitter;
