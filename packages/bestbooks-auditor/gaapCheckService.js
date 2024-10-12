// audit/gaapGaasCheckService.js

const {
    Model,
    Disclosures,
    ConsistencyPrinciple,
    Materiality,
    ConservatismPrinciple,
    GoingConcernAssumption,
} = require('@pingleware/bestbooks-core');
const moment = require('moment');

const model = new Model();

// Function to perform GAAP check for revenue recognition
async function performRevenueRecognitionCheck() {
    const today = moment().startOf('day');
    let errors = [];

    const rows = model.querySync(`
        SELECT le.id, le.txdate, le.description, le.debit, le.credit, le.account_name
        FROM ledger le
        JOIN accounts ac ON le.account_name = ac.name
        WHERE gl.accountType = 'Revenue'`);

    rows.forEach(entry => {
        const entryDate = moment(entry.txdate);
        if (entryDate.isAfter(today)) {
            errors.push({
                message: `Revenue entry for "${entry.description}" is posted in the future on ${entry.txdate}.`,
                entry
            });
        }
    });
    return({ check: 'Revenue Recognition', errors });
}

// Function to perform GAAP check for expense recognition
async function performExpenseRecognitionCheck() {
    let errors = [];

    const rows = model.querySync(`
      SELECT le.id, le.date, le.description, le.debit, le.credit, le.account_name
      FROM ledger le
      JOIN accounts ac ON le.account_name = ac.name
      WHERE gl.accountType = 'Expense'`);

    rows.forEach(entry => {
        if (entry.debit <= 0) {
          errors.push({
            message: `Expense entry for "${entry.description}" is improperly recognized.`,
            entry
          });
        }
    });
    return({ check: 'Expense Recognition', errors });
}

// Function to perform GAAS completeness check
async function performCompletenessCheck() {
    let errors = [];

    const rows = model.querySync(`
      SELECT le.account_name, SUM(le.debit) AS totalDebit, SUM(le.credit) AS totalCredit
      FROM ledger le
      JOIN accounts ac ON le.account_name = ac.name
      GROUP BY le.account_name`);

    rows.forEach(entry => {
        if (entry.totalDebit !== entry.totalCredit) {
          errors.push({
            message: `Discrepancy in account "${entry.account_name}": Total Debit (${entry.totalDebit}) doesn't match Total Credit (${entry.totalCredit}).`,
            entry
          });
        }
    });
    return({ check: 'Completeness Check', errors });
}

