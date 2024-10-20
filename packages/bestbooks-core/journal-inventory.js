/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class InventoryJournal extends Journal {

    constructor() {
        super("Inventory");
    }
}

module.exports = InventoryJournal;