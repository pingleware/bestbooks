const assert = require('assert');
const {DebtShares} = require('../index');

/**
 * See company's asset allocation amendments at
 * https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080&aggregateId=domp-p18000065008-35ef79fd-d447-41b9-ab4d-c0a2d1641d5a&searchTerm=presspage%20entertainment&listNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080
 */

describe("DebtShares Class", async function(){
    let equity;

    before(function(){
        equity = new DebtShares();
    })
    
    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of DebtShares", async function(){
        assert.ok(equity instanceof DebtShares);
    })
    
    it("should initialize the debt equity balance of 50 million per Amendement 3", async function(){
        const [ledger_id,journal_id] = await equity.increase("2022-04-11","Allocated debt shares per Amendment 3",50000000);
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Allocated debt shares per Amendment 3");
        const balance = await equity.getBalance();
        assert.equal(balance,50000000);
    })

    it("should increase the debt equity balance to 250 billion per amendment 4", async function(){
        let balance = await equity.getBalance();
        const [ledger_id,journal_id] = await equity.increase("2022-11-01","Increase per Amendment 4",250000000000-Number(balance));
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Increase per Amendment 4");
        balance = await equity.getBalance();
        assert.equal(balance,250000000000);
    })

    it('should initialize with the correct account name and group', function() {
        assert.strictEqual(equity.getName(), 'DebtShares');
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should borrow (credit) and update balance', async function() {
        await equity.borrow('2024-10-21', 'Borrow funds', 10000);
        const creditAmount = equity.getCredit();
        const balance = await equity.getBalance();

        assert.strictEqual(creditAmount, 10000);
        assert.strictEqual(balance, 250000010000); 
    });

    it('should repay (debit) and update balance', async function() {
        await equity.borrow('2024-10-21', 'Borrow funds', 15000);
        await equity.repay('2024-10-22', 'Repay part of the debt', 5000);

        const debitAmount = equity.getDebit();
        const balance = await equity.getBalance();

        assert.strictEqual(debitAmount, 5000);
        assert.strictEqual(balance, 250000020000); 
    });

    it('should correctly adjust balance with multiple borrows and repayments', async function() {
        await equity.borrow('2024-10-21', 'Borrow funds', 20000);
        await equity.repay('2024-10-22', 'Repay debt', 8000);
        await equity.borrow('2024-10-23', 'Borrow more funds', 5000);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 250000037000); 
    });

    it('should return the correct base account type', function() {
        assert.strictEqual(equity.getAccountBaseType(), "Equity");
    });
})
