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

class EmployeeShares extends Equity {
    constructor() {
        super("EmployeeShares");
    }

    issueShares(date, desc, amount, company_id = 0, office_id = 0) {
        // Issuing shares increases equity (credit to Employee Equity)
        return this.addCredit(date, desc, amount, company_id, office_id);
    }

    redeemShares(date, desc, amount, company_id = 0, office_id = 0, location = 0) {
        // Redeeming shares decreases equity (debit to Employee Equity)
        return this.addDebit(date, desc, amount, company_id, office_id);
    }
}

module.exports = EmployeeShares;