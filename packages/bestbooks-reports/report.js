"use strict"

class BaseReport {
    constructor() {}
    createReport(startDate,endDate,format,callback=null) {}
    retrieveReportData(startDate,endDate,callback=null) {}
}

module.exports = BaseReport;