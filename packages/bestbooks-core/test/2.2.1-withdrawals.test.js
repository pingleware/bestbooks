const assert = require('assert');
const {Withdrawals} = require('../index');

describe("Withdrawals Class", async function(){
    let withdrawal;

    before(function(){
        withdrawal = new Withdrawals();
    })

    after(async function(){
        await withdrawal.model.insertSync(`DELETE FROM accounts;`);
        await withdrawal.model.insertSync(`DELETE FROM ledger;`);
        await withdrawal.model.insertSync(`DELETE FROM journal`);
        await withdrawal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await withdrawal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await withdrawal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })


    it("should create an instance of Withdrawals", async function(){
        assert.ok(withdrawal instanceof Withdrawals);
    })
})
