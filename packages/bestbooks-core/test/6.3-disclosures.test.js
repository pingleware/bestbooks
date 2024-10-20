const assert = require('assert');
const {Disclosures} = require('../index');

describe("Disclosures Class", async function(){
    let audit;

    before(function(){
        audit = new Disclosures();
    })

    it("should create an instance of Disclosures", async function(){
        assert.ok(audit instanceof Disclosures);
    })
})