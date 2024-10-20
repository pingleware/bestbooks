/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class CashPaymentsJournal extends Journal {

    constructor() {
        super("CashPayments");
    }

    async recordPayment(record) {
        await super.add(record.date,record.ref,record.account,record.debit,record.credit);
    }
}

module.exports = CashPaymentsJournal;