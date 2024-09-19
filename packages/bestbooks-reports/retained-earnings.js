"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class RetainedEarnings extends BaseReport {
    constructor() {
        super();
    }

    createReport(startDate,endDate,_format,callback,notes="") {
        this.retrieveReportData(startDate, endDate, function(data){
            if (_format == "array") {
                var _data = {
                    date: new Date().toDateString(),
                    previous_retained_earnings: Number(data[0].previous_retained_earnings).toFixed(2),
                    net_income: Number(data[0].net_income).toFixed(2),
                    retained_earnings: Number(data[0].retained_earnings).toFixed(2),
                    notes: notes
                };
                var formattedData = array2xml('retainedEarnings',_data);
                fs.writeFileSync(path.join(os.homedir(),'.bestbooks/retained-earnings.xml'), formattedData);
                // Save report XML data to report table
                var txdate = new Date().getTime();
                var buffer = require('buffer').Buffer;
                var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','retained-earnings','${buffer.from(formattedData).toString('base64')}')`;
                const model = new Model();
                if (callback) {
                    model.insert(sql,function(result){
                        callback(format("retainedEarnings",formattedData));
                    });
                } else {
                    model.insertSync(sql);
                    return format("retainedEarnings",formattedData);
                }
            } else {
                // process other formats
            }    
        });
    }

    retrieveReportData(startDate,endDate,callback) {
        var _startDate = startDate;
        var lastYear, lastStartDate, lastEndDate;
        if (_startDate.length == 0) {
            lastYear = Number(new Date().getFullYear() - 1);
        } else {
            lastYear = Number(new Date(startDate).getFullYear() - 1);
        }
        lastStartDate = new Date(`01-01-${lastYear}`).toISOString().split('T')[0];
        lastEndDate = new Date(`12-31-${lastYear}`).toISOString().split('T')[0];

        var sql = `SELECT (SELECT ROUND(SUM(debit)+SUM(credit),2) FROM ledger WHERE account_code LIKE '9%') AS net_income, 
        ((SELECT ROUND(SUM(debit)+SUM(credit),2) FROM ledger WHERE account_code LIKE '9%') - 
        ROUND(SUM(debit)+SUM(credit),2)) AS retained_earnings,((SELECT ROUND(SUM(debit)+SUM(credit),2) 
        FROM ledger WHERE account_code LIKE '9%') - ROUND(SUM(debit)+SUM(credit),2) AND 
        txdate BETWEEN DATE('${lastStartDate}') AND DATE('${lastEndDate}')) AS previous_retained_earnings  
        FROM ledger WHERE account_name='Dividends Payable'`;
        if (startDate.length > 0 && endDate.length > 0) {
            sql = `${sql} AND txdate BETWEEN ${startDate} AND ${endDate}`;
        } else if (startDate.length > 0 && endDate.length == 0) {
            sql = `${sql} AND txdate >= ${startDate}`;
        } else if (startDate.length == 0 && endDate.length > 0) {
            sql = `${sql} AND txdate < ${endDate}`;
        }
        const model = new Model();
        model.query(sql,callback);
    }

    async retrieveReportDataSync(startDate,endDate) {
        return new Promise((resolve, reject) => {
            this.retrieveReportData(startDate, endDate, function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = RetainedEarnings;