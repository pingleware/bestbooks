const assert = require('assert');
const {PurchasesJournal} = require('../index');

describe("PurchasesJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PurchasesJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of PurchasesJournal", async function(){
        assert.ok(journal instanceof PurchasesJournal);
    })

    it('should record a purchase transaction', async () => {
        const record = {
            date: '2024-10-22',
            ref: 'PUR-001',
            account: 'Supplies',
            debit: 200.00,
            credit: 0.00,
            company_id: 1,
            office_id: 1
        };

        await journal.recordPurchase(record);

        // Check if the transaction was recorded
        const transactions = await journal.getTransactions();
        const recordedTransaction = transactions.find(trx => trx.ref === 'PUR-001');

        assert.ok(recordedTransaction, 'Transaction should be recorded');
        assert.strictEqual(recordedTransaction.debit, 200.00, 'Debit amount should match');
        assert.strictEqual(recordedTransaction.credit, 0.00, 'Credit amount should match');
    });

    it('should calculate the balance of the purchases journal', async () => {
        const balance = await journal.getJournalBalance();
        
        assert.strictEqual(typeof balance, 'number', 'Balance should be a number');
        assert(balance < 0, 'Balance should be negative');
    });

    it('should retrieve all transactions', async () => {
        const transactions = await journal.getTransactions();
        assert(Array.isArray(transactions), 'Transactions should be an array');
    });

    it('should retrieve filtered transactions based on account', async () => {
        const transactions = await journal.getTransactions('Supplies');
        assert(Array.isArray(transactions), 'Filtered transactions should be an array');
        assert(transactions.every(trx => trx.account === 'Supplies'), 'All transactions should be for the Supplies account');
    });

    it('should verify if the journal is in balance', async () => {
        const isBalanced = await journal.checkInBalance();
        assert.strictEqual(typeof isBalanced, 'boolean', 'In-balance check should return a boolean');
    });

    it('should update an existing purchase transaction', async () => {
        const record = {
            date: '2024-10-22',
            account: 'Equipment',
            debit: 300.00,
            credit: 0.00,
            ref: 'PUR-002'
        };

        await journal.updateTransaction(1, record); // Assume transaction ID 1 exists

        const updatedTransaction = (await journal.getTransactions()).find(trx => trx.ref === 'PUR-002');

        assert.ok(updatedTransaction, 'Transaction should be updated');
        assert.strictEqual(updatedTransaction.account, 'Equipment', 'Updated account should match');
        assert.strictEqual(updatedTransaction.debit, 300.00, 'Updated debit amount should match');
    });

    it('should remove a purchase transaction by ID', async () => {
        const transactionsBefore = await journal.getTransactions();
        await journal.removeTransaction(1); // Assume transaction ID 1 exists

        const transactionsAfter = await journal.getTransactions();
        assert.strictEqual(transactionsAfter.length, transactionsBefore.length - 1, 'Transaction should be removed');
    });
})
