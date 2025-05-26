/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Cash = require('./cash');

class DigitalCurrency extends Cash {
    constructor(name, wallet) {
        super(name);
        this.wallet = wallet
    }

    getGroup() {
        return this.group;
    }

    getWallet() {
        return this.wallet;
    }
}

module.exports = DigitalCurrency;