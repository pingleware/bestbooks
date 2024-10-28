const assert = require('assert');
const {
    AccountsPayable
} = require('../index');

describe('AccountsPayable class',async function(){
    let liability;

    before(function(){
        liability = new AccountsPayable("Vendor 1");
    })

    after(async function(){
        await liability.model.insertSync(`DELETE FROM accounts;`);
        await liability.model.insertSync(`DELETE FROM ledger;`);
        await liability.model.insertSync(`DELETE FROM journal`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await liability.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of AccountsPayable", async function(){
        assert.ok(liability instanceof AccountsPayable);
    })

})