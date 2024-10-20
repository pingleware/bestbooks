const assert = require('assert');
const {Equity} = require('../index');

describe("Equity Class", async function(){
    let equity;

    before(function(){
        equity = new Equity("Test");
    })

    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })


    it("should create an instance of Equity", async function(){
        assert.ok(equity instanceof Equity);
    })
})
