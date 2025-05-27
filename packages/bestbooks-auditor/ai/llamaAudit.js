"use strict"
const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require("axios");

if (!fs.existsSync(path.join(os.homedir(),'.bestbooks'))) {
    fs.mkdirSync(path.join(os.homedir(),'.bestbooks'));
}
if (!fs.existsSync(path.join(os.homedir(),'.bestbooks','gaap_rules.js'))) {
    fs.copyFileSync(path.join(__dirname,"gaap_rules.js"),(path.join(os.homedir(),'.bestbooks','gaap_rules.js')));
}
const { GAAP_RULES } = require(path.join(os.homedir(),'.bestbooks','gaap_rules.js'));

var OLLAMA_API = "http://localhost:11434/api/generate";
var MODEL = "ALIENTELLIGENCE/chiefauditofficer"; // RECOMMENDED OLLAMA MODEL

async function auditFinancialReport(reportText) {
  const rules = GAAP_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n");
  const prompt = `
You are a chief audit officer following GAAS/GAAP standards.

Analyze the following financial report for any misstatements or inconsistencies. Identify GAAP violations, suggest corrective actions, and summarize your findings.

GAAP Rules:
${rules}

Financial Report:
${reportText}

Output:
1. Summary of Findings
2. GAAP Violations
3. Recommendations
`;

  const response = await axios.post(OLLAMA_API, {
    model: MODEL,
    prompt,
    stream: false
  });

  return response.data.response.trim();
}

async function formatFinancialReport(json) {
  const {
    company,
    period,
    preparedBy,
    balanceSheet = {},
    incomeStatement = {},
    cashFlowStatement = {},
    notes = []
  } = json;

  function section(title, entries) {
    return `${title}:\n` + Object.entries(entries)
      .map(([key, val]) => `  ${key}: $${val.toLocaleString()}`)
      .join("\n");
  }

  return `
Company: ${company}
Period: ${period}
Prepared By: ${preparedBy}

=== Balance Sheet ===
${section("Assets", balanceSheet.assets || {})}

${section("Liabilities", balanceSheet.liabilities || {})}

${section("Equity", balanceSheet.equity || {})}

=== Income Statement ===
${section("Revenue", incomeStatement.revenue || {})}

${section("Expenses", incomeStatement.expenses || {})}

  Net Income: $${(incomeStatement.netIncome || 0).toLocaleString()}

=== Cash Flow Statement ===
${section("Operating Activities", cashFlowStatement.operating || {})}
${section("Investing Activities", cashFlowStatement.investing || {})}
${section("Financing Activities", cashFlowStatement.financing || {})}

  Ending Cash Balance: $${(cashFlowStatement.endingCash || 0).toLocaleString()}

Notes:
${notes.map((n, i) => `- ${n}`).join("\n")}
`.trim();
}


module.exports = {
    OLLAMA_API,
    MODEL,
    GAAP_RULES,
    auditFinancialReport,
    formatFinancialReport,
}