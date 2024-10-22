const assert = require('assert');
const {FixedAssetJournal} = require('../index');

describe("FixedAssetJournal Class", async function(){
    let journal;

    before(function(){
        journal = new FixedAssetJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of FixedAssetJournal", async function(){
        assert.ok(journal instanceof FixedAssetJournal);
    })

    it('should record a fixed asset transaction', async () => {
        const record = { date: '2024-10-22', ref: 1, account: 'FixedAssets', debit: 5000, credit: 0 };
        await journal.recordAssetTransaction(record);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 1, 'Transaction should be recorded');
        assert.strictEqual(transactions[0].account, 'FixedAssets', 'Account should be FixedAssets');
    });

    it('should calculate the correct balance', async () => {
        await journal.recordAssetTransaction({ date: '2024-10-22', ref: 2, account: 'Depreciation', debit: 0, credit: 1000 });
        const balance = await journal.getJournalBalance();
        assert.strictEqual(balance, -4000, 'Balance should be -4000');
    });

    it('should update an existing transaction', async () => {
        await journal.updateTransaction(1, { date: '2024-10-23', account: 'FixedAssets', debit: 1000, credit: 0, ref: 1 });
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions[1].debit, 1000, 'Debit should be updated to 1000');
    });

    it('should check if the journal is in balance', async () => {
        const inBalance = await journal.checkInBalance();
        assert.strictEqual(inBalance, true, 'Journal should be in balance');
    });

    it('should retrieve transactions with a filter', async () => {
        const filteredTransactions = await journal.getTransactions('FixedAssets');
        assert.strictEqual(filteredTransactions.length, 1, 'There should be one filtered transaction');
        assert.strictEqual(filteredTransactions[0].account, 'FixedAssets', 'Filtered account should be FixedAssets');
    });

    it('should remove a transaction by ID', async () => {
        await journal.recordAssetTransaction({ date: '2024-10-22', ref: 1, account: 'FixedAssets', debit: 5000, credit: 0 });
        await journal.removeTransaction(3);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 2, 'Transaction should be removed');
    });
})
