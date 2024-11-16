const assert = require('assert');
const { 
    init, 
} = require("../index");
const {
    Model,
} = require("@pingleware/bestbooks-core");
const fs = require('fs');
const os = require('os');
const path = require('path');

const xslt_list = [
    "balance-sheet.xslt",
    "customer-estimate.xslt",
    "income-statement.xslt",
    "purchase-order.xslt",
    "statement-in-change-in-equity.xslt",
    "statement-of-cash-flows.xslt",
    "trial-balance.xslt",
    "retained-earnings.xslt"
];

describe("initialization", function(){
    before(function(){
        xslt_list.forEach(function(file){
            var fullpath = path.join(os.homedir(),`.bestbooks/${file}`);
            if (fs.existsSync(fullpath)) {
                fs.unlinkSync(fullpath);
            }
        })
    });
    after(function(){
        // remove files after test
        //xslt_list.forEach(function(file){
        //    var fullpath = path.join(os.homedir(),`.bestbooks/${file}`);
        //    if (fs.existsSync(fullpath)) {
        //        fs.unlinkSync(fullpath);
        //    }
        //})
    })
    it("check if report templates were initially copied",function(){
        let copied = init();
        assert.strictEqual(copied,xslt_list.length);
    })
    it("verify report templates were copied",function(){
        xslt_list.forEach(function(file){
            var fullpath = path.join(os.homedir(),`.bestbooks/${file}`);
            assert.strictEqual(fs.existsSync(`${fullpath}`),true);
        })
    });
    it("verify reprot templates cannot be copied if already exist",function(){
        let copied = init();
        assert.strictEqual(copied,0);
    })
});