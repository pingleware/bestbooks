/**
 * BestBooks Accounting Application Framework is registered trademark of PressPage Entertainment Inc.
 */

"use strict"

const Model = require('./model');

const {
    info,
    warn,
    error
} = require('./logger');

class GoingConcernAssumption {
    constructor() {
        // create and open database
        this.model = new Model();
        // create disclosures table if not exist
        this.createTable();
    }

    // Function to evaluate the going concern based on financial indicators
    async evaluateGoingConcern() {
        const rows = await this.model.querySync(`SELECT * FROM financial_indicators 
            WHERE status = 'critical'`);
        if (rows.length > 0) {
            return false; // Company is not a going concern
        }
        return true; // Company is a going concern
    }
    
    // Insert a financial indicator
    async insertFinancialIndicator(indicator) {
        const { indicator_name, value, threshold, recorded_at } = indicator;

        // Determine the status based on the value and threshold
        let status = 'normal';
        if (value > threshold * 1.5) {
            status = 'critical';
        } else if (value > threshold) {
            status = 'warning';
        }

        return await this.model.insertSync(`INSERT INTO financial_indicators (
            indicator_name, 
            value, 
            threshold, 
            status, 
            recorded_at
            ) VALUES (
             '${indicator_name}', 
             '${value}', 
             '${threshold}', 
             '${status}', 
             '${recorded_at}'
            )`
        );
    }

    async getIndicators() {
        return await this.model.querySync(`SELECT * FROM financial_indicators`);
    }

    async getIndicatorById(id) {
        return await this.model.querySync(`SELECT * FROM financial_indicators WHERE indicator_name=${id}`);
    }

    async getIndicatorByName(name) {
        return await this.model.querySync(`SELECT * FROM financial_indicators WHERE id='${name}'`);
    }

    async updateIndicator(indicator) {
        const { id, indicator_name, value, threshold, status, recorded_at } = indicator;
        return await this.model.updateSync(`UPDATE financial_indicators 
            SET status='${status}',
                value=${value} 
            WHERE id=${id}`);
    }

    async checkGoingConcern() {
        const isGoingConcern = await evaluateGoingConcern();
        if (isGoingConcern) {
            returm({ going_concern: true, message: "Company is operating as a going concern." });
        }        
        return({ going_concern: false, message: "Company is not a going concern. Immediate action needed." });
    }

