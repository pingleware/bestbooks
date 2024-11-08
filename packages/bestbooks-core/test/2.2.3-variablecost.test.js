const assert = require('assert');
const {
    VariableCost
} = require('../index');

describe("VariableCost Class", async function(){
    let account;

    before(function(){
        account = new VariableCost("Supplies");
    })

    after(async function(){
        await account.model.insertSync(`DELETE FROM accounts;`);
        await account.model.insertSync(`DELETE FROM ledger;`);
        await account.model.insertSync(`DELETE FROM journal`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await account.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of VariableCost", async function(){
        assert.ok(account instanceof VariableCost);
    })

    it('should have a type of VariableCost and base type of Expense',async function(){
        assert.strictEqual(account.type,"VariableCost"); 
        assert.strictEqual(account.baseType,"Expense");
    })
});