/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Equity = require('./equity');

class OwnersEquity extends Equity {
    constructor(name) {
        super(name);
    }
}

module.exports = OwnersEquity;