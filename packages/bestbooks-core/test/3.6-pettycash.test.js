const assert = require('assert');
const {PettyCashJournal} = require('../index');

describe("PettyCashJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PettyCashJournal();
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

    it("should create an instance of PettyCashJournal", async function(){
        assert.ok(journal instanceof PettyCashJournal);
    })

    it('should record a petty cash transaction', async () => {
        const record = {
            date: '2024-10-20',
            ref: 'PC-001',
            account: 'Office Supplies',
            debit: 25.00,
            credit: 0.00,
            company_id: 1,
            office_id: 1
        };

        await journal.recordPettyCashTransaction(record);

        // Check if the transaction was recorded (mocking the transaction method for this test)
        const transactions = await journal.getTransactions();
        const recordedTransaction = transactions.find(trx => trx.ref === 'PC-001');

        assert.ok(recordedTransaction, 'Transaction should be recorded');
        assert.strictEqual(recordedTransaction.debit, 25.00, 'Debit amount should match');
    });

    it('should calculate the balance of the petty cash journal', async () => {
        const balance = await journal.getJournalBalance();
        
        assert.strictEqual(typeof balance, 'number', 'Balance should be a number');
        assert(balance < 0, 'Balance should be negative because no replinishment or initial depost made');
    });

    it('should retrieve all transactions', async () => {
        const transactions = await journal.getTransactions();
        assert(Array.isArray(transactions), 'Transactions should be an array');
    });

    it('should retrieve filtered transactions based on account', async () => {
        const transactions = await journal.getTransactions('Office Supplies');
        assert(Array.isArray(transactions), 'Filtered transactions should be an array');
        assert(transactions.every(trx => trx.account === 'Office Supplies'), 'All transactions should be for Office Supplies');
    });

    it('should verify if the journal is in balance', async () => {
        const isBalanced = await journal.checkInBalance();
        assert.strictEqual(typeof isBalanced, 'boolean', 'In-balance check should return a boolean');
    });

    it('should update an existing petty cash transaction', async () => {
        const record = {
            date: '2024-10-21',
            account: 'Postage',
            debit: 10.00,
            credit: 0.00,
            ref: 'PC-002'
        };

        await journal.updateTransaction(1, record); // Assume transaction ID 1 exists

        const updatedTransaction = (await journal.getTransactions()).find(trx => trx.ref === 'PC-002');

        assert.ok(updatedTransaction, 'Transaction should be updated');
        assert.strictEqual(updatedTransaction.account, 'Postage', 'Updated account should match');
    });

    it('should remove a petty cash transaction by ID', async () => {
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
