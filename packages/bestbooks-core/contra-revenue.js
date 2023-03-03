/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const AccountTypes = require('./accountTypes');
const ContraLiability = require('./contra-liability');

class ContraRevenue extends ContraLiability {
    constructor(name) {
        super(name,AccountTypes.Revenue);
        this.group = 500;
    }

    getGroup() {
        return this.group;
    }
}

module.exports = ContraRevenue;