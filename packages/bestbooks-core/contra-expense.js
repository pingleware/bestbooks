/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const AccountTypes = require('./accountTypes');
const ContraAsset = require('./contra-asset');

class ContraExpense extends ContraAsset {
    constructor(name) {
        super(name,AccountTypes.Expense);
        this.group = 400;
    }

    getGroup() {
        return this.group;
    }
}

module.exports = ContraExpense;