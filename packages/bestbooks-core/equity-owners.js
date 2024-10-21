/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Equity = require('./equity');

class OwnersEquity extends Equity {
    constructor(name) {
        super(name);
    }

    distributeDividends(date, desc, amount, company_id = 0, office_id = 0) {
        // Distributing dividends (debit to owner's equity)
        return this.addDebit(date, desc, amount, company_id, office_id);
    }

    addInvestment(date, desc, amount, company_id = 0, office_id = 0) {
        // Adding investment (credit to owner's equity)
        return this.addCredit(date, desc, amount, company_id, office_id);
    }
}

module.exports = OwnersEquity;