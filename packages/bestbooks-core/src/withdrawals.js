/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

 const Expense = require('./expense');


class Withdrawals extends Expense {
    constructor(name) {
        super(name);
    }

    async deposit(date,desc,amount,company_id=0,office_id=0) {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }
        await super.addDebit(date,desc,amount,company_id,office_id);
        this.balance = await super.getBalance();
    }

    async withdraw(date,desc,amount,company_id=0,office_id=0) {
        if (amount <= 0) {
            throw new Error('Withdrawal amount must be positive');
        }
        this.balance = await super.getBalance();
        if (this.balance < amount) {
            throw new Error('Insufficient balance');
        }
        await super.addCredit(date,desc,amount,company_id,office_id);
        this.balance = await super.getBalance();
    }

}

module.exports = Withdrawals;