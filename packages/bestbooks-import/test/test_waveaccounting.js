const fs = require("fs");
const os = require("os");
const path = require("path");
const { import_from_waveaccounting } = require("../index");

require('dotenv').config()

describe("import waveaccounting", function(){
    it("accounting", function(){
        var filename = path.join(os.homedir(),process.env.ACCOUNTING_CSV);
        var params = {
            filename: filename,
            source: 'accounting',
            company_id: 1,
            office_id: 0
        };
        import_from_waveaccounting(params, function(accounting){
            console.log(accounting);
        });
    });
    it("bill items", function(){
        var filename = path.join(os.homedir(),process.env.BILLITEMS_CSV);
        var params = {
            filename: filename,
            source: 'bill_items',
            company_id: 1,
            office_id: 0
        };
        import_from_waveaccounting(params, function(bill_items){
            console.log(bill_items);
        });
    });
    it("customers", function(){
        var filename = path.join(os.homedir(),process.env.CUSTOMER_CSV);
        var params = {
            filename: filename,
            source: 'customers',
            company_id: 1,
            office_id: 0
        };
        import_from_waveaccounting(params, function(customers){
            console.log(customers);
        });
    });
    it("vendors", function(){
        var filename = path.join(os.homedir(),process.env.VENDOR_CSV);
        var params = {
            filename: filename,
            source: 'vendors',
            company_id: 1,
            office_id: 0
        };
        import_from_waveaccounting(params, function(vendors){
            console.log(vendors);
        });
    });
});