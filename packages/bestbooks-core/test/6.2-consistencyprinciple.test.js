const assert = require('assert');
const {ConsistencyPrinciple} = require('../index');

describe("ConsistencyPrinciple Class", async function(){
    let audit;

    before(function(){
        audit = new ConsistencyPrinciple();
    })

    it("should create an instance of ConsistencyPrinciple", async function(){
        assert.ok(audit instanceof ConsistencyPrinciple);
    })
})