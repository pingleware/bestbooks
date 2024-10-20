const assert = require('assert');
const {ConservatismPrinciple} = require('../index');

describe("ConservatismPrinciple Class", async function(){
    let audit;

    before(function(){
        audit = new ConservatismPrinciple();
    })

    it("should create an instance of ConservatismPrinciple", async function(){
        assert.ok(audit instanceof ConservatismPrinciple);
    })
})