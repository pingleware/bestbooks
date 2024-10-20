const assert = require('assert');
const {SalesReturnJournal} = require('../index');

describe("SalesReturnJournal Class", async function(){
    let journal;

    before(function(){
        journal = new SalesReturnJournal();
    })

    it("should create an instance of SalesReturnJournal", async function(){
        assert.ok(journal instanceof SalesReturnJournal);
    })
})
