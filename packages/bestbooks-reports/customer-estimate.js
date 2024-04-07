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
        var lineItems = [];
        customerEstimateInfo.lineitems.lineitem.forEach(function(lineItem){
            lineItems.push({
                quantity: lineItem.quantity,
                description: lineItem.description,
                unitprice: Number(lineItem.unitprice).toFixed(2),
                discount: Number(lineItem.discount).toFixed(2),
                tax: Number(lineItem.tax).toFixed(2),
                total: Number(lineItem.total).toFixed(2)
            })
        })
        customerEstimateInfo.lineitems = { lineitem: lineItems };

        customerEstimateInfo.prices.subtotal = Number(customerEstimateInfo.prices.subtotal).toFixed(2);
        customerEstimateInfo.prices.tax = Number(customerEstimateInfo.prices.tax).toFixed(2);
        customerEstimateInfo.prices.shipping = Number(customerEstimateInfo.prices.shipping).toFixed(2);
        customerEstimateInfo.prices.other = Number(customerEstimateInfo.prices.other).toFixed(2);
        customerEstimateInfo.prices.total = Number(customerEstimateInfo.prices.total).toFixed(2);
        var formattedData = array2xml('customerEstimate',customerEstimateInfo);
        //console.log(formattedData)
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