/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./src/model.js');
const AccountTypes = require('./src/accountTypes.js');
const ChartOfAccounts = require('./src/chartOfAccounts.js');
const Ledger = require('./src/ledger.js');
// journals
const Journal = require('./src/journal.js');
const CashPaymentsJournal = require('./src/journal-cashpayments.js');
const CashReceiptsJournal = require('./src/journal-cashreceipts.js');
const FixedAssetJournal = require('./src/journal-fixedasset.js');
const InventoryJournal = require('./src/journal-inventory.js');
const PayrollJournal = require('./src/journal-payroll.js');
const PettyCashJournal = require('./src/journal-pettycash.js');
const PurchaseReturnJournal = require('./src/journal-purchasereturn.js');
const PurchasesJournal = require('./src/journal-purchases.js');
const SalesJournal = require('./src/journal-sales.js');
const SalesReturnJournal = require('./src/journal-salesreturn.js');
// derived from Ledger class
const Asset = require('./src/asset.js');
const Liability = require('./src/liability.js');
// derived from Asset class
const Cash = require('./src/cash.js');
const Bank = require('./src/bank.js');
const Expense = require('./src/expense.js');
const Investment = require('./src/investment.js');
const Inventory = require("./src/inventory.js");
// derived from Expense class
const Withdrawals = require('./src/withdrawals.js');
const FixedCost = require('./src/expense-fixed.js');
const VariableCost = require('./src/expense-variable.js');
// derived from Liability class
const Equity = require('./src/equity.js');
const Revenue = require('./src/revenue.js');
const AccountsPayable = require('./src/liability-accountspayable.js');
// derived from Equity class
const CommodityShares = require('./src/equity-commodity.js');
const CommonShares = require('./src/equity-common.js');
const DebtShares = require('./src/equity-debt.js');
const EmployeeShares = require('./src/equity-employee.js');
const MergerAcquisitionShares = require('./src/equity-mergeracquisition.js');
const OwnersEquity = require('./src/equity-owners.js');
const PreferredShares = require('./src/equity-preferred.js');
const RetainedEarnings = require('./src/equity-retainedearnings.js');
const ShareholderEquity = require('./src/equity-shareholder.js');
// derived from Revenue class
const Income = require('./src/income.js');
// comapny
const Company = require('./src/company.js');
// user(s)
const User = require('./src/user.js');
const Vendor = require('./src/user-vendor.js');
const Customer = require('./src/user-customer.js');
const Investor = require('./src/user-investor.js');
const Employee = require('./src/user-employee.js');
// reports
const Report = require('./src/report.js');
// contra accounts
const ContraAsset = require('./src/contra-asset.js');
const ContraLiability = require('./src/contra-liability.js');
const ContraEquity = require('./src/contra-equity.js');
const ContraRevenue = require('./src/contra-revenue.js');
const ContraExpense = require('./src/contra-expense.js');

const Treasury = require('./src/equity-treasury.js');

// digital assets
const DigitalCurrency = require('./src/digitalcurrency.js');
const Bitcoin = require('./src/digitalcurrency-bitcoin.js');
const Ether = require('./src/digitalcurrency-ether.js');

// utility
const {
    warn,
    info,
    error
} = require('./src/logger.js');

// audit
const ConservatismPrinciple = require('./src/audit-conservatismPrinciple.js');
const ConsistencyPrinciple = require('./src/audit-consistencyPrinciple.js');
const Disclosures = require('./src/audit-disclosures.js');
const GoingConcernAssumption = require('./src/audit-goingConcernAssumption.js');
const Materiality = require('./src/audit-materiality.js');
const AccountsReceivable = require('./src/asset-accountsreceivable.js');

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
    FixedCost: FixedCost,
    VariableCost: VariableCost,
    Equity: Equity,
    ContraEquity: ContraEquity,
    ContraRevenue: ContraRevenue,
    ContraExpense: ContraExpense,
    Revenue: Revenue,
    AccountsPayable: AccountsPayable,
    AccountsReceivable: AccountsReceivable,
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