    /**
     * indicator_name: The name of the financial metric (e.g., revenue, debt, cash flow).
     * value: The current value of the metric.
     * threshold: A predefined threshold for the metric to indicate potential problems.
     * status: The status of the financial health based on the metric (normal, warning, or critical).
     * recorded_at: Timestamp of the metric entry.
     */
    async createTable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS  financial_indicators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                indicator_name TEXT NOT NULL,
                value REAL NOT NULL,
                threshold REAL NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('normal', 'warning', 'critical')),
                recorded_at TEXT NOT NULL
            );`;
            await this.model.querySync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    async purgeTable() {
        try {
            const sql = `DELETE FROM financial_indicators;`;
            await this.model.deleteSync(sql);
        } catch(err) {
            error(JSON.stringify(err));
        }
    }

    // Indicators
    // Operating Cash Flow
    async calculateOperatingCashFlow() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('CashFlow');

        if (indicator.length > 0) {
            // Sum all cash-related transactions in the ledger (assuming 'cash' is the account_name)
            const result = await this.model.querySync(`
                SELECT SUM(le.debit)-SUM(le.credit) as cashFlow FROM ledger le
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Cash'
            `);
        
            const cashFlow = result?.cashFlow || 0;
        
            // Thresholds for Operating Cash Flow
            if (cashFlow < indicator.value) {
                status = 'Critical';
            } else if (cashFlow >= indicator.value && cashFlow < indicator.threshold) {
                status = 'Warning';
            }
        
            indicator.status = status;
            indicator.value = cashFlow;
            await this.updateIndicator(indicator);
        
            return { indicator: 'Operating Cash Flow', status, value: cashFlow };
        } else {
            return { indicator: 'Operating Cash Flow', status, value: 0 };
        }
    }
    
    // Net Income / Net Profit Margin
    async calculateNetIncome() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('NetIncome');

        if (indicator.length > 0) {
            // Calculate total revenue and expenses
            const revenueResult = await this.model.querySync(`SELECT SUM(le.debit)-SUM(le.credit) as totalRevenue 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Revenue'`);
            const expenseResult = await this.model.querySync(`SELECT SUM(le.debit)-SUM(le.credit) as totalExpense 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Expense'`);
        
            const netIncome = (revenueResult?.totalRevenue || 0) - (expenseResult?.totalExpense || 0);
        
            // Thresholds for Net Income
            if (netIncome < 0) {
                status = 'Critical';
            } else if (netIncome >= 0 && netIncome < indicator.threshold) {
                status = 'Warning';
            }
        
            indicator.status = status;
            indicator.value = netIncome;
            await this.updateIndicator(indicator);
        
            return { indicator: 'Net Income', status, value: netIncome };
        } else {
            return { indicator: 'Net Income', status, value: 0 };
        }
    }
    
    // Debt-to-Equity Ratio
    async calculateDebtToEquity() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('DebtToEquity');

        if (indicator.length > 0) {
            // Fetch total liabilities and total equity
            const liabilitiesResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as totalLiabilities 
                FROM ledger le
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Liability'`);
            const equityResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as totalEquity 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Equity'`);
        
            const debtToEquityRatio = (liabilitiesResult?.totalLiabilities || 0) / (equityResult?.totalEquity || 1);
        
            // Thresholds for Debt-to-Equity Ratio
            if (debtToEquityRatio > 1) {
                status = 'Critical';
            } else if (debtToEquityRatio > 1 && debtToEquityRatio <= indicator.threshold) {
                status = 'Warning';
            }

            indicator.status = status;
            indicator.value = debtToEquityRatio;
            await this.updateIndicator(indicator);
        
            return { indicator: 'Debt-to-Equity Ratio', status, value: debtToEquityRatio };
        } else {
            return { indicator: 'Debt-to-Equity Ratio', status, value: 0 };            
        }
    }
    
    // Current Ratio
    async calculateCurrentRatio() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('CurrentRatio');

        if (indicator.length > 0) {
            // Fetch current assets and current liabilities
            const assetsResult = await this.model.querySync(`SELECT SUM(le.debit)-SUM(le.credit) as currentAssets 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Asset'`);
            const liabilitiesResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as currentLiabilities 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name 
                WHERE ac.type = 'Liability'`);
        
            const currentRatio = (assetsResult?.currentAssets || 0) / (liabilitiesResult?.currentLiabilities || 1);
        
            // Thresholds for Current Ratio
            if (currentRatio < 1) {
                status = 'Critical';
            } else if (currentRatio >= 1 && currentRatio < indicator.threshold) {
                status = 'Warning';
            }
        
            indicator.status = status;
            indicator.value = currentRatio;
            await this.updateIndicator(indicator);

            return { indicator: 'Current Ratio', status, value: currentRatio };
        } else {
            return { indicator: 'Current Ratio', status, value: 0 };
        }
    }
    
    // Quick Ratio (Acid-Test Ratio)
    async calculateQuickRatio() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('QuickRatio');

        if (indicator.length > 0) {
            // Fetch cash and accounts receivable (liquid assets), and current liabilities
            const cashResult = await this.model.querySync(`SELECT SUM(le.debit)-SUM(le.credit) as cash 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Cash'`);
            const receivablesResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as receivables 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Accounts Receivable'`);
            const liabilitiesResult = await this.model.querySync(`SELECT SUM(le.debit)-SUM(le.credit) as currentLiabilities 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Liability'`);
        
            const quickRatio = ((cashResult?.cash || 0) + (receivablesResult?.receivables || 0)) / (liabilitiesResult?.currentLiabilities || 1);
        
            // Thresholds for Quick Ratio
            if (quickRatio < 1) {
                status = 'Critical';
            } else if (quickRatio >= 1 && quickRatio < indicator.threshold) {
                status = 'Warning';
            }
        
            indicator.status = status;
            indicator.value = quickRatio;

            await this.updateIndicator(indicator);
        
            return { indicator: 'Quick Ratio', status, value: quickRatio };
        } else {
            return { indicator: 'Quick Ratio', status, value: 0 };
        }
    }
    
    // Interest Coverage Ratio
    async calculateInterestCoverageRatio() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('InterestCoverageRatio');

        if (indicator.length > 0) {
            // Fetch EBIT (Earnings Before Interest and Taxes) and interest expense
            const ebitResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as ebit 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Revenue' OR ac.type = 'Expense'`);
            const interestExpenseResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as interestExpense 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Interest Expense'`);
        
            const interestCoverageRatio = (ebitResult?.ebit || 0) / (interestExpenseResult?.interestExpense || 1);
        
            // Thresholds for Interest Coverage Ratio
            if (interestCoverageRatio < 1) {
                status = 'Critical';
            } else if (interestCoverageRatio >= 1 && interestCoverageRatio < indicator.threshold) {
                status = 'Warning';
            }
        
            indicator.status = status;
            indicator.value = interestCoverageRatio;
            this.updateIndicator(indicator);
        
            return { indicator: 'Interest Coverage Ratio', status, value: interestCoverageRatio };
        } else {
            return { indicator: 'Interest Coverage Ratio', status, value: 0 };
        }
    }
    
    // Working Capital
    async calculateWorkingCapital() {
        let status = 'Normal';
        let indicator = await this.getIndicatorByName('InterestCoverageRatio');

        if (indicator.length > 0) {
            // Fetch current assets and current liabilities
            const assetsResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as currentAssets 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Asset'`);
            const liabilitiesResult = await this.model.querySync(`SELECT SUM(le.credit)-SUM(le.debit) as currentLiabilities 
                FROM ledger le 
                JOIN accounts ac ON le.account_name = ac.name
                WHERE ac.type = 'Liability'`);
        
            const workingCapital = (assetsResult?.currentAssets || 0) - (liabilitiesResult?.currentLiabilities || 0);
        
            // Thresholds for Working Capital
            if (workingCapital < 0) {
                status = 'Critical';
            } else if (workingCapital >= 0 && workingCapital < indicator.threshold) {
                status = 'Warning';
            }
        
            indicator.status = status;
            indicator.value = workingCapital;
            this.updateIndicator(indicator);
        
            return { indicator: 'Working Capital', status, value: workingCapital };
        } else {
            return { indicator: 'Working Capital', status, value: 0 };
        }
    }
    
    async performAuditChecks() {
        const results = [];
        results.push(await checkOperatingCashFlow());
        results.push(await checkNetIncome());
        results.push(await checkDebtToEquity());
        results.push(await checkCurrentRatio());
        results.push(await checkQuickRatio());
        results.push(await checkInterestCoverageRatio());
        results.push(await checkWorkingCapital());
        results.push(await checkRevenueTrends());
        
        // Add more checks as needed
    
        return results;
    }
}

module.exports = GoingConcernAssumption;