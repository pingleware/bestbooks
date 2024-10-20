const assert = require('assert');
const {OwnersEquity} = require('../index');

describe("OwnersEquity Class", async function(){
    let test;

    before(function(){
        test = new OwnersEquity("Founder");
    })


    it("should create an instance of OwnersEquity", async function(){
        assert.ok(test instanceof OwnersEquity);
    })

    // Additional test cases can be added below
    it("should have a name property set to 'Founder'", function() {
        assert.strictEqual(test.name, "Founder");
    });
})
