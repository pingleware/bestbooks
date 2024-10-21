/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

/**
 * Here is a list of common financial reports used by businesses and organizations to assess their 
 * financial health:
 * 
 * 1. **Income Statement (Profit and Loss Statement)**  
 *    - Shows a company's revenues, expenses, and profit or loss over a specific period 
 *      (monthly, quarterly, yearly).
 *    
 * 2. **Balance Sheet**  
 *    - A snapshot of a company's assets, liabilities, and equity at a specific point in time. 
 *      It reflects the financial position of the business.
 *    
 * 3. **Cash Flow Statement**  
 *    - Details the inflows and outflows of cash, categorized into operating, investing, and 
 *      financing activities, over a period of time.
 *    
 * 4. **Statement of Retained Earnings**  
 *    - Shows changes in retained earnings over a period, often linked to net income and 
 *      dividend payments.
 *    
 * 5. **Statement of Changes in Equity**  
 *    - Details changes in owners' equity (including retained earnings, new capital contributions, 
 *      and other adjustments) over a period.
 *    
 * 6. **Trial Balance**  
 *    - A listing of all accounts from the general ledger with their balances, used to check that 
 *      total debits equal total credits before preparing financial statements.
 *    
 * 7. **Budget vs. Actual Report**  
 *    - Compares budgeted financial metrics (revenue, expenses, etc.) with actual performance to 
 *      highlight variances.
 *    
 * 8. **Accounts Receivable Aging Report**  
 *    - Lists unpaid customer invoices and how long they've been outstanding, helping manage 
 *      collections.
 *    
 * 9. **Accounts Payable Aging Report**  
 *    - Lists unpaid supplier invoices and their due dates, helping manage payments and cash flow.
 * 
 * 10. **Break-even Analysis Report**  
 *     - Calculates the level of sales required to cover total costs, showing the point at which 
 *       the company neither makes a profit nor incurs a loss.
 * 
 * These reports are essential for analyzing a company's financial performance, compliance, 
 * and future strategy.
 */

const Model = require('./model');
const localStorage = require('localStorage');
const {
    info,
    warn,
    error
} = require('./logger');

class Report {

    constructor() {
        // create and open database
        this.model = new Model();
        // create ledger views
        this.init();
    }

    async init() {
        await this.createTable();
        await this.createViews();
    }


