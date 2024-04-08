const expect = require("chai").expect;
const { init, IncomeStatement } = require("../index");
const fs = require('fs');

describe('income statement',function(){
    before(function(){
        init();
    })
    it('get income statement',function(){
        var incomestatement = new IncomeStatement();
        const notes = `n our opinion, the income statement presents fairly, in all material respects, the results of operations for the specified period ended in accordance with FASB ASC Topic 220, Income Statement`;
        incomestatement.createReport("","","array",function(html){
            fs.writeFileSync('income-statement.html',html);
        },notes)
    })
})