const assert = require('assert');
const {SalesJournal} = require('../index');

describe("SalesJournal Class", async function(){
    let journal;

    before(function(){
        journal = new SalesJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of SalesJournal", async function(){
        assert.ok(journal instanceof SalesJournal);
    })

    it('should record a sales transaction', async () => {
        const record = {
            date: '2024-10-22',
            ref: 'SALE-001',
            account: 'Revenue',
            debit: 0.00,
            credit: 1000.00,
            company_id: 1,
            office_id: 1
        };

        await journal.recordSale(record);

        // Check if the transaction was recorded
        const transactions = await journal.getTransactions();
        const recordedTransaction = transactions.find(trx => trx.ref === 'SALE-001');

        assert.ok(recordedTransaction, 'Transaction should be recorded');
        assert.strictEqual(recordedTransaction.debit, 0.00, 'Debit amount should match');
        assert.strictEqual(recordedTransaction.credit, 1000.00, 'Credit amount should match');
    });

    it('should calculate the balance of the sales journal', async () => {
        const balance = await journal.getJournalBalance();

        assert.strictEqual(typeof balance, 'number', 'Balance should be a number');
        assert(balance >= 0, 'Balance should be non-negative');
    });

    it('should retrieve all transactions', async () => {
        const transactions = await journal.getTransactions();
        assert(Array.isArray(transactions), 'Transactions should be an array');
    });

    it('should retrieve filtered transactions based on account', async () => {
        const transactions = await journal.getTransactions('Revenue');
        assert(Array.isArray(transactions), 'Filtered transactions should be an array');
        assert(transactions.every(trx => trx.account === 'Revenue'), 'All transactions should be for the Revenue account');
    });

    it('should verify if the journal is in balance', async () => {
        const isBalanced = await journal.checkInBalance();
        assert.strictEqual(typeof isBalanced, 'boolean', 'In-balance check should return a boolean');
    });

    it('should update an existing sale transaction', async () => {
        const updatedRecord = {
            date: '2024-10-22',
            account: 'Consulting Services',
            debit: 0.00,
            credit: 1500.00,
            ref: 'SALE-002'
        };

        await journal.updateTransaction(1, updatedRecord); // Assuming transaction ID 1 exists

        const updatedTransaction = (await journal.getTransactions()).find(trx => trx.ref === 'SALE-002');

        assert.ok(updatedTransaction, 'Transaction should be updated');
        assert.strictEqual(updatedTransaction.account, 'Consulting Services', 'Updated account should match');
        assert.strictEqual(updatedTransaction.credit, 1500.00, 'Updated credit amount should match');
    });

    it('should remove a sales transaction by ID', async () => {
        const transactionsBefore = await journal.getTransactions();
        await journal.removeTransaction(1); // Assuming transaction ID 1 exists

        const transactionsAfter = await journal.getTransactions();
        assert.strictEqual(transactionsAfter.length, transactionsBefore.length - 1, 'Transaction should be removed');
    });
})
