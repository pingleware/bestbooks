const assert = require('assert');
const {GoingConcernAssumption} = require('../index');

describe("GoingConcernAssumption Class", async function(){
    let audit;

    before(function(){
        audit = new GoingConcernAssumption();
    })

    it("should create an instance of GoingConcernAssumption", async function(){
        assert.ok(audit instanceof GoingConcernAssumption);
    })
})