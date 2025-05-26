"use strict"

const path = require('path');
const fs = require('fs');
const os = require('os');

const {
    info,
    warn,
    error
} = require('@pingleware/bestbooks-core');

const report_list = {
    accountPayablesAging: "account-payables-aging.xslt",
    accountReceivablesAging: "account-receivables-aging.xslt",
    balanceSheet: "balance-sheet.xslt",
    breakevenAnalysis: "breakeven-analysis.xslt",
    budgetVsActual: "budget-vs-actual.xslt",
    customerEstimate: "customer-estimate.xslt",
    incomeStatement: "income-statement.xslt",
    incomeStatementGeographic: "income-statement-geographic.xslt",
    purchaseOrder: "purchase-order.xslt",
    statementChangeInEquity: "statement-in-change-in-equity.xslt",
    statementCashFlows: "statement-of-cash-flows.xslt",
    trialBalance: "trial-balance.xslt",
    retainedEarnings: "retained-earnings.xslt"
};

function getReportFileName(reportName) {
    return report_list[reportName];
}

function getReportRootFileName(reportName) {
    return report_list[reportName].split(".")[0];
}

async function transform_xml_xslt(xml_content, xslt_content) {
    const {Xslt, XmlParser} = require('xslt-processor');
    const xslt = new Xslt();
    const xmlParser = new XmlParser();
    return await xslt.xsltProcess(
        xmlParser.xmlParse(xml_content),
        xmlParser.xmlParse(xslt_content.toString())
    );
}

function format(reportName,xml_content) {
    try {
        if (report_list[reportName]) {
            var xsltString = fs.readFileSync(path.join(os.homedir(),`.bestbooks/${report_list[reportName]}`));
            return transform_xml_xslt(xml_content,xsltString);
        } else {
            // report does not exist?
        }    
    } catch(err) {
        //console.error(formattedData)
        console.error(err);
    }
    return "";
}

function array2xml(topLevel, obj) {
    const js2xmlparser = require("js2xmlparser");
    return js2xmlparser.parse(topLevel, obj)
}

module.exports = {
    getReportFileName,
    getReportRootFileName,
    transform_xml_xslt,
    format,
    array2xml
}