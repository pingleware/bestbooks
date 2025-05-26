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

const DigitalCurrency = require('./digitalcurrency');

class Bitcoin extends DigitalCurrency {
    constructor(wallet_address) {
        super("Bitcoin", wallet_address);
    }

    getQuoteURL() {
        return "https://query1.finance.yahoo.com/v7/finance/quote?symbols=ETH-USD";
    }
}

module.exports = Bitcoin;