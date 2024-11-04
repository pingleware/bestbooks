"use strict"

const { 
    Report
 } = require('@pingleware/bestbooks-core');

class BaseReport extends Report {
    saveReport(name, contents, type="xml",callback=null) {}
    saveReportSync(name, html, type) {}
    formatHtml(formattedData) {}
    formatXml(contents) {}
    formatArray(data,notes) {}
    retrieveReportData(startDate,endDate,callback) {}
    retrieveReportDataSync(startDate, endDate){}
}

module.exports = BaseReport;