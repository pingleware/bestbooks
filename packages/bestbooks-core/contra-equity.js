/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const AccountTypes = require('./accountTypes');
const ContraLiability = require('./contra-liability');

class ContraEquity extends ContraLiability {
    constructor(name) {
        super(name,AccountTypes.Equity);
        this.group = 300;
    }

    getGroup() {
        return this.group;
    }
}

module.exports = ContraEquity;