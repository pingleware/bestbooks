/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

const AccountTypes = require('./accountTypes');
const Revenue = require('./revenue');

class Income extends Revenue {
    constructor(name) {
        super(name,AccountTypes.Income);
    }
}

module.exports = Income;