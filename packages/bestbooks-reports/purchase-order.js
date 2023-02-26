"use strict"

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
        if (callback) {
            callback(format("purchaseOrder",formattedData));
        } else {
            return format("purchaseOrder",formattedData);
        }
    }
}

module.exports = PurchaseOrder;