"use strict"

const BalanceSheet = require('./balance-sheet');
const IncomeStatement = require('./income-statement');
const NoteToFinancialStatements = require('./noteToFinancialStatements');
const StatementCashFlows = require('./statementCashFlows');
const StatementChangeInEquity = require('./statementChangeOfEquity');
const TrialBalance = require('./trial-balance');

module.exports = {
    BalanceSheet,
    IncomeStatement,
    TrialBalance,
    NoteToFinancialStatements,
    StatementCashFlows,
    StatementChangeInEquity
}