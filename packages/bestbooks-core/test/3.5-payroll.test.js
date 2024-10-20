const assert = require('assert');
const {PayrollJournal} = require('../index');

describe("PayrollJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PayrollJournal();
    })

    it("should create an instance of PayrollJournal", async function(){
        assert.ok(journal instanceof PayrollJournal);
    })
})
