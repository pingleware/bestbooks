"use strict"

const { Model } = require('@pingleware/bestbooks-core');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class PurchaseOrder {
    constructor() {
    }

    createReport(purchaseOrderInfo,callback) {
        var lineItems = [];
        purchaseOrderInfo.lineitems.lineitem.forEach(function(lineItem){
            lineItems.push({
                quantity: lineItem.quantity,
                description: lineItem.description,
                unitprice: Number(lineItem.unitprice).toFixed(2),
                amount: Number(lineItem.amount).toFixed(2)
            })
        })
        purchaseOrderInfo.lineitems = { lineitem: lineItems };
        purchaseOrderInfo.prices.subtotal = Number(purchaseOrderInfo.prices.subtotal).toFixed(2);
        purchaseOrderInfo.prices.tax = Number(purchaseOrderInfo.prices.tax).toFixed(2);
        purchaseOrderInfo.prices.shipping = Number(purchaseOrderInfo.prices.shipping).toFixed(2);
        purchaseOrderInfo.prices.other = Number(purchaseOrderInfo.prices.other).toFixed(2);
        purchaseOrderInfo.prices.total = Number(purchaseOrderInfo.prices.total).toFixed(2);

        var formattedData = array2xml('purchaseOrder',purchaseOrderInfo);
        fs.writeFileSync(path.join(os.homedir(),'.bestbooks/purchase-order.xml'), formattedData);
        // Save report XML data to report table
        var txdate = new Date().getTime();
        var buffer = require('buffer').Buffer;
        // TODO: move this INSERT in the Core.Report class per CODING STANDARDS
        var sql = `INSERT INTO report (txdate,name,contents) VALUES ('${txdate}','purchase-order','${buffer.from(formattedData).toString('base64')}')`;
        const model = new Model();
        if (callback) {
            model.insert(sql,function(result){
                callback(format("purchaseOrder",formattedData));
            });
        } else {
            model.insertSync(sql);
            return format("purchaseOrder",formattedData);
        }
    }

    createReportFromXML(formattedData,callback) {
        if (callback) {
            callback(format("purchaseOrder",formattedData));
        } else {
            return format("purchaseOrder",formattedData);
        }
    }
}

module.exports = PurchaseOrder;