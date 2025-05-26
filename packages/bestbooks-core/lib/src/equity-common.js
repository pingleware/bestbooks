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

const Equity = require('./equity.js');

class CommonShares extends Equity {
    constructor() {
        super("CommonShares");
    }

    issueShares(date, desc, amount, company_id = 0, office_id = 0) {
        // Issuing shares (credit to common shares)
        return this.addCredit(date, desc, amount, company_id, office_id);
    }

    buybackShares(date, desc, amount, company_id = 0, office_id = 0, location = 0) {
        // Buying back shares (debit to common shares)
        return this.addDebit(date, desc, amount, company_id, office_id);
    }
}

module.exports = CommonShares;