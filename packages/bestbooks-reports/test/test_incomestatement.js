const expect = require("chai").expect;
const { init, IncomeStatement } = require("../index");
const fs = require('fs');

describe('income statement',function(){
    before(function(){
        init();
    })
    it('get income statement',function(){
        var incomestatement = new IncomeStatement();
        incomestatement.createReport("","","array",function(xml){
            var notEmpty = (xml.length > 0);
            expect(notEmpty).to.equal(true);
            if (notEmpty) {
                fs.writeFileSync('income-statement.xml',xml);
            } else {
                fs.unlink('income-statement.xml');
            }
        })
    })
})