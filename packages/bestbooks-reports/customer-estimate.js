"use strict"

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
        if (callback) {
            callback(format("customerEstimate",formattedData));
        } else {
            return format("customerEstimate",formattedData);
        }
    }
}

module.exports = CustomerEstimate;