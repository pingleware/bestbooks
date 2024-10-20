/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class PurchasesJournal extends Journal {

    constructor() {
        super("Purchases");
    }

}

module.exports = PurchasesJournal;