    async incomeStatement(startTxDate="",endTxDate="",geographic=false,callback) {
        try {
            let sql = `SELECT * FROM IncomeStatement`; // Base SQL query

            if (geographic) {
                sql = `SELECT * FROM IncomeStatementGeographic`;
            }

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql, callback);
        } catch(err) {
            console.error(err);
        }
    }

    async incomeStatementSync(startTxDate="",endTxDate="",geographic=false) {
        return new Promise((resolve, reject) => {
            try {
                this.incomeStatement(startTxDate, endTxDate, geographic, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }

    async balanceSheet(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM BalanceSheet;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql, callback);
        } catch(err) {
            console.error(err);
        }
    }
    async balanceSheetSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.balanceSheet(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }
    async cashFlowStatement(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM CashFlowStatement;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async cashFlowStatementSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.cashFlowStatement(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }
    async statementOfRetainedEarnings(startTxDate="",endTxDate="",callback) {
        try {
            var sql = ``;
            if (startTxDate.length == 0 && endTxDate.length == 0) {
                sql = `SELECT * FROM StatementOfRetainedEarnings;`;
            } else if (startTxDate.length > 0 && endTxDate.length == 0) {
                sql = `SELECT 
                    account_code,
                    account_name,
                    SUM(beginning_retained_earnings) AS beginning_retained_earnings,
                    SUM(net_income) AS net_income,
                    SUM(dividends_paid) AS dividends_paid,
                    (SUM(beginning_retained_earnings) + SUM(net_income) - SUM(dividends_paid)) AS ending_retained_earnings
                FROM 
                    statement_of_retained_earnings
                WHERE 
                    txdate >= '${startTxDate}'
                GROUP BY 
                    account_code, account_name;
                `;
            } else if (startTxDate.length > 0 && endTxDate.length > 0) {
                sql = `SELECT 
                    account_code,
                    account_name,
                    SUM(beginning_retained_earnings) AS beginning_retained_earnings,
                    SUM(net_income) AS net_income,
                    SUM(dividends_paid) AS dividends_paid,
                    (SUM(beginning_retained_earnings) + SUM(net_income) - SUM(dividends_paid)) AS ending_retained_earnings
                FROM 
                    statement_of_retained_earnings
                WHERE 
                    txdate BETWEEN '${startTxDate}' AND '${endTxDate}'
                GROUP BY 
                    account_code, account_name;
                `;
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async statementOfRetainedEarningsSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.statementOfRetainedEarnings(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }
    async statementOfChangesInEquity(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM StatementOfChangesInEquity;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async statementOfChangesInEquitySync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.statementOfChangesInEquity(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }

    async trialBalance(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM TrialBalance;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            const results = await this.model.querySync(sql);
            callback(0,results);
        } catch(err) {
            error(err);
        }
    }

    async trialBalanceSync(startTxDate="",endTxDate=""){
        return new Promise((resolve, reject) => {
            try {
                this.trialBalance(startTxDate, endTxDate, (err, results) => {
                    if (err) {
                        error(err);
                        reject(err); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }

    async budgetVsActual(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM BudgetVsActual;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async budgetVsActualSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.budgetVsActual(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }
    async accountReceivablesAgingReport(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM AccountsReceivableAging;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async accountReceivablesAgingReportSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.accountReceivablesAgingReport(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }
    async accountsPayableAgingReport(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM AccountsPayableAging;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async accountsPayableAgingReportSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.accountsPayableAgingReport(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }
    async breakevenAnalysisReport(startTxDate="",endTxDate="",callback) {
        try {
            var sql = `SELECT * FROM BreakEvenAnalysis;`;

            // Adding WHERE clause if txdate conditions are provided
            const conditions = [];

            // Check for a single start date
            if (startTxDate.length > 0 && endTxDate.length === 0) {
                conditions.push(`txdate >= '${startTxDate}'`); // Only start date
            } 
            // Check for a date range
            else if (startTxDate.length > 0 && endTxDate.length > 0) {
                conditions.push(`txdate >= '${startTxDate}' AND txdate <= '${endTxDate}'`); // Date range
            }

            // Append conditions to the SQL query if any exist
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            // Execute the query and pass the callback
            this.model.query(sql,callback);
        } catch(err) {
            console.error(err);
        }
    }
    async breakevenAnalysisReportSync(startTxDate="",endTxDate="") {
        return new Promise((resolve, reject) => {
            try {
                this.breakevenAnalysisReport(startTxDate, endTxDate, (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve with the results if successful
                    }
                });
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise if there's an error
            }
        });
    }

    async createTable() {
        var sql = `CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT,  -- e.g., country or region
            region TEXT      -- e.g., broader region, like North America, Europe, etc.
        );`;
        return await this.model.insertSync(sql);
    }


    async createViews() {
        await this.incomeStatementView();
        await this.incomeStatementViewGeographic();
        await this.balanceSheetView();
        await this.cashFlowStatementView();
        await this.statementOfRetainedEarningsView();
        await this.statementOfChangesInEquityView();
        await this.trialBalanceView();
        await this.budgetVsActualView();
        await this.accountReceivablesAgingReportView();
        await this.accountsPayableAgingReportView();
        await this.breakevenAnalysisReportView();
    }

    async trialBalanceView() {
        var sql = `CREATE VIEW IF NOT EXISTS TrialBalance AS 
            SELECT 
                account_code AS code, 
                account_name AS name,
                accounts.base_type AS type,
                SUM(debit) AS total_debit,
                SUM(credit) AS total_credit,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            GROUP BY 
                accounts.account_code, accounts.account_name, accounts.base_type
            ORDER BY 
                accounts.base_type, accounts.account_name;
        `;
        await this.model.insertSync(sql);
    }

    async incomeStatementView() {
        var sql = `CREATE VIEW IF NOT EXISTS IncomeStatement AS 
            SELECT 
                accounts.code AS account_code,
                accounts.name AS account_name,
                accounts.base_type AS type,
                SUM(CASE 
                    WHEN ledger.debit > 0 THEN ledger.debit 
                    ELSE 0 
                END) AS total_revenue,
                SUM(CASE 
                    WHEN ledger.credit > 0 THEN ledger.credit 
                    ELSE 0 
                END) AS total_expense,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type IN ('Revenue', 'Expense')  -- Filter for relevant accounts
            GROUP BY 
                accounts.code, accounts.name, accounts.base_type, ledger.txdate
            ORDER BY 
                accounts.base_type, accounts.name;
        `;
        await this.model.insertSync(sql);
    }

    async incomeStatementViewGeographic() {
        var sql = `CREATE VIEW IncomeStatementGeographic AS
            WITH total_revenue AS (
                SELECT 
                    SUM(CASE WHEN tr.type = 'revenue' THEN tr.amount ELSE 0 END) AS grand_total_revenue
                FROM 
                    transactions tr
            )
            SELECT 
                loc.region AS Region,
                SUM(CASE WHEN tr.type = 'revenue' THEN tr.amount ELSE 0 END) AS Total_Revenue,
                SUM(CASE WHEN tr.type = 'expense' THEN tr.amount ELSE 0 END) AS Total_Expenses,
                SUM(CASE WHEN tr.type = 'revenue' THEN tr.amount ELSE 0 END) - 
                SUM(CASE WHEN tr.type = 'expense' THEN tr.amount ELSE 0 END) AS Net_Income,
                ROUND(
                    (SUM(CASE WHEN tr.type = 'revenue' THEN tr.amount ELSE 0 END) / 
                    (SELECT grand_total_revenue FROM total_revenue) * 100), 2
                ) AS Percent_Of_Total_Revenue
            FROM 
                transactions tr
            JOIN 
                locations loc ON tr.location = loc.location
            GROUP BY 
                loc.region;
            `;
            await this.model.insertSync(sql);
    }

    async balanceSheetView() {
        var sql = `CREATE VIEW IF NOT EXISTS BalanceSheet AS 
            SELECT 
                account_code AS code, 
                account_name AS name, 
                accounts.base_type AS type, 
                SUM(debit) AS debit, 
                SUM(credit) AS credit, 
                CASE 
                    WHEN accounts.base_type = 'Asset' THEN (SUM(debit) - SUM(credit))
                    ELSE (SUM(credit) - SUM(debit))
                END AS balance,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger 
            JOIN 
                accounts ON accounts.name = ledger.account_name 
            WHERE 
                accounts.base_type IN ('Asset', 'Liability', 'Equity')
            GROUP BY 
                accounts.name 
            ORDER BY 
                accounts.base_type, accounts.name;
        `;        
        await this.model.insertSync(sql);
    }

    async cashFlowStatementView() {
        var sql = `CREATE VIEW IF NOT EXISTS CashFlowStatement AS
            SELECT 
                transaction_type,
                account_code AS code, 
                account_name AS name, 
                accounts.base_type AS type, 
                SUM(debit) AS debit, 
                SUM(credit) AS credit,
                (SUM(credit) - SUM(debit)) AS net_cash_flow,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger 
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type = 'Asset'  -- Focus on cash movements, typically assets
            AND
                transaction_type IN ('Operating', 'Investing', 'Financing')
            GROUP BY 
                transaction_type, accounts.name
            ORDER BY 
                transaction_type, accounts.name;
        `;
        await this.model.insertSync(sql);
    }

    async statementOfRetainedEarningsView() {
        var sql = `CREATE VIEW IF NOT EXISTS StatementOfRetainedEarnings AS
            SELECT 
                (SELECT SUM(credit - debit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.name = 'Retained Earnings'
                ) AS beginning_retained_earnings,
                
                (SELECT SUM(credit - debit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.base_type = 'Revenue'
                ) - 
                (SELECT SUM(debit - credit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.base_type = 'Expense'
                ) AS net_income,

                (SELECT SUM(debit - credit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.name = 'Dividends'
                ) AS dividends_paid,

                (SELECT SUM(credit - debit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.name = 'Retained Earnings'
                ) + 
                ((SELECT SUM(credit - debit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.base_type = 'Revenue') - 
                (SELECT SUM(debit - credit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.base_type = 'Expense')) - 
                (SELECT SUM(debit - credit) 
                    FROM ledger 
                    JOIN accounts ON accounts.name = ledger.account_name
                    WHERE accounts.name = 'Dividends'
                ) AS ending_retained_earnings;
        `;
        await this.model.insertSync(sql);
    }

    async statementOfChangesInEquityView() {
        var sql = `CREATE VIEW IF NOT EXISTS StatementOfChangesInEquity AS
            SELECT 
                accounts.account_name AS equity_component,
                accounts.base_type AS type,
                
                -- Beginning balance of each equity component
                SUM(CASE WHEN transaction_type = 'Opening Balance' THEN credit - debit ELSE 0 END) AS beginning_balance,

                -- Net income from revenue and expense accounts (contributing to Retained Earnings)
                (SELECT SUM(credit - debit) 
                FROM ledger 
                JOIN accounts ON accounts.name = ledger.account_name
                WHERE accounts.base_type = 'Revenue'
                ) - 
                (SELECT SUM(debit - credit) 
                FROM ledger 
                JOIN accounts ON accounts.name = ledger.account_name
                WHERE accounts.base_type = 'Expense'
                ) AS net_income,

                -- Additional contributions by owners
                SUM(CASE WHEN transaction_type = 'Owner Contribution' THEN credit - debit ELSE 0 END) AS owner_contributions,

                -- Dividends or owner distributions
                SUM(CASE WHEN transaction_type = 'Dividends' THEN debit - credit ELSE 0 END) AS dividends,

                -- Other changes to equity (e.g., reserves)
                SUM(CASE WHEN transaction_type = 'Other Adjustment' THEN credit - debit ELSE 0 END) AS other_adjustments,

                -- Ending balance of each equity component
                SUM(CASE WHEN transaction_type = 'Opening Balance' THEN credit - debit ELSE 0 END) + 
                SUM(CASE WHEN transaction_type = 'Owner Contribution' THEN credit - debit ELSE 0 END) +
                (SELECT SUM(credit - debit) 
                FROM ledger 
                JOIN accounts ON accounts.name = ledger.account_name
                WHERE accounts.base_type = 'Revenue'
                ) - 
                (SELECT SUM(debit - credit) 
                FROM ledger 
                JOIN accounts ON accounts.name = ledger.account_name
                WHERE accounts.base_type = 'Expense'
                ) - 
                SUM(CASE WHEN transaction_type = 'Dividends' THEN debit - credit ELSE 0 END) +
                SUM(CASE WHEN transaction_type = 'Other Adjustment' THEN credit - debit ELSE 0 END) AS ending_balance,
                ledger.txdate  -- Include txdate for optional filtering
            FROM 
                ledger 
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type = 'Equity'
            GROUP BY 
                accounts.account_name
            ORDER BY 
                accounts.account_name;
        `;
        await this.model.insertSync(sql);
    }

    async budgetVsActualView() {
        var sql = `CREATE VIEW IF NOT EXISTS BudgetVsActual AS
            SELECT 
                code AS account_code,
                name AS account_name,
                type AS account_type,
                
                -- Summing up actual balances for the first year
                (Bal01 + Bal02 + Bal03 + Bal04 + Bal05 + Bal06 + 
                Bal07 + Bal08 + Bal09 + Bal10 + Bal11 + Bal12) AS actual_year_1,

                -- Summing up budget for the first year
                (Bud01 + Bud02 + Bud03 + Bud04 + Bud05 + Bud06 + 
                Bud07 + Bud08 + Bud09 + Bud10 + Bud11 + Bud12) AS budget_year_1,

                -- Difference between actual and budget for the first year
                (Bal01 + Bal02 + Bal03 + Bal04 + Bal05 + Bal06 + 
                Bal07 + Bal08 + Bal09 + Bal10 + Bal11 + Bal12) - 
                (Bud01 + Bud02 + Bud03 + Bud04 + Bud05 + Bud06 + 
                Bud07 + Bud08 + Bud09 + Bud10 + Bud11 + Bud12) AS variance_year_1,

                -- Summing up actual balances for the second year
                (Bal13 + Bal14 + Bal15 + Bal16 + Bal17 + Bal18 + 
                Bal19 + Bal20 + Bal21 + Bal22 + Bal23 + Bal24) AS actual_year_2,

                -- Summing up budget for the second year
                (Bud13 + Bud14 + Bud15 + Bud16 + Bud17 + Bud18 + 
                Bud19 + Bud20 + Bud21 + Bud22 + Bud23 + Bud24) AS budget_year_2,

                -- Difference between actual and budget for the second year
                (Bal13 + Bal14 + Bal15 + Bal16 + Bal17 + Bal18 + 
                Bal19 + Bal20 + Bal21 + Bal22 + Bal23 + Bal24) - 
                (Bud13 + Bud14 + Bud15 + Bud16 + Bud17 + Bud18 + 
                Bud19 + Bud20 + Bud21 + Bud22 + Bud23 + Bud24) AS variance_year_2,

                accounts.created AS txdate  -- Including txdate for filtering in the query
                
            FROM 
                accounts
            ORDER BY 
                account_type, account_name;
        `;
        await this.model.insertSync(sql);
    }

    async accountReceivablesAgingReportView() {
        var sql = `CREATE VIEW IF NOT EXISTS AccountsReceivableAging AS
            SELECT 
                accounts.code AS account_code,
                accounts.name AS account_name,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) <= 30 THEN ledger.debit - ledger.credit 
                    ELSE 0 
                END) AS current,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) BETWEEN 31 AND 60 THEN ledger.debit - ledger.credit 
                    ELSE 0 
                END) AS past_due_1_30,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) BETWEEN 61 AND 90 THEN ledger.debit - ledger.credit 
                    ELSE 0 
                END) AS past_due_31_60,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) BETWEEN 91 AND 120 THEN ledger.debit - ledger.credit 
                    ELSE 0 
                END) AS past_due_61_90,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) > 120 THEN ledger.debit - ledger.credit 
                    ELSE 0 
                END) AS past_due_over_90,
                SUM(ledger.debit - ledger.credit) AS total_outstanding,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type = 'Asset' AND accounts.type = 'Accounts Receivable'
            GROUP BY 
                accounts.code, accounts.name
            ORDER BY 
                accounts.name;
        `;
        await this.model.insertSync(sql);
    }

    async accountsPayableAgingReportView() {
        var sql = `CREATE VIEW IF NOT EXISTS AccountsPayableAging AS
            SELECT 
                accounts.code AS account_code,
                accounts.name AS account_name,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) <= 30 THEN ledger.credit - ledger.debit 
                    ELSE 0 
                END) AS current,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) BETWEEN 31 AND 60 THEN ledger.credit - ledger.debit 
                    ELSE 0 
                END) AS past_due_1_30,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) BETWEEN 61 AND 90 THEN ledger.credit - ledger.debit 
                    ELSE 0 
                END) AS past_due_31_60,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) BETWEEN 91 AND 120 THEN ledger.credit - ledger.debit 
                    ELSE 0 
                END) AS past_due_61_90,
                SUM(CASE 
                    WHEN julianday(CURRENT_DATE) - julianday(ledger.due_date) > 120 THEN ledger.credit - ledger.debit 
                    ELSE 0 
                END) AS past_due_over_90,
                SUM(ledger.credit - ledger.debit) AS total_outstanding,
                ledger.txdate  -- Including txdate for filtering in the query
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type = 'Liability' AND accounts.type = 'Accounts Payable'
            GROUP BY 
                accounts.code, accounts.name
            ORDER BY 
                accounts.name;
        `;
        await this.model.insertSync(sql);
    }

    async breakevenAnalysisReportView() {
        var sql = `CREATE VIEW IF NOT EXISTS BreakEvenAnalysis AS
             SELECT 
                SUM(CASE 
                    WHEN accounts.base_type = 'FixedCost' THEN ledger.debit 
                    ELSE 0 
                END) AS total_fixed_costs,
                SUM(CASE 
                    WHEN accounts.base_type = 'VariableCost' THEN ledger.debit 
                    ELSE 0 
                END) AS total_variable_costs,
                SUM(CASE 
                    WHEN accounts.base_type = 'Revenue' THEN ledger.credit 
                    ELSE 0 
                END) AS total_revenue,
                SUM(CASE 
                    WHEN accounts.base_type = 'Revenue' THEN ledger.credit 
                    ELSE 0 
                END) - 
                (SUM(CASE 
                    WHEN accounts.base_type = 'FixedCost' THEN ledger.debit 
                    ELSE 0 
                END) + SUM(CASE 
                    WHEN accounts.base_type = 'VariableCost' THEN ledger.debit 
                    ELSE 0 
                END)) AS net_profit_loss,
                ledger.txdate  -- Including txdate for optional filtering
            FROM 
                ledger
            JOIN 
                accounts ON accounts.name = ledger.account_name
            WHERE 
                accounts.base_type IN ('FixedCost', 'VariableCost', 'Revenue')  -- Only include relevant accounts
            GROUP BY 
                ledger.txdate
            ORDER BY 
                ledger.txdate;
        `;
        await this.model.insertSync(sql);
    }
}

module.exports = Report;