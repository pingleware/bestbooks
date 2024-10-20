/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Journal = require('./journal.js');

class FixedAssetJournal extends Journal {

    constructor() {
        super("FixedAsset");
    }
}

module.exports = FixedAssetJournal;