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

/**
 * Example Usage:
 * 
 * const Treasury = require('./Treasury');
 * 
 * // Initial equity balance of 10,000
 * const equityAccount = new Treasury(10000);  
 * console.log('Initial Equity:', equityAccount.getBalance());  // 10,000
 * 
 * // Repurchase stock worth 2,000
 * equityAccount.repurchase(2000);  
 * console.log('After Repurchase:', equityAccount.getBalance());  // 8,000
 * console.log('Treasury Stock Balance:', equityAccount.getTreasuryStock());  // 2,000
 * 
 * // Reissue 1,000 worth of treasury stock
 * equityAccount.reissue(1000);  
 * console.log('After Reissue:', equityAccount.getBalance());  // 9,000
 * console.log('Treasury Stock Balance:', equityAccount.getTreasuryStock());  // 1,000
 * 
 */

const ContraEquity = require('./contra-equity.js');

class Treasury extends ContraEquity {
    constructor() {
        super("Treasury");
    }

    getAccountBaseType() {
        return "ContraEquity";
    }

    // Buyback shares (debit operation, reducing equity)
    buybackShares(date, desc, amount, company_id = 0, office_id = 0, location = 0) {
        return this.addDebit(date, desc, amount, company_id, office_id);
    }

    // Reissue treasury shares (credit operation, increasing equity)
    reissueShares(date, desc, amount, company_id = 0, office_id = 0) {
        return this.addCredit(date, desc, amount, company_id, office_id);
    }
}

module.exports = Treasury;