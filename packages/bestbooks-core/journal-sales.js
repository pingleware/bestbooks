/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class SalesJournal extends Journal {

    constructor() {
        super("Sales");
    }
}

module.exports = SalesJournal;