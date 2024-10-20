const assert = require('assert');
const {SalesJournal} = require('../index');

describe("SalesJournal Class", async function(){
    let journal;

    before(function(){
        journal = new SalesJournal();
    })

    it("should create an instance of SalesJournal", async function(){
        assert.ok(journal instanceof SalesJournal);
    })
})
