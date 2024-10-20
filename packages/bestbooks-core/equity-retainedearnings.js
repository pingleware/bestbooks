/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Equity = require('./equity');

class RetainedEarnings extends Equity {
    constructor() {
        super("RetainedEarnings");
    }

}

module.exports = RetainedEarnings;