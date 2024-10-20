/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class PayrollJournal extends Journal {

    constructor() {
        super("Payroll");
    }
}

module.exports = PayrollJournal;