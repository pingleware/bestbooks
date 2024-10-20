const assert = require('assert');
const {CashPaymentsJournal} = require('../index');

describe("CashPaymentsJournal Class", async function(){
    let journal;

    before(function(){
        journal = new CashPaymentsJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of CashPaymentsJournal", async function(){
        assert.ok(journal instanceof CashPaymentsJournal);
    })
})
