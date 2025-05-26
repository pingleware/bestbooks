/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const User = require('./user');

class Customer extends User {

    constructor() {
        super("Customer");
    }
}

module.exports = Customer;