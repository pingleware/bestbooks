"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class CustomerEstimate {
    constructor() {
    }

    createReport(customerEstimateInfo,callback) {
        var formattedData = array2xml('customerEstimate',customerEstimateInfo);
        fs.writeFileSync(path.join(os.homedir(),'.bestbooks/customer-estimate.xml'), formattedData);
        // Save report XML data to report table
        var txdate = new Date().getTime();
        var buffer = require('buffer').Buffer;
        var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','customer-estimate','${buffer.from(formattedData).toString('base64')}')`;
        const model = new Model();
        if (callback) {
            model.insert(sql,function(result){
                callback(format("customerEstimate",formattedData));
            });
        } else {
            model.insertSync(sql);
            return format("customerEstimate",formattedData);
        }
    }
}

module.exports = CustomerEstimate;