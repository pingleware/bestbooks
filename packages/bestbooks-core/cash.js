/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

 "use strict"

const Asset = require('./asset');

class Cash extends Asset {
    constructor(name) {
        super(name);
    }
}

module.exports = Cash;