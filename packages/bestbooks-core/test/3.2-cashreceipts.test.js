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
        await journal.model.insertSync(`DELETE FROM ledger_audit;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of CashReceiptsJournal", async function(){
        assert.ok(journal instanceof CashReceiptsJournal);
    })

    it('should record a cash receipt', async () => {
        const record = { date: '2024-10-22', ref: 1, account: 'Sales', debit: 0, credit: 100 };
        await journal.recordReceipt(record);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 1, 'Transaction should be recorded');
        assert.strictEqual(transactions[0].account, 'Sales', 'Account should be Sales');
    });

    it('should calculate the correct balance', async () => {
        await journal.recordReceipt({ date: '2024-10-22', ref: 2, account: 'Cash', debit: 50, credit: 0 });
        const balance = await journal.getJournalBalance();
        assert.strictEqual(balance, 50, 'Balance should be 50');
    });

    it('should update an existing transaction', async () => {
        await journal.updateTransaction(2, { date: '2024-10-23', account: 'Cash', debit: 100, credit: 0, ref: 2 });
        const transactions = await journal.getTransactions("Cash");
        assert.strictEqual(transactions[0].debit, 100, 'Debit should be updated to 100');
    });

    it('should check if the journal is in balance', async () => {
        const inBalance = await journal.checkInBalance();
        assert.strictEqual(inBalance, true, 'Journal should be in balance');
    });

    it('should retrieve transactions with a filter', async () => {
        const filteredTransactions = await journal.getTransactions('Sales');
        assert.strictEqual(filteredTransactions.length, 1, 'There should be one filtered transaction');
        assert.strictEqual(filteredTransactions[0].account, 'Sales', 'Filtered account should be Sales');
    });


    it('should remove a transaction by ID', async () => {
        await journal.recordReceipt({ date: '2024-10-22', ref: 1, account: 'Sales', debit: 0, credit: 100 });
        await journal.removeTransaction(3);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 2, 'Transaction should be removed');
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
