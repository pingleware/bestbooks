const assert = require('assert');
const {InventoryJournal} = require('../index');

describe("InventoryJournal Class", async function(){
    let journal;

    before(function(){
        journal = new InventoryJournal();
    })

    it("should create an instance of InventoryJournal", async function(){
        assert.ok(journal instanceof InventoryJournal);
    })
})
