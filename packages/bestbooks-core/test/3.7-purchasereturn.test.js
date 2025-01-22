const assert = require('assert');
const {PurchaseReturnJournal} = require('../index');

describe("PurchaseReturnJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PurchaseReturnJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM ledger_audit;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of PurchaseReturnJournal", async function(){
        assert.ok(journal instanceof PurchaseReturnJournal);
    })

    it('should record a purchase return transaction', async () => {
        const record = {
            date: '2024-10-22',
            ref: 'PR-001',
            account: 'Inventory',
            debit: 0.00,
            credit: 100.00,
            company_id: 1,
            office_id: 1
        };

        await journal.recordPurchaseReturn(record);

        // Check if the transaction was recorded
        const transactions = await journal.getTransactions();
        const recordedTransaction = transactions.find(trx => trx.ref === 'PR-001');

        assert.ok(recordedTransaction, 'Transaction should be recorded');
        assert.strictEqual(recordedTransaction.credit, 100.00, 'Credit amount should match');
        assert.strictEqual(recordedTransaction.debit, 0.00, 'Debit amount should match');
    });

    it('should calculate the balance of the purchase return journal', async () => {
        const balance = await journal.getJournalBalance();
        
        assert.strictEqual(typeof balance, 'number', 'Balance should be a number');
        assert(balance >= 0, 'Balance should be non-negative');
    });

    it('should retrieve all transactions', async () => {
        const transactions = await journal.getTransactions();
        assert(Array.isArray(transactions), 'Transactions should be an array');
    });

    it('should retrieve filtered transactions based on account', async () => {
        const transactions = await journal.getTransactions('Inventory');
        assert(Array.isArray(transactions), 'Filtered transactions should be an array');
        assert(transactions.every(trx => trx.account === 'Inventory'), 'All transactions should be for the Inventory account');
    });

    it('should verify if the journal is in balance', async () => {
        const isBalanced = await journal.checkInBalance();
        assert.strictEqual(typeof isBalanced, 'boolean', 'In-balance check should return a boolean');
    });

    it('should update an existing purchase return transaction', async () => {
        const record = {
            date: '2024-10-22',
            account: 'Purchases',
            debit: 50.00,
            credit: 0.00,
            ref: 'PR-002'
        };

        await journal.updateTransaction(1, record); // Assume transaction ID 1 exists

        const updatedTransaction = (await journal.getTransactions()).find(trx => trx.ref === 'PR-002');

        assert.ok(updatedTransaction, 'Transaction should be updated');
        assert.strictEqual(updatedTransaction.account, 'Purchases', 'Updated account should match');
    });

    it('should remove a purchase return transaction by ID', async () => {
        const transactionsBefore = await journal.getTransactions();
        await journal.removeTransaction(1); // Assume transaction ID 1 exists

        const transactionsAfter = await journal.getTransactions();
        assert.strictEqual(transactionsAfter.length, transactionsBefore.length - 1, 'Transaction should be removed');
    });

    it("should retrieve the audit log",async() => {
        const rows = await journal.model.querySync(`SELECT l.txdate, l.account_code, l.account_name, l.debit, l.credit, l.balance, 
                a.old_account_code, a.old_debit, a.old_credit, a.old_balance, 
                a.new_account_code, a.new_debit, a.new_credit, a.new_balance, 
                a.change_date, a.changed_by, a.action
            FROM ledger_audit a
            JOIN ledger l ON a.ledger_id = l.id
            ORDER BY a.change_date DESC;`);

        const expected = [];
        assert.deepStrictEqual(rows, expected);
    });
})
