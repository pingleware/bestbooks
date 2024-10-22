const assert = require('assert');
const {PayrollJournal} = require('../index');

describe("PayrollJournal Class", async function(){
    let journal;

    before(function(){
        journal = new PayrollJournal();
    })

    after(async function(){
        await journal.model.insertSync(`DELETE FROM accounts;`);
        await journal.model.insertSync(`DELETE FROM ledger;`);
        await journal.model.insertSync(`DELETE FROM journal`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await journal.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of PayrollJournal", async function(){
        assert.ok(journal instanceof PayrollJournal);
    })

    it('should record a payroll transaction', async () => {
        const record = { date: '2024-10-22', ref: 1, account: 'Salaries Expense', debit: 5000, credit: 0 };
        await journal.recordPayrollTransaction(record);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 1, 'Transaction should be recorded');
        assert.strictEqual(transactions[0].account, 'Salaries Expense', 'Account should be Salaries Expense');
    });

    it('should calculate the correct balance', async () => {
        await journal.recordPayrollTransaction({ date: '2024-10-23', ref: 2, account: 'Payroll Liabilities', debit: 0, credit: 2000 });
        const balance = await journal.getJournalBalance();
        assert.strictEqual(balance, -3000, 'Balance should be -3000');
    });

    it('should update an existing payroll transaction', async () => {
        await journal.updateTransaction(2, { date: '2024-10-23', ref: 2, account: 'Payroll Liabilities', debit: 0, credit: 5000 });
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions[1].credit, 5000, 'Credit should be updated to 6000');
    });

    it('should check if the journal is in balance', async () => {
        const inBalance = await journal.checkInBalance();
        assert.strictEqual(inBalance, true, 'Journal should be in balance');
    });

    it('should retrieve transactions with a filter', async () => {
        const filteredTransactions = await journal.getTransactions('Salaries Expense');
        assert.strictEqual(filteredTransactions.length, 1, 'There should be one filtered transaction');
        assert.strictEqual(filteredTransactions[0].account, 'Salaries Expense', 'Filtered account should be Salaries Expense');
    });

    it('should remove a transaction by ID', async () => {
        await journal.recordPayrollTransaction({ date: '2024-10-22', ref: 1, account: 'Salaries Expense', debit: 5000, credit: 0 });
        await journal.removeTransaction(3);
        const transactions = await journal.getTransactions();
        assert.strictEqual(transactions.length, 2, 'Transaction should be removed');
    });
})
