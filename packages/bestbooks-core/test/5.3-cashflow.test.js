const assert = require('assert');
const {
    Report,
    Asset,
} = require('../index');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Cash Flow Statement View',async function(){
    let report, investment, operatingAccount, rows;

    async function createInvestmentAccount() {
        investment = new Asset("Investments","Non-Current Asset","Asset");
    }

    async function createOperatingAccount() {
        operatingAccount = new Asset("Operating Account","Current Asset","Asset");
    }

    before(async() => {
        report = new Report();
        await createInvestmentAccount();
        await createOperatingAccount();
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

    it('should add the investment debit entry',async() => {
        const [ledger_id,journal_id] = await investment.addDebit("2024-10-01","Investments",1000,0,0,0,"Investing")
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add the investment credit entry',async() => {
        const [ledger_id,journal_id] = await investment.addCredit("2024-10-01","Investments",500,0,0,0,"Investing")
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add the operating account debit entry',async() => {
        const [ledger_id,journal_id] = await operatingAccount.addDebit("2024-10-03","Operating Account",500,0,0,0,"Financing");
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should add the operating account credit entry',async() => {
        const [ledger_id,journal_id] = await operatingAccount.addCredit("2024-10-04","Operating Account",700,0,0,0,"Financing");
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    })

    it('should return the contents of the ledger',async function(){
        const expected = [
            {
              id: 1,
              company_id: 0,
              office_id: 0,
              account_code: '100',
              account_name: 'Investments',
              txdate: '2024-10-01',
              note: 'Investments',
              ref: 1,
              debit: 1000,
              credit: 0,
              balance: 1000,
              action: 'Record',
              performed_by: 0,
              location: 0,
              due_date: 0,
              transaction_type: 'Investing'
            },
            {
              id: 2,
              company_id: 0,
              office_id: 0,
              account_code: '100',
              account_name: 'Investments',
              txdate: '2024-10-01',
              note: 'Investments',
              ref: 2,
              debit: 0,
              credit: 500,
              balance: 500,
              action: 'Record',
              performed_by: 0,
              location: 0,
              due_date: 0,
              transaction_type: 'Investing'
            },
            {
              id: 3,
              company_id: 0,
              office_id: 0,
              account_code: '101',
              account_name: 'Operating Account',
              txdate: '2024-10-03',
              note: 'Operating Account',
              ref: 3,
              debit: 500,
              credit: 0,
              balance: 500,
              action: 'Record',
              performed_by: 0,
              location: 0,
              due_date: 0,
              transaction_type: 'Financing'
            },
            {
              id: 4,
              company_id: 0,
              office_id: 0,
              account_code: '101',
              account_name: 'Operating Account',
              txdate: '2024-10-04',
              note: 'Operating Account',
              ref: 4,
              debit: 0,
              credit: 700,
              balance: -200,
              action: 'Record',
              performed_by: 0,
              location: 0,
              due_date: 0,
              transaction_type: 'Financing'
            }
        ];
        const ledger = await report.model.querySync(`SELECT * FROM ledger;`);
        //assert.deepStrictEqual(ledger,expected);
    })

    it('should return the cash flow statement',async function(){
        rows = await report.cashFlowStatementSync();
        assert.equal(rows.length,2);
    })

    it('should verify the cash flow statement',async() => {
        const expected = [
            {
              transaction_type: 'Financing',
              code: '101',
              name: 'Operating Account',
              type: 'Current Asset',
              base_type: 'Asset',
              debit: 500,
              credit: 700,
              net_cash_flow: 200,
              txdate: '2024-10-03'
            },
            {
              transaction_type: 'Investing', 
              code: '100',
              name: 'Investments',
              type: 'Non-Current Asset',
              base_type: 'Asset',
              debit: 1000,
              credit: 500,
              net_cash_flow: -500,
              txdate: '2024-10-01'
            }
        ];

        assert.deepStrictEqual(rows,expected);
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
                    txdate: '2024-10-04',
                    account_code: '101',
                    account_name: 'Operating Account',
                    debit: 0,
                    credit: 700,
                    balance: -200,
                    old_account_code: '101',
                    old_debit: 0,
                    old_credit: 700,
                    old_balance: -200,
                    new_account_code: '101',
                    new_debit: 0,
                    new_credit: 700,
                    new_balance: -200,
                    change_date: rows[0].change_date,
                    changed_by: 0,
                    action: 'Update'
                },
                {
                    txdate: '2024-10-03',
                    account_code: '101',
                    account_name: 'Operating Account',
                    debit: 500,
                    credit: 0,
                    balance: 500,
                    old_account_code: '101',
                    old_debit: 500,
                    old_credit: 0,
                    old_balance: 500,
                    new_account_code: '101',
                    new_debit: 500,
                    new_credit: 0,
                    new_balance: 500,
                    change_date: rows[1].change_date,
                    changed_by: 0,
                    action: 'Update'
                },
                {
                    txdate: '2024-10-01',
                    account_code: '100',
                    account_name: 'Investments',
                    debit: 0,
                    credit: 500,
                    balance: 500,
                    old_account_code: '100',
                    old_debit: 0,
                    old_credit: 500,
                    old_balance: 500,
                    new_account_code: '100',
                    new_debit: 0,
                    new_credit: 500,
                    new_balance: 500,
                    change_date: rows[2].change_date,
                    changed_by: 0,
                    action: 'Update'
                },
                {
                    txdate: '2024-10-01',
                    account_code: '100',
                    account_name: 'Investments',
                    debit: 1000,
                    credit: 0,
                    balance: 1000,
                    old_account_code: '100',
                    old_debit: 1000,
                    old_credit: 0,
                    old_balance: 1000,
                    new_account_code: '100',
                    new_debit: 1000,
                    new_credit: 0,
                    new_balance: 1000,
                    change_date: rows[3].change_date,
                    changed_by: 0,
                    action: 'Update'
                }
            ];
            //assert.deepStrictEqual(rows,expected);
        });
});