/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');
const AccountTypes = require('./accountTypes');
const ChartOfAccounts = require('./chartOfAccounts');
const Ledger = require('./ledger');
// journals
const Journal = require('./journal');
const CashPaymentsJournal = require('./journal-cashpayments.js');
const CashReceiptsJournal = require('./journal-cashreceipts.js');
const FixedAssetJournal = require('./journal-fixedasset.js');
const InventoryJournal = require('./journal-inventory.js');
const PayrollJournal = require('./journal-payroll.js');
const PettyCashJournal = require('./journal-pettycash.js');
const PurchaseReturnJournal = require('./journal-purchasereturn.js');
const PurchasesJournal = require('./journal-purchases.js');
const SalesJournal = require('./journal-sales.js');
const SalesReturnJournal = require('./journal-salesreturn.js');
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
const CommodityShares = require('./equity-commodity.js');
const CommonShares = require('./equity-common.js');
const DebtShares = require('./equity-debt.js');
const EmployeeShares = require('./equity-employee.js');
const MergerAcquisitionShares = require('./equity-mergeracquisition.js');
const OwnersEquity = require('./equity-owners.js');
const PreferredShares = require('./equity-preferred.js');
const RetainedEarnings = require('./equity-retainedearnings.js');
const ShareholderEquity = require('./equity-shareholder.js');
// derived from Revenue class
const Income = require('./income');
// comapny
const Company = require('./company');
// user(s)
const User = require('./user');
const Vendor = require('./user-vendor.js');
const Customer = require('./user-customer.js');
const Investor = require('./user-investor.js');
const Employee = require('./user-employee.js');
// reports
const Report = require('./report');
// contra accounts
const ContraAsset = require('./contra-asset');
const ContraLiability = require('./contra-liability');
const ContraEquity = require('./contra-equity');
const ContraRevenue = require('./contra-revenue.js');
const ContraExpense = require('./contra-expense.js');

const Treasury = require('./equity-treasury.js');

// digital assets
const DigitalCurrency = require('./digitalcurrency');
const Bitcoin = require('./digitalcurrency-bitcoin.js');
const Ether = require('./digitalcurrency-ether.js');

// utility
const {
    warn,
    info,
    error
} = require('./logger');

// audit
const ConservatismPrinciple = require('./audit-conservatismPrinciple.js');
const ConsistencyPrinciple = require('./audit-consistencyPrinciple.js');
const Disclosures = require('./audit-disclosures.js');
const GoingConcernAssumption = require('./audit-goingConcernAssumption.js');
const Materiality = require('./audit-materiality.js');

module.exports = {
    Model: Model,
    AccountTypes: AccountTypes,
    ChartOfAccounts: ChartOfAccounts,
    Ledger: Ledger,
    Journal: Journal,
    CashPaymentsJournal: CashPaymentsJournal,
    CashReceiptsJournal: CashReceiptsJournal,
    FixedAssetJournal: FixedAssetJournal,
    InventoryJournal: InventoryJournal,
    PayrollJournal: PayrollJournal,
    PettyCashJournal: PettyCashJournal,
    PurchaseReturnJournal: PurchaseReturnJournal,
    PurchasesJournal: PurchasesJournal,
    SalesJournal: SalesJournal,
    SalesReturnJournal: SalesReturnJournal,
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
    ContraRevenue: ContraRevenue,
    ContraExpense: ContraExpense,
    Revenue: Revenue,
    CommodityShares: CommodityShares,
    CommonShares: CommonShares,
    DebtShares: DebtShares,
    EmployeeShares: EmployeeShares,
    MergerAcquisitionShares: MergerAcquisitionShares,
    OwnersEquity: OwnersEquity,
    PreferredShares: PreferredShares,
    ShareholderEquity: ShareholderEquity,
    RetainedEarnings: RetainedEarnings,
    Treasury: Treasury,
    Income: Income,
    Company: Company,
    User: User,
    Vendor: Vendor,
    Customer: Customer,
    Investor: Investor,
    Employee: Employee,
    Report: Report,
    DigitalCurrency: DigitalCurrency,
    Bitcoin: Bitcoin,
    Ether: Ether,
    Disclosures: Disclosures,
    ConsistencyPrinciple: ConsistencyPrinciple,
    Materiality: Materiality,
    ConservatismPrinciple: ConservatismPrinciple,
    GoingConcernAssumption: GoingConcernAssumption,
    warn,
    info,
    error,
}