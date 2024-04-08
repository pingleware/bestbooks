const expect = require("chai").expect;
const { init, StatementChangeInEquity } = require("../index");
const fs = require('fs');

describe('change in equity',function(){
    before(function(){
        init();
    })
    it('change in equity',function(){
        const notes = `In our opinion, the statement of changes in equity presents fairly, in all material respects, the changes in equity for the period specified in accordance with FASB Accounting Standards Codification (ASC) Topic 505, Equity..`;
        var changeInEquity = new StatementChangeInEquity();
        changeInEquity.createReport("","","array",function(html){
            var notEmpty = (html.length > 0);
            expect(notEmpty).to.equal(true);
            if (notEmpty) {
                fs.writeFileSync('change-in-equity-statement.html',html);
            } else {
                fs.unlink('change-in-equity-statement.html');
            }
        },notes)
    })
})