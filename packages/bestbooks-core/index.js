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
const Inventory = require("./inventory");
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
// internal user
const User = require('./user');
// reports
const Report = require('./report');
// contra accounts
const ContraAsset = require('./contra-asset');
const ContraLiability = require('./contra-liability');
const ContraEquity = require('./contra-equity');
// digital assets
const DigitalCurrency = require('./digitalcurrency');
const Bitcoin = require('./bitcoin');
const Ether = require('./ether');
const Disclosures = require('./disclosures');

const {
    warn,
    info,
    error
} = require('./logger');

module.exports = {
    Model: Model,
    AccountTypes: AccountTypes,
    ChartOfAccounts: ChartOfAccounts,
    Ledger: Ledger,
    Journal: Journal,
    Asset: Asset,
    ContraAsset: ContraAsset,
    Liability: Liability,
    ContraLiability: ContraLiability,
    Cash: Cash,
    Bank: Bank,
    Expense: Expense,
    Investment: Investment,
    Inventory: Inventory,
    Withdrawals: Withdrawals,
    Equity: Equity,
    ContraEquity: ContraEquity,
    Revenue: Revenue,
    OwnersEquity: OwnersEquity,
    Income: Income,
    Company: Company,
    User: User,
    Vendor: Vendor,
    Customer: Customer,
    User: User,
    Report: Report,
    DigitalCurrency: DigitalCurrency,
    Bitcoin: Bitcoin,
    Ether: Ether,
    Disclosures: Disclosures,
    warn,
    info,
    error,
}