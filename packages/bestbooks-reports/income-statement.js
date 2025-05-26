"use strict"

const BaseReport = require('./report');

const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class IncomeStatement extends BaseReport {
    constructor() {
        super();
    }

    saveReport(name, contents, type="xml",callback=null){
        const filePath = path.join(os.homedir(),`.bestbooks/${name}.${type}`);
        // the xslt-processor does not support the XSLT syntax xsl:for-each-group, 
        // so the XML generated is returned,
        // using a free tool like https://xslttest.appspot.com/, 
        // to copy the .bestbooks/balance-sheet.xslt and .bestbooks/balance-sheet.xml
        // to render a HTML
        // TODO: implement xsl:for-each-group. callback(format("balanceSheet",formattedData));

        fs.writeFileSync(filePath, contents);
        callback(filePath)
    }

    async saveReportSync(name, html, type) {
        return new Promise((resolve,reject) => {
            try {
                this.saveReport(name, html, type, function(filePath){
                    resolve(filePath);
                })    
            } catch(error) {
                reject(error);
            }
        })
    }

    async formatHtml(template,formattedData) {
        return format(template,formattedData);
    }

    async formatXml(template,contents) {
        return array2xml(template,contents);
    }

    async formatArray(data,notes) {
        var _data = {
            date: new Date().toDateString(),
            lineItems: [],
            geographies: [],
            totalIncome: 0,
            totalExpense: 0,
            netIncome: 0
        };
        let totalIncome = 0;
        let totalExpense = 0;

        var lineItems = [];
        var geographies = [];

        let totalLineItems = 0;

        data.forEach(function(lineItem){
            lineItem.code = lineItem.account_code;
            lineItem.name = lineItem.account_name;

            switch(lineItem.type) {
                case 'Expense':
                    lineItem.balance = lineItem.total_expense;
                    lineItems.push(lineItem);
                    totalExpense += Number(lineItem.total_expense);
                    totalLineItems++;
                    if (lineItem.region) {
                        if (typeof geographies[lineItem.region] === "undefined") {
                            geographies[lineItem.region] = {}; // Initialize as an object
                        }
                        
                        if (typeof geographies[lineItem.region][lineItem.location] === "undefined") {
                            geographies[lineItem.region][lineItem.location] = 0;
                        }
                        geographies[lineItem.region][lineItem.location]++;
                    }
                    break;
                case 'Income':
                    lineItem.balance = lineItem.total_revenue;
                    lineItems.push(lineItem);
                    totalIncome += Number(lineItem.total_revenue);
                    totalLineItems++;
                    if (lineItem.region) {
                        if (typeof geographies[lineItem.region] === "undefined") {
                            geographies[lineItem.region] = {}; // Initialize as an object
                        }
                        
                        if (typeof geographies[lineItem.region][lineItem.location] === "undefined") {
                            geographies[lineItem.region][lineItem.location] = 0;
                        }
                        geographies[lineItem.region][lineItem.location]++;
                    }
                    break;
                case 'Revenue':
                    lineItem.type = "Income";
                    lineItem.balance = lineItem.total_revenue;
                    lineItems.push(lineItem);
                    totalIncome += Number(lineItem.total_revenue);
                    totalLineItems++;
                    if (lineItem.region) {
                        if (typeof geographies[lineItem.region] === "undefined") {
                            geographies[lineItem.region] = {}; // Initialize as an object
                        }
                        
                        if (typeof geographies[lineItem.region][lineItem.location] === "undefined") {
                            geographies[lineItem.region][lineItem.location] = 0;
                        }
                        geographies[lineItem.region][lineItem.location]++;
                    }
                    break;
            }
        });
        
        for (const region in geographies) {
            for (const location in geographies[region]) {
                const percent = (Number(geographies[region][location] / totalLineItems) * 100).toFixed(0);
                geographies[region][location] = Number(percent);
            }
        }
        
        let netIncome = Number(totalIncome - totalExpense).toFixed(2);

        _data.lineItems = { lineitem: lineItems };
        _data.geographies = geographies;
        _data.totalIncome = totalIncome.toFixed(2);
        _data.totalExpense = totalExpense.toFixed(2);
        _data.netIncome = netIncome;
        _data.notes = notes;

        return _data;
    }

    retrieveReportData(startDate,endDate,callback,geographic=false) {
        callback(this.retrieveReportDataSync(startDate,endDate,geographic));
    }

    async retrieveReportDataSync(startDate,endDate,geographic) {
        return await this.incomeStatementSync(startDate, endDate, geographic);
    }
}

module.exports = IncomeStatement;