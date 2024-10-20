const assert = require('assert');
const {PurchasesJournal} = require('../index');

describe("PurchasesJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PurchasesJournal();
    })

    it("should create an instance of PurchasesJournal", async function(){
        assert.ok(journal instanceof PurchasesJournal);
    })
})
