const assert = require('assert');
const {CashReceiptsJournal} = require('../index');

describe("CashReceiptsJournal Class", async function(){
    let journal;

    before(function(){
        journal = new CashReceiptsJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of CashReceiptsJournal", async function(){
        assert.ok(journal instanceof CashReceiptsJournal);
    })

    it("should make an entry to the CashReceiptsJounral", async function(){
        await journal.recordReceipt({
            date: '2024-10-11',
            ref: 999,
            account: 'Cash',
            debit: 100,
            credit: 0,
            description: 'Test cash receipt'
        });   
    })
})
