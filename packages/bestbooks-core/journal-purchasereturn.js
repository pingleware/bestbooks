/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class PurchaseReturnJournal extends Journal {

    constructor() {
        super("PurchaseReturn");
    }
}

module.exports = PurchaseReturnJournal;