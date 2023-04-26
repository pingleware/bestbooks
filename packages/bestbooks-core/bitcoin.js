/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
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