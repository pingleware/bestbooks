/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

const Asset = require('./asset');

class Investment extends Asset {
    constructor(name) {
        super(name);
    }
}

module.exports = Investment;