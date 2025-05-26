/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const User = require('./user');

class Employee extends User {

    constructor() {
        super("Employee");
    }
}

module.exports = Employee;