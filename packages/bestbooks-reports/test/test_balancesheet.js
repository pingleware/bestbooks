const expect = require("chai").expect;
const { init, BalanceSheet } = require("../index");
const fs = require('fs');

describe("balance sheet", function(){
    before(function(){
        init();
    })
    it("get balance sheet report data", function(){
        var balanceSheet = new BalanceSheet();
        balanceSheet.createReport("","","array",function(xml){
            var notEmpty = (xml.length > 0);
            expect(notEmpty).to.equal(true);
            if (notEmpty) {
                fs.writeFileSync('balance-sheet.xml',xml);
            } else {
                fs.unlink('balance-sheet.xml');
            }
        });
    })
})