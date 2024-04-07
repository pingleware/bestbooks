const expect = require("chai").expect;
const { init, BalanceSheet } = require("../index");
const fs = require('fs');

describe("balance sheet", function(){
    before(function(){
        init();
    })
    it("get balance sheet report data", function(){
        var balanceSheet = new BalanceSheet();
        const notes = `In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 210, Balance Sheet.`;
        balanceSheet.createReport("","","array",function(html){
            fs.writeFileSync('balance-sheet.html',html);
        },notes);
    })
})