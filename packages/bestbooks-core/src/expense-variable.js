/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Expense = require('./expense');

class VariableCost extends Expense {
    constructor(name) {
        super(name,"VariableCost");
    }

    getAccountBaseType() {
        return "VariableCost";
    }
}

module.exports = VariableCost;