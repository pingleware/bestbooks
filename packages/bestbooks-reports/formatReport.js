"use strict"

const path = require('path');
const fs = require('fs');
const os = require('os');
const {xsltProcess, xmlParse} = require('xslt-processor');

const report_list = {
    balanceSheet: "balance-sheet.xslt",
    customerEstimate: "customer-estimate.xslt",
    incomeStatement: "income-statement.xslt",
    notedFinancialStatement: "noted-to-financial-statements.xslt",
    purchaseOrder: "purchase-order.xslt",
    statementChangeInEquity: "statement-in-change-in-equity.xslt",
    statementCashFlows: "statement-of-cash-flows.xslt",
    trialBalance: "trial-balance.xslt"
};

function transform_xml_xslt(xml_content, xslt_content) {
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
    format,
    array2xml
}