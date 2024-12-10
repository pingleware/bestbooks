/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Expense = require('./expense');

class FixedCost extends Expense {
    constructor(name) {
        super(name,"FixedCost");
    }
}

module.exports = FixedCost;