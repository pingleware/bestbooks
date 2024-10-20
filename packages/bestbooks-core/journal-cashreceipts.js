/**
 * State of Florida
 * BestBooks Accounting Application Framework Trademark
 * All Rights Reserved © 2021
 * 
 * This file is part of bestbooks-core project.
 * Copyright © 2021 PRESSPAGE ENTERTAINMENT INC.
 * 
 * Licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * You may use, share, and adapt this file, provided you give appropriate credit, indicate
 * if changes were made, and distribute any derivatives under the same license.
 *  
 * You can view the full license at https://creativecommons.org/licenses/by/4.0/
 */

"use strict"

const Journal = require('./journal.js');

class CashReceiptsJournal extends Journal {

    constructor() {
        super("CashReceipts");
    }

    async recordReceipt(record) {
        await super.add(record.date,record.ref,record.account,record.debit,record.credit);
    }
}

module.exports = CashReceiptsJournal;