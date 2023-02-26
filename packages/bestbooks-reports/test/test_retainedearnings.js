const expect = require("chai").expect;
const { init, RetainedEarnings } = require("../index");
const fs = require('fs');

describe('retained earnings',function(){
    before(function(){
        init();
    })
    it('get retained earnings report',function(){
        var retainedEarnings = new RetainedEarnings();
        retainedEarnings.createReport("","","array",function(html){
            var notEmpty = (html.length > 0);
            expect(notEmpty).to.equal(true);
            if (notEmpty) {
                fs.writeFileSync('retained-earnings.html',html);
            } else {
                fs.unlink('retained-earnings.html');
            }
        })
    })
})