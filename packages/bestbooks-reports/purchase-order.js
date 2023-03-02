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
        var formattedData = array2xml('purchaseOrder',purchaseOrderInfo);
        fs.writeFileSync(path.join(os.homedir(),'.bestbooks/purchase-order.xml'), formattedData);
        // Save report XML data to report table
        var txdate = new Date().getTime();
        var buffer = require('buffer').Buffer;
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
}

module.exports = PurchaseOrder;