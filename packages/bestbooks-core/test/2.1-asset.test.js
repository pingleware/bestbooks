const assert = require('assert');
const Asset = require('../src/asset'); // Adjust the path as necessary
const Journal = require('../src/journal');

describe('Asset Class', function () {
    let asset, journal;

    beforeEach(async function () {
        // Create a new Asset instance before each test
        asset = new Asset('Cash');
        journal = new Journal("General");
    });
    
    after(async function(){
        await asset.model.insertSync(`DELETE FROM accounts;`);
        await asset.model.insertSync(`DELETE FROM ledger;`);
        await asset.model.insertSync(`DELETE FROM ledger_audit;`);
        await asset.model.insertSync(`DELETE FROM journal;`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
        await asset.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
    })
    

    it("should create an instance of Asset", async function(){
        assert.ok(asset instanceof Asset);
    })

    it('should add a debit and return the correct ledger ID', async function () {
        const [ledgerId, journalId] = await asset.addDebit('2024-01-01', 'Initial Deposit', 500);
        assert.ok(ledgerId, 'Ledger ID should be returned');
        assert.ok(journalId, 'Journal ID should be returned');
    });

    it('should add a credit and return the correct ledger ID', async function () {
        const [ledgerId, journalId] = await asset.addCredit('2024-01-02', 'Withdrawal', 200);
        assert.ok(ledgerId, 'Ledger ID should be returned');
        assert.ok(journalId, 'Journal ID should be returned');
    });

    it('should retrieve the balance', async function () {
        const balance = await asset.getBalance();
        assert.strictEqual(balance, 300, 'Balance should be 300 after debit and credit');
    });

    it('should increase balance correctly', async function () {
        await asset.increase('2024-01-01', 'Deposit Three', 500);
        assert.strictEqual(await asset.getBalance(), 800, 'Balance should be 800 after debit');
    });

    it('should decrease balance correctly', async function () {
        await asset.decrease('2024-01-02', 'Withdrawal', 200);
        assert.strictEqual(await asset.getBalance(), 600, 'Balance should be 600 after credit');
    });

    it("should retrieve the audit log",async() => {
        const rows = await asset.model.querySync(`SELECT l.txdate, l.account_code, l.account_name, l.debit, l.credit, l.balance, 
                a.old_account_code, a.old_debit, a.old_credit, a.old_balance, 
                a.new_account_code, a.new_debit, a.new_credit, a.new_balance, 
                a.change_date, a.changed_by, a.action
            FROM ledger_audit a
            JOIN ledger l ON a.ledger_id = l.id
            ORDER BY a.change_date DESC;`);

        const expected = [
            {
                txdate: '2024-01-01',
                account_code: '100',
                account_name: 'Cash',
                debit: 500,
                credit: 0,
                balance: 500,
                old_account_code: '100',
                old_debit: 500,
                old_credit: 0,
                old_balance: 500,
                new_account_code: '100',
                new_debit: 500,
                new_credit: 0,
                new_balance: 500,
                change_date: rows[0].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-01-02',
                account_code: '100',
                account_name: 'Cash',
                debit: 0,
                credit: 200,
                balance: 300,
                old_account_code: '100',
                old_debit: 0,
                old_credit: 200,
                old_balance: 300,
                new_account_code: '100',
                new_debit: 0,
                new_credit: 200,
                new_balance: 300,
                change_date: rows[1].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-01-01',
                account_code: '100',
                account_name: 'Cash',
                debit: 500,
                credit: 0,
                balance: 800,
                old_account_code: '100',
                old_debit: 500,
                old_credit: 0,
                old_balance: 800,
                new_account_code: '100',
                new_debit: 500,
                new_credit: 0,
                new_balance: 800,
                change_date: rows[2].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2024-01-02',
                account_code: '100',
                account_name: 'Cash',
                debit: 0,
                credit: 200,
                balance: 600,
                old_account_code: '100',
                old_debit: 0,
                old_credit: 200,
                old_balance: 600,
                new_account_code: '100',
                new_debit: 0,
                new_credit: 200,
                new_balance: 600,
                change_date: rows[3].change_date,
                changed_by: 0,
                action: 'Update'
            }
        ];
        assert.deepStrictEqual(rows, expected);
    });
});