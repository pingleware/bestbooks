/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

/**
 * See: http://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
 * 
 * Liabilities, Equity, and Revenue
 * --------------------------------
 * Liability, Equity, and Revenue accounts usually receive credits, 
 * so they maintain negative balances. They are called credit accounts. 
 * Accounting books will say “Accounts that normally maintain a negative balance 
 * are increased with a Credit and decreased with a Debit.” 
 * Again, look at the number line. 
 * If you add a negative number (credit) to a negative number, 
 * you get a larger negative number! (moving left on the number line). 
 * But if you start with a negative number and add a positive number to it (debit), 
 * you get a smaller negative number because you move to the right on the number line.
 * 
 */

const AccountTypes = require('./accountTypes');
const Liability = require('./liability');

class Equity extends Liability {
    constructor(name) {
        super(name,AccountTypes.Equity);
        this.group = 300;
    }

    getGroup() {
        return this.group;
    }
}

module.exports = Equity;