// 1. Valuation of Assets
async function performAssetValuationCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT account_name, balance 
        FROM ledger le 
        JOIN accounts ac ON le.account_name = ac.name 
        WHERE ac.type = 'Asset'`);

    rows.forEach(account => {
        if (account.balance <= 0) {
            errors.push({
            message: `Asset account "${account.account_name}" has an invalid balance (${account.balance})`
            });
        }
    });
    resolve({ check: 'Valuation of Assets', errors });
  }
  
  // 2. Inventory Valuation
  async function performInventoryValuationCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT le.account_name, le.balance 
        FROM ledger le 
        JOIN accounts ac ON le.account_name = ac.name 
        WHERE ac.type = 'Inventory'`);
    rows.forEach(account => {
        if (account.balance < 0) {
          errors.push({
            message: `Inventory valuation is incorrect for account "${account.account_name}"`
          });
        }
    });
    
    return({ check: 'Inventory Valuation', errors });
  }
  
  // 3. Accounts Receivable and Bad Debts
  async function performAccountsReceivableCheck() {
    let errors = [];

    
    const rows = model.querySync(`SELECT le.account_name, le.balance 
        FROM ledger le 
        JOIN accounts ac ON le.account_name = ac.name 
        WHERE ac.type = 'Accounts Receivable'`);
    rows.forEach(account => {
        if (account.balance < 0) {
          errors.push({
            message: `Bad debts are affecting Accounts Receivable balance for "${account.account_name}"`
          });
        }
    });
    return({ check: 'Accounts Receivable and Bad Debts', errors });
  }
  
  // 4. Accounts Payable and Accruals
  async function performAccountsPayableCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT le.account_name, le.balance 
        FROM ledger le 
        JOIN accounts ac ON le.account_name = ac.name 
        WHERE ac.type = 'Accounts Payable'`);
    rows.forEach(account => {
        if (account.balance < 0) {
          errors.push({
            message: `Accounts Payable has an unusual negative balance for "${account.account_name}"`
          });
        }
    });
    return({ check: 'Accounts Payable and Accruals', errors });
  }
  
  // 5. Equity Transactions
  async function performEquityTransactionsCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT le.account_name, le.balance 
        FROM ledger le 
        JOIN accounts ac ON le.account_name = ac.name 
        WHERE ac.type = 'Equity'`);
    rows.forEach(account => {
        if (account.balance < 0) {
            errors.push({
            message: `Equity transactions are causing negative balance in account "${account.account_name}"`
            });
        }
    });
    return({ check: 'Equity Transactions', errors });
  }
  
  // 6. Cash Flow Statement Accuracy
  async function performCashFlowStatementCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT account_name, balance 
        FROM ledger le 
        JOIN accounts ac ON le.account_name = ac.name 
        WHERE ac.type = 'Cash'`);
        
        rows.forEach(account => {
            if (account.balance < 0) {
                errors.push({
                message: `Cash flow statement shows negative cash balance for account "${account.account_name}"`
                });
            }
        });
        return({ check: 'Cash Flow Statement Accuracy', errors });
  }
  
  // 7. Compliance with Disclosure Requirements
  async function performDisclosureComplianceCheck() {
    let errors = [];

    try {
        const disclosures = new Disclosures();
        errors = await disclosures.checkDisclosureCompliance();
    } catch (error) {
        throw new Error('Error checking compliance: ' + error.message);
    }

    return { check: 'Compliance with Disclosure Requirements', errors };
  }
  
  // 8. Consistency Principle
  async function performConsistencyPrincipleCheck(accounting_method, reporting_period) {
    let errors = [];

    try {
      const consistency = new ConsistencyPrinciple();
      errors = consistency.checkConsistency(accounting_method, reporting_period);
    } catch (error) {
      throw new Error('Error consistency principle: ' + error.message);
    }

    return { check: 'Consistency Principle', errors };
  }
  
  // 9. Materiality
  /**
   * The Materiality Principle in accounting dictates that all financial information 
   * that could influence the decision-making of users of the financial statements 
   * (such as investors, creditors, or regulators) must be disclosed. 
   * If an item is "material," it must be accounted for and reported properly. 
   * Materiality is often judged based on the size or significance of the item relative 
   * to the company’s overall financial position.
   * 
   * @returns json { check: 'Materiality', errors }
   */
  async function performMaterialityCheck() {
    let errors = [];

    try {
      const materiality = new Materiality();
      errors = materiality.getMaterialTransactions();
    } catch (error) {
      throw new Error('Error materiality check: ' + error.message);
    }

    return { check: 'Materiality', errors };
  }
  
  // 10. Conservatism Principle
  /**
   * The Conservatism Principle in accounting dictates that, when faced with uncertainty, 
   * a company should record expenses and liabilities as soon as they are reasonably possible 
   * but only record revenues and assets when they are certain. This ensures that financial 
   * statements provide a cautious and realistic view of the company’s financial situation.
   * 
   * @returns 
   */
  async function performConservatismCheck() {
    let errors = [];
    
    try {
      const conservative = new ConservatismPrinciple();
      errors = conservative.getConservativeTransactions();
    } catch (error) {
      throw new Error('Error conservatism principle: ' + error.message);
    }  

    return { check: 'Conservatism Principle', errors };
  }
  
  // 11. Going Concern Assumption
  /**
   * The Going Concern Assumption in accounting is the assumption that a company will continue 
   * to operate in the foreseeable future and not be forced to halt its operations or liquidate 
   * its assets. In an audit or financial assessment, this principle is crucial because it affects 
   * the valuation of assets, liabilities, and other financial items.
   * 
   * @returns 
   */
  async function performGoingConcernCheck() {
    let errors = [];
    
    try {
      const goingConcern = new GoingConcernAssumption();
      errors = goingConcern.performAuditChecks();
    } catch (error) {
      throw new Error('Error going concern assumption: ' + error.message);
    }

    return { check: 'Going Concern Assumption', errors };
  }
  
  // 12. Segregation of Duties
  /**
   * The Segregation of Duties (SoD) principle is an internal control that ensures no single person 
   * has control over all phases of a transaction. In accounting, this typically involves separating 
   * duties related to authorization, custody of assets, and record-keeping. 
   * To implement this in Node.js with SQLite, we will track user roles and actions in the system 
   * and ensure that conflicting duties are not performed by the same user.
   * 
   * @returns 
   */
  async function performSegregationOfDutiesCheck() {
    let errors = [];

    const result = await model.querySync(
        `SELECT action, u.username, u.role
        FROM ledger l
        INNER JOIN users u ON l.performed_by = u.id`
    );

    const actionsPerformed = {};
    result.forEach(row => {
        // Store the actions performed by each user
        if (!actionsPerformed[row.performed_by]) {
            actionsPerformed[row.performed_by] = {
                username: row.username,
                actions: [],
            };
        }
        actionsPerformed[row.performed_by].actions.push(row.action);
    });

    // Check for SoD conflicts
    const conflicts = [];
    actionsPerformed.forEach(function(user){
      if (user.actions > 1) {
        conflicts.push(`${user.username} performed both ${user.actions[0]} and ${user.actions[1]}.`);
      }
    })
    
    return { check: 'Segregation of Duties', conflicts };
  }
  
  // 13. Fair Presentation of Financial Statements
  /**
   * The Fair Presentation of Financial Statements principle ensures that financial statements 
   * represent the financial position of an entity fairly and are in accordance with applicable 
   * accounting standards. To implement this principle using transaction data from a ledger table 
   * in Node.js with SQLite, we can follow these steps:
   * 
   * Define Criteria for Fair Presentation: Establish what constitutes fair presentation based 
   * on the data in the ledger, such as completeness, accuracy, and compliance with accounting 
   * standards.
   * 
   * Implement Logic to Evaluate Fair Presentation: Create a function to analyze the transaction 
   * data and check if it meets the defined criteria.
   * 
   * @returns 
   */
  async function performFairPresentationCheck() {
    // Check if all transactions have valid amounts and actions
    const invalidEntries = await model.querySync(
        `SELECT *
        FROM ledger
        WHERE amount IS NULL OR amount <= 0 OR action IS NULL`
    );

    if (invalidEntries.length > 0) {
        console.log('Invalid entries found in the ledger:', invalidEntries);
        return { status: 'Not Fairly Presented', message: 'Invalid entries found.' };
    }

    // Check for completeness: assume completeness means having at least one entry for each transaction ID
    const transactionCount = await model.querySync(`SELECT COUNT(*) as count 
      FROM ledger 
      HAVING count < 1`);

    if (transactionCount.length > 0) {
      console.log('Incomplete transactions found:', transactionCount);
      return { status: 'Not Fairly Presented', message: 'Incomplete transactions found.' };
    }

    // If there are no issues, the statements can be considered fairly presented
    console.log('Financial statements are fairly presented.');
    return { status: 'Fairly Presented', message: 'Financial statements are fairly presented.' };
  }
  
  // 14. Estimates and Assumptions
  async function performEstimatesCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT account_name, estimate 
            FROM ledger 
            WHERE estimate = 1`);
    rows.forEach(entry => {
        errors.push({
            message: `Estimate used for entry in account "${entry.account_name}"`
        });
    });
    resolve({ check: 'Estimates and Assumptions', errors });
  }
  
  // 15. Foreign Currency Transactions
  async function performForeignCurrencyCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT account_name, balance, currency 
        FROM ledger 
        WHERE currency != 'USD'`);
    rows.forEach(account => {
      errors.push({
        message: `Foreign currency transaction in "${account.currency}" for account "${account.account_name}"`
      });
    });
    return({ check: 'Foreign Currency Transactions', errors });
  }
  
  // 16. Leases and Income Taxes
  async function performLeasesAndIncomeTaxesCheck() {
    let errors = [];

    const rows = model.querySync(`SELECT account_name, leaseType, taxAmount 
        FROM ledger 
        WHERE leaseType IS NOT NULL OR taxAmount > 0`);

    rows.forEach(entry => {
      if (entry.leaseType) {
        errors.push({
          message: `Lease transaction found for "${entry.account_name}" of type "${entry.leaseType}"`
        });
      }
      if (entry.taxAmount > 0) {
        errors.push({
          message: `Income tax recorded for "${entry.account_name}" with tax amount of ${entry.taxAmount}`
        });
      }
    });
    resolve({ check: 'Leases and Income Taxes', errors });
  }
  

// Perform all checks and return the results
async function performAuditChecks() {
  const results = await Promise.all([
    performRevenueRecognitionCheck(),
    performExpenseRecognitionCheck(),
    performCompletenessCheck(),
    performAssetValuationCheck(),
    performInventoryValuationCheck(),
    performAccountsReceivableCheck(),
    performAccountsPayableCheck(),
    performEquityTransactionsCheck(),
    performCashFlowStatementCheck(),
    performDisclosureComplianceCheck(),
    performConsistencyPrincipleCheck(),
    performMaterialityCheck(),
    performConservatismCheck(),
    performGoingConcernCheck(),
    performSegregationOfDutiesCheck(),
    performFairPresentationCheck(),
    performEstimatesCheck(),
    performForeignCurrencyCheck(),
    performLeasesAndIncomeTaxesCheck()
  ]);

  return results;
}


module.exports = { 
  performAuditChecks,
  performRevenueRecognitionCheck,
  performExpenseRecognitionCheck,
  performCompletenessCheck,
  performAssetValuationCheck,
  performInventoryValuationCheck,
  performAccountsReceivableCheck,
  performAccountsPayableCheck,
  performEquityTransactionsCheck,
  performCashFlowStatementCheck,
  performDisclosureComplianceCheck,
  performConsistencyPrincipleCheck,
  performMaterialityCheck,
  performConservatismCheck,
  performGoingConcernCheck,
  performSegregationOfDutiesCheck,
  performFairPresentationCheck,
  performEstimatesCheck,
  performForeignCurrencyCheck,
  performLeasesAndIncomeTaxesCheck,
};