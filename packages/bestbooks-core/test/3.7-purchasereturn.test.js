const assert = require('assert');
const {PurchaseReturnJournal} = require('../index');

describe("PurchaseReturnJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PurchaseReturnJournal();
    })

    it("should create an instance of PurchaseReturnJournal", async function(){
        assert.ok(journal instanceof PurchaseReturnJournal);
    })
})
