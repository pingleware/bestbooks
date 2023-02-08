/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const AccountTypes = require('./accountTypes');
const ChartOfAccounts = require('./chartOfAccounts');
const Ledger = require('./ledger');
const Journal = require('./journal');
// derived from Ledger class
const Asset = require('./asset');
const Liability = require('./liability');
// derived from Asset class
const Cash = require('./cash');
const Bank = require('./bank');
const Expense = require('./expense');
const Investment = require('./investment');
// derived from Expense class
const Withdrawals = require('./withdrawals');
// derived from Liability class
const Equity = require('./equity');
const Revenue = require('./revenue');
// derived from Equity class
const OwnersEquity = require('./ownersEquity');
// derived from Revenue class
const Income = require('./income');
// comapny
const Company = require('./company');
// user
const User = require('./user');
// vendor
const Vendor = require('./vendor');
// customer
const Customer = require('./customer');
// reports
const Report = require('./report');

module.exports = {
    Model: Model,
    AccountTypes: AccountTypes,
    ChartOfAccounts: ChartOfAccounts,
    Ledger: Ledger,
    Journal: Journal,
    Asset: Asset,
    Liability: Liability,
    Cash: Cash,
    Bank: Bank,
    Expense: Expense,
    Investment: Investment,
    Withdrawals: Withdrawals,
    Equity: Equity,
    Revenue: Revenue,
    OwnersEquity: OwnersEquity,
    Income: Income,
    Company: Company,
    User: User,
    Vendor: Vendor,
    Customer: Customer,
    Report: Report
}