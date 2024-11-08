const assert = require('assert');
const {
    FixedCost
} = require('../index');

describe("FixedCost Class", async function(){
    let account;

    before(function(){
        account = new FixedCost("Rent");
    })

    after(async function(){
        await account.model.insertSync(`DELETE FROM accounts;`);
        await account.model.insertSync(`DELETE FROM ledger;`);
        await account.model.insertSync(`DELETE FROM journal`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of FixedCost", async function(){
        assert.ok(account instanceof FixedCost);
    })

    it('should have a type of FixedCost and base type of Expense',async function(){
        assert.strictEqual(account.type,"FixedCost"); 
        assert.strictEqual(account.baseType,"Expense");
    })
});