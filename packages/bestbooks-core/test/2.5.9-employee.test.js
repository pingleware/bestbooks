const assert = require('assert');
const {EmployeeShares} = require('../lib/index');

/**
 * See company's asset allocation amendments at
 * https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080&aggregateId=domp-p18000065008-35ef79fd-d447-41b9-ab4d-c0a2d1641d5a&searchTerm=presspage%20entertainment&listNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080
 */

describe("EmployeeShares Class", async function(){
    let equity;

    before(function(){
        equity = new EmployeeShares();
    })
    
    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of EmployeeShares", async function(){
        assert.ok(equity instanceof EmployeeShares);
    })
    
    it("should initialize the employee equity balance of 50 million per Amendement 3", async function(){
        const [ledger_id,journal_id] = await equity.increase("2022-04-11","Allocated debt shares per Amendment 3",100000000);
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Allocated debt shares per Amendment 3");
        const balance = await equity.getBalance();
        assert.equal(balance,100000000);
    })

    it("should increase the employee equity balance to 250 billion per amendment 4", async function(){
        let balance = await equity.getBalance();
        const [ledger_id,journal_id] = await equity.increase("2022-11-01","Increase per Amendment 4",250000000000-Number(balance));
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Increase per Amendment 4");
        balance = await equity.getBalance();
        assert.equal(balance,250000000000);
    })

    it('should initialize with the correct account name and group', function() {
        assert.strictEqual(equity.getName(), 'EmployeeShares');
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should issue shares (credit) and update balance', async function() {
        await equity.issueShares('2024-10-21', 'Issue shares to employee', 5000);
        const creditAmount = await equity.getCredit();
        const balance = await equity.getBalance();

        assert.strictEqual(creditAmount, 5000);
        assert.strictEqual(balance, 250000005000); 
    });

    it('should redeem shares (debit) and update balance', async function() {
        await equity.issueShares('2024-10-21', 'Issue shares to employee', 10000);
        await equity.redeemShares('2024-10-22', 'Redeem shares from employee', 3000);

        const debitAmount = await equity.getDebit();
        const balance = await equity.getBalance();

        assert.strictEqual(debitAmount, 3000);
        assert.strictEqual(balance, 250000012000); 
    });

    it('should correctly adjust balance with multiple issues and redemptions', async function() {
        await equity.issueShares('2024-10-21', 'Issue shares to employee', 15000);
        await equity.redeemShares('2024-10-22', 'Redeem shares from employee', 5000);
        await equity.issueShares('2024-10-23', 'Issue additional shares', 2000);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 250000024000); 
    });

    it('should return the correct base account type',async function() {
        assert.strictEqual(await equity.getAccountBaseType(), "Equity");
    });
})
