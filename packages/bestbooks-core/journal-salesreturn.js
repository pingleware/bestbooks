/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class SalesReturnJournal extends Journal {

    constructor() {
        super("SalesReturn");
    }
}

module.exports = SalesReturnJournal;