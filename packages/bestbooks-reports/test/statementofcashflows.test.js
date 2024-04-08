const expect = require("chai").expect;
const { init, StatementCashFlows } = require("../index");
const fs = require('fs');

describe('statement of cashflows',function(){
    before(function(){
        init();
    })
    it('create report for statement of cashflows',function(){
        var statementOfCashFlows = new StatementCashFlows();
        statementOfCashFlows.createReport("2013-01-01","2013-12-31","array",function(xml){
            var notEmpty = (xml.length > 0);
            expect(notEmpty).to.equal(true);
            if (notEmpty) {
                fs.writeFileSync('statement-of-cashflows.xml',xml);
            } else {
                fs.unlink('statement-of-cashflows.xml');
            }
        })
    })
})