const assert = require('assert');
const {Income} = require('../index');

describe("Income Class", async function(){
    let income;

    before(function(){
        income = new Income("Test");
    })

    after(async function(){
        await income.model.insertSync(`DELETE FROM accounts;`);
        await income.model.insertSync(`DELETE FROM ledger;`);
        await income.model.insertSync(`DELETE FROM journal`);
        await income.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await income.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await income.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Income", async function(){
        assert.ok(income instanceof Income);
    })
})
