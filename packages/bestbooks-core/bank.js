/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

const Cash = require('./cash');

class Bank extends Cash {
    constructor(name) {
        super(name);
    }
}

module.exports = Bank;