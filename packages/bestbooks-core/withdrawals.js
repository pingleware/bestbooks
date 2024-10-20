/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

 const Expense = require('./expense');


class Withdrawals extends Expense {
    constructor(name) {
        super(name);
    }
}

module.exports = Withdrawals;