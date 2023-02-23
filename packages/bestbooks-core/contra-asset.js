/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const AccountTypes = require('./accountTypes');
const Ledger = require('./ledger');

class ContraAsset extends Ledger {
    constructor(name,type=AccountTypes.ContraAsset) {
        super(name,type);
        this.group = 100;
    }

    getGroup() {
        return this.group;
    }

    increase(date,desc,amount) {
        this.balance = super.getBalance() + amount;
        super.setBalance(this.balance);
        return super.addCredit(date,desc,amount);
    }

    debit(date,desc,amount) {
        return this.decrease(date,desc,amount);
    }

    decrease(date,desc,amount) {
        this.balance = super.getBalance() - amount;
        super.setBalance(this.balance);
        return super.addDebit(date,desc,amount);
    }

    credit(date,desc,amount) {
        return this.increase(date,desc,amount);
    }

    getAccountBaseType() {
        return AccountTypes.Asset;
    }
}

module.exports = ContraAsset;