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

class PreferredShares extends Equity {
    constructor() {
        super("PreferredShares");
    }

    issueDividends(date, desc, amount, company_id = 0, office_id = 0) {
        // Issuing dividends decreases the account (debit)
        return this.addDebit(date, desc, amount, company_id, office_id);
    }

    issueShares(date, desc, amount, company_id = 0, office_id = 0) {
        // Issuing new shares increases the account (credit)
        return this.addCredit(date, desc, amount, company_id, office_id);
    }
}

module.exports = PreferredShares;