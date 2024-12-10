/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const User = require('./user');

class Vendor extends User {

    constructor() {
        super("Vendor");
    }
}

module.exports = Vendor;