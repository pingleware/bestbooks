const assert = require('assert');
const {PettyCashJournal} = require('../index');

describe("PettyCashJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PettyCashJournal();
    })

    it("should create an instance of PettyCashJournal", async function(){
        assert.ok(journal instanceof PettyCashJournal);
    })
})
