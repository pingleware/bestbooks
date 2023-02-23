/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const AccountTypes = require('./accountTypes');
const Ledger = require('./ledger');

class ContraLiability extends Ledger {

    constructor(name,type=AccountTypes.ContraLiability) {
        super(name,type);
        this.group = 200;
    }

    getGroup() {
        return this.group;
    }

    /**
    * A credit is an accounting entry that either increases a liability or equity account, 
    * or decreases an asset or expense account. It is positioned to the right in an accounting entry.
    */
    increase(date,desc,amount) {
        this.balance = super.getBalance() + Number(amount);
        super.setBalance(this.balance);
        return super.addDebit(date,desc,amount);
    }

    credit(date,desc,amount) {
        return this.decrease(date,desc,amount);
    }

    /**
    * A debit is an accounting entry that either increases an asset or expense account, 
    * or decreases a liability or equity account. It is positioned to the left in an accounting entry.
    */
    decrease(date,desc,amount) {
        this.balance = super.getBalance() - Number(amount);
        super.setBalance(this.balance);
        return super.addCredit(date,desc,amount);
    }

    debit(date,desc,amount) {
        return this.increase(date,desc,amount);
    }

    getAccountBaseType() {
        return AccountTypes.Liability;
    }
}

module.exports = ContraLiability;