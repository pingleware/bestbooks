const GAAPRuleEngine = require("./engine");

const sampleFinancialData = {
    overall: true,
    revenue: 500000,
    expenses: 300000,
    accountingPolicies: {
        revenueRecognition: "accrual",
        depreciation: "straight-line"
    },
};

const auditor = new GAAPRuleEngine();
const auditResults = auditor.audit(sampleFinancialData);

console.log("Audit Results:", auditResults);
/*
const { validateGAAP } = require('./validator');

// Sample accounting entry
const accountingEntry = {
    accountingMethod: 'accrual',
    assetValue: 100000,
    historicalCost: 100000,
    revenueRecognized: true
};

// Run validation
const results = validateGAAP(accountingEntry);
console.log(JSON.stringify(results, null, 2));
*/