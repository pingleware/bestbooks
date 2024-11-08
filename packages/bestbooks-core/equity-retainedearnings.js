/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Equity = require('./equity');

class RetainedEarnings extends Equity {
    constructor() {
        super("RetainedEarnings");
    }

    distributeEarnings(date, desc, amount, company_id = 0, office_id = 0) {
        // Specific method for Retained Earnings
        return this.addDebit(date, desc, amount, company_id, office_id);
    }

    retainEarnings(date, desc, amount, company_id = 0, office_id = 0, location = 0) {
        // Retain earnings by crediting the account
        return this.addCredit(date, desc, amount, company_id, office_id);
    }
}

module.exports = RetainedEarnings;