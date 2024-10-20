const assert = require('assert');
const {FixedAssetJournal} = require('../index');

describe("FixedAssetJournal Class", async function(){
    let journal;

    before(function(){
        journal = new FixedAssetJournal();
    })

    it("should create an instance of FixedAssetJournal", async function(){
        assert.ok(journal instanceof FixedAssetJournal);
    })
})
