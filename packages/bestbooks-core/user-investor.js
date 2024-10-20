/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const User = require('./user');

class Investor extends User {

    constructor() {
        super("Investor");
    }
}

module.exports = Investor;