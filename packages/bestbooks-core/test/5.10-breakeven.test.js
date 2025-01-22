const assert = require('assert');
const {
    Report,
    FixedCost,
    VariableCost,
    Revenue,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Breakeven Report View',async function(){
    let report, rent, supplies, sales, rows;

    before(async() => {
        report = new Report();
        rent = new FixedCost("Rent");
        supplies = new VariableCost("Supplies");
        sales = new Revenue("Sales");
    })

    beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
    });

    after(async() => {
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM ledger_audit;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger_audit';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Report", async function(){
        assert.ok(report instanceof Report);
    })

    it('should add a rent entry',async() => {
        const [ledger_id,journal_id] = await rent.addDebit(new Date().toISOString().split("T")[0],"Rent",1000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add a supplies entry',async() => {
        const [ledger_id,journal_id] = await supplies.addDebit(new Date().toISOString().split("T")[0],"Supplies",500);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add a sales entry',async() => {
        const [ledger_id,journal_id] = await sales.addCredit(new Date().toISOString().split("T")[0],"Sales",2000);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should return correct break-even analysis report',async function() {
        rows = await report.breakevenAnalysisReportSync();
        assert.equal(rows.length,1);
    });

    it('should verify the breakeven report',async() => {
        const expected = [
            {
                total_fixed_costs: 1000,
                total_variable_costs: 500,
                total_revenue: 2000,
                net_profit_loss: 500,
                txdate: new Date().toISOString().split("T")[0]
            }
        ];
        assert.deepStrictEqual(rows, expected);
    })

    it("should retrieve the audit log",async() => {
        const rows = await report.model.querySync(`SELECT l.txdate, l.account_code, l.account_name, l.debit, l.credit, l.balance, 
                a.old_account_code, a.old_debit, a.old_credit, a.old_balance, 
                a.new_account_code, a.new_debit, a.new_credit, a.new_balance, 
                a.change_date, a.changed_by, a.action
            FROM ledger_audit a
            JOIN ledger l ON a.ledger_id = l.id
            ORDER BY a.change_date DESC;`);
        const expected = [
            {
                txdate: '2025-01-22',
                account_code: '500',
                account_name: 'Sales',
                debit: 0,
                credit: 2000,
                balance: 2000,
                old_account_code: '500',
                old_debit: 0,
                old_credit: 2000,
                old_balance: 2000,
                new_account_code: '500',
                new_debit: 0,
                new_credit: 2000,
                new_balance: 2000,
                change_date: rows[0].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '401',
                account_name: 'Supplies',
                debit: 500,
                credit: 0,
                balance: 500,
                old_account_code: '401',
                old_debit: 500,
                old_credit: 0,
                old_balance: 500,
                new_account_code: '401',
                new_debit: 500,
                new_credit: 0,
                new_balance: 500,
                change_date: rows[1].change_date,
                changed_by: 0,
                action: 'Update'
            },
            {
                txdate: '2025-01-22',
                account_code: '400',
                account_name: 'Rent',
                debit: 1000,
                credit: 0,
                balance: 1000,
                old_account_code: '400',
                old_debit: 1000,
                old_credit: 0,
                old_balance: 1000,
                new_account_code: '400',
                new_debit: 1000,
                new_credit: 0,
                new_balance: 1000,
                change_date: rows[2].change_date,
                changed_by: 0,
                action: 'Update'
            }
        ];
        assert.deepStrictEqual(rows,expected);
    });
});