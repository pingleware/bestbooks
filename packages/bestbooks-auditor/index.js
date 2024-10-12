"use strict"

const { exec } = require('child_process');
const {  NoteToFinancialStatements } = require('@pingleware/bestbooks-reports');
const {
  train,
  query
} = require('./ai/brain.js');
const { 
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
} = require('./gaapCheckService.js');

function invoke(rexepathname,scriptpathname,reportId,reportName,callback=null) {
    exec(`${rexepathname} ${scriptpathname} ${reportName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          if (callback) {
            callback(JSON.stringify({status: 'error', message: error.message}));
          } else {
            return error.message;
          }
        }
      
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          if (callback) {
            callback(JSON.stringify({status: 'error', message: stderr}));
            } else {
                return JSON.stringify({status: 'error', message: stderr});
            }
        }
      
        console.log(`stdout:\n${stdout}`);
        var noteToFinancialStatement = new NoteToFinancialStatements();
        if (noteToFinancialStatement.modifyReport) {
          noteToFinancialStatement.modifyReport(reportId,reportName,stdout,function(results){
            if (callback) {
                callback(JSON.stringify({status: 'success', message: stdout}));
            } else {
                return JSON.stringify({status: 'success', message: stdout});
            }
          });
        } else {
          if (callback) {
            callback(JSON.stringify({status: 'success', message: stdout}));
          } else {
              return JSON.stringify({status: 'success', message: stdout});
          }
        }
    });
}

/**
 * Assets:
 * 100-199: Current Assets
 * 200-299: Fixed Assets
 * 300-399: Intangible Assets
 * 400-499: Other Assets
 * 
 * Liabilities:
 * 500-599: Current Liabilities
 * 600-699: Long-Term Liabilities
 * 700-799: Other Liabilities
 * 
 * Equity:
 * 800-899: Common Stock
 * 900-999: Retained Earnings
 * 
 * Revenue:
 * 1000-1999: Sales Revenue
 * 2000-2999: Other Revenue
 * 
 * Expenses:
 * 3000-3999: Cost of Goods Sold
 * 4000-4999: Operating Expenses
 * 5000-5999: Interest Expenses
 * 6000-6999: Tax Expenses
 * 
 * Bank and Cash Accounts:
 * 10000-10999: Main Operating Bank Account
 * 11000-11999: Savings Account
 * 12000-12999: Petty Cash
 * 
 * Accounts Payable and Receivable:
 * 20000-20999: Accounts Payable
 * 21000-21999: Accounts Receivable
 * 
 * Income and Expense Categories:
 * 30000-30999: Salaries and Wages
 * 31000-31999: Rent and Lease Expenses
 * 32000-32999: Utilities
 * 33000-33999: Marketing and Advertising
 * 
 * Project or Department Codes:
 * 40000-49999: Project A
 * 50000-59999: Project B
 * 60000-69999: Department X
 * 70000-79999: Department Y
 * 
 * Tax Codes:
 * 80000-89999: Sales Tax Payable
 * 90000-99999: Income Tax Payable
 * 
 */
const chartOfAccounts = {
  assets: {
    current: {
      cash: '100',
    },
    fixed: {
      machinery: '200',
      vehicles: '210',
    },
    intangible: {

    },
    other: {

    }
  },
  liabilities: {
    current: {
      accountsPayable: '500',
      shortTermLoans: '510',
    },
    longTerm: {
      longTermDebt: '600',
    },
    other: {

    }
  },
  equity: {
    commonStock: '800',
    retainedEarnings: '900',
  },
  revenue: {
    sales: '1000',
    otherIncome: '2000',
  },
  expenses: {
    costOfGoodsSold: '3000',
    operatingExpenses: '4000',
    interestExpenses: '5000',
    taxExpenses: '6000',
  },
  bank: {
    main: 10000,
    savings: 11000,
    pettyCash: 12000,
  },
  accounts: {
    payable: 20000,
    receivable: 21000,
  },
  project: {

  },
  taxPayable: {
    sales: 80000,
    income: 90000,
  }
};

/**
 * // Example usage:
 * 
 * const sampleTransaction = {
 *   date: '2023-11-07',
 *   description: 'cash',
 *   amount: 1000,
 *   accountType: 'assets',
 * };
 * 
 * codifyTransaction(sampleTransaction);
 * 
 */
function codifyTransaction(transaction,gaap=false) {
  let _chartOfAccounts = chartOfAccounts;
  if (gaap) {
    _chartOfAccounts = gaapChartOfAccounts;
  }
  // Extract transaction details
  const { date, description, amount, accountType } = transaction;

  // Determine the account code based on the chart of accounts
  const accountCode = _chartOfAccounts[accountType] ? _chartOfAccounts[accountType][description] : null;

  if (accountCode) {
    // Perform further processing as needed (e.g., recording the transaction in a ledger)
    return (`Date: ${date}, Description: ${description}, Amount: ${amount}, Account Code: ${accountCode}`);
  } else {
    console.log(`Invalid account description: ${description}`);
  }
}

function getChartOfAccounts(gaap=false) {
  if (gaap) {
    return gaapChartOfAccounts;
  }
  return chartOfAccounts;
}

/**
 * transaction format
 * 
 * {
 *     date: '2023-11-08',
 *     description: 'accountsPayable',
 *     amount: 2000,
 *     accountType: 'liabilities',
 * },
 * 
 * @param {*} transactions 
 * @returns 
 */
function generateCodificationReport(transactions,gaap=false) {
  const report = {};
  let _chartOfAccounts = chartOfAccounts;
  if (gaap) {
    _chartOfAccounts = gaapChartOfAccounts;
  }

  transactions.forEach((transaction) => {
    const { date, description, amount, accountType } = transaction;
    const accountCode = _chartOfAccounts[accountType] ? _chartOfAccounts[accountType][description] : null;

    if (accountCode) {
      if (!report[accountCode]) {
        report[accountCode] = { totalAmount: 0, transactions: [] };
      }

      report[accountCode].totalAmount += amount;
      report[accountCode].transactions.push({ date, description, amount });
    }
  });

  return report;
}
/**
 * // Example: Adding a specific account under "Current Assets"
 * gaapChartOfAccounts.assets.currentAssets.supplies = {};
 * 
 * 
 * // Example: Adding a specific account under "Operating Expenses"
 * gaapChartOfAccounts.expenses.operatingExpenses.advertising = {};
 * 
 * console.log(JSON.stringify(gaapChartOfAccounts, null, 2));
 * 
 */
const gaapChartOfAccounts = {
  assets: {
    currentAssets: {
      cashAndCashEquivalents: {},
      accountsReceivable: {},
      inventory: {},
    },
    nonCurrentAssets: {
      propertyPlantAndEquipment: {},
      intangibleAssets: {},
      investments: {},
    },
  },
  liabilities: {
    currentLiabilities: {
      accountsPayable: {},
      shortTermDebt: {},
    },
    nonCurrentLiabilities: {
      longTermDebt: {},
      deferredTaxLiabilities: {},
    },
  },
  equity: {
    commonStock: {},
    retainedEarnings: {},
  },
  revenue: {
    sales: {},
    interestIncome: {},
    otherRevenue: {},
  },
  expenses: {
    costOfGoodsSold: {},
    operatingExpenses: {
      salariesAndWages: {
        account: 4100,
      },
      rent: {
        account: 4200,
      },
      utilities: {
        account: 4300,
      },
      computerSoftware: {
        researchDevelopment: {
          asc: "985-20-25-1",
          account: 4400,
        },
        development: {
          asc: "985-20-25-6",
          account: 4401,
        },
        production: {
          direct: {
            asc: "985-20-25-3",
            account: 4410,  
          },
          indirect: {
            asc: "985-20-25-5",
            account: 4411,
          }
        },
        maintenance: {
          asc: "985-20-25-6",
          account: 4420,
        },
        customerSupport: {
          asc: "985-20-25-6",
          account: 4430,
        }
      }
    },
    interestExpenses: {},
    incomeTaxExpenses: {},
  },
};

// COBIT

const {
  COBITAudit,
  COBIT,
  ITManagementFramework,
  ITStrategy,
  EnterpriseArchitecture,
  InnovationManagement,
  ITPortfolio,
  ITBudget,
  HRManagement,
  RelationshipManagement,
  ServiceAgreements, 
  ProgramManagement,
  RequirementsManagement,
  SolutionsManagement,
  DataManagement,
  SystemsSecurity,
  ChangeManagement,
  ChangeAcceptance,
  KnowledgeManagement,
  AssetManagement,
  ConfigurationManagement, 
  OperationsManagement,
  ServiceRequestIncidentManagement,
  ProblemManagement,
  ContinuityManagement,
  SecurityServicesManagement,
  BusinessProcessControlsManagement,
  DSSDataManagement,
  FacilitiesManagement,  
  GovernanceFramework,
  GovernanceStructure,
  BenefitsDelivery,
  RiskOptimization,
  ResourceOptimization,
  StakeholderTransparency,
  PerformanceConformanceManagement,
  InternalControlMonitoring,
  ComplianceMonitoring,
  ITGovernanceAssurance,
} = require('./cobit/COBITAudit.js');

// SOC 1 Framework
/*
    // Usage example
    const userAuthenticated = Soc1Framework.Security.authenticateUser('username', 'password');

    if (userAuthenticated) {
        Soc1Framework.Security.logEvent('User authenticated successfully.');
        // Perform other actions as needed
    } else {
        Soc1Framework.Security.logEvent('Failed authentication attempt.');
        // Handle authentication failure
    }
*/
const {
  Soc1Framework,
  Soc2Framework,
  Soc3Framework
} = require('./soc/SocFramework.js');

const {
  RAG_SERVER_URL
} = require('./ai/llamaAudit.js')

const {
  ToJSON,
  ToXML,
} = require('./formatAuditResults.js');

const { sendAlertEmail } = require('./notificationService.js')

module.exports = {
  invoke,
  codifyTransaction,
  getChartOfAccounts,
  generateCodificationReport,
  COBITAudit,
  COBIT,
  ITManagementFramework,
  ITStrategy,
  EnterpriseArchitecture,
  InnovationManagement,
  ITPortfolio,
  ITBudget,
  HRManagement,
  RelationshipManagement,
  ServiceAgreements, 
  ProgramManagement,
  RequirementsManagement,
  SolutionsManagement,
  DataManagement,
  SystemsSecurity,
  ChangeManagement,
  ChangeAcceptance,
  KnowledgeManagement,
  AssetManagement,
  ConfigurationManagement, 
  OperationsManagement,
  ServiceRequestIncidentManagement,
  ProblemManagement,
  ContinuityManagement,
  SecurityServicesManagement,
  BusinessProcessControlsManagement,
  DSSDataManagement,
  FacilitiesManagement,  
  GovernanceFramework,
  GovernanceStructure,
  BenefitsDelivery,
  RiskOptimization,
  ResourceOptimization,
  StakeholderTransparency,
  PerformanceConformanceManagement,
  InternalControlMonitoring,
  ComplianceMonitoring,
  ITGovernanceAssurance,
  Soc1Framework,
  Soc2Framework,
  Soc3Framework,
  RAG_SERVER_URL,
  train,
  query,
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
  ToJSON,
  ToXML,
  sendAlertEmail,
};