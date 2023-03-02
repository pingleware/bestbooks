"use strict"

const path = require('path');
const fs = require('fs');
const os = require('os');

const report_list = {
    balanceSheet: "balance-sheet.xslt",
    customerEstimate: "customer-estimate.xslt",
    incomeStatement: "income-statement.xslt",
    noteToFinancialStatement: "note-to-financial-statements.xslt",
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

function transform_xml_xslt(xml_content, xslt_content) {
    const {xsltProcess, xmlParse} = require('xslt-processor');
    return xsltProcess(xmlParse(xml_content),xmlParse(xslt_content.toString()));
}

function format(reportName,formattedData) {
    if (report_list[reportName]) {
        var xsltString = fs.readFileSync(path.join(os.homedir(),`.bestbooks/${report_list[reportName]}`));
        return transform_xml_xslt(formattedData,xsltString);
    } else {
        // report does not exist?
    }
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