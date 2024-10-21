const assert = require('assert');
const {PreferredShares} = require('../index');

/**
 * See company's asset allocation amendments at
 * https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080&aggregateId=domp-p18000065008-35ef79fd-d447-41b9-ab4d-c0a2d1641d5a&searchTerm=presspage%20entertainment&listNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080
 */

describe("PreferredShares Class", async function(){
    let equity;

    before(function(){
        equity = new PreferredShares();
    })
    
    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of PreferredShares", async function(){
        assert.ok(equity instanceof PreferredShares);
    })
    
    it("should initialize the preferred equity balance of 100 billion per Amendement 1", async function(){
        const [ledger_id,journal_id] = await equity.increase("2021-12-13","Allocated Preferred shares per Amendment 1",100000000000);
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Allocated Preferred shares per Amendment 1");
        const balance = await equity.getBalance();
        assert.equal(balance,100000000000);
    })

    it("should increase the preferred equity balance to 500 billion per amendment 4", async function(){
        let balance = await equity.getBalance();
        const [ledger_id,journal_id] = await equity.increase("2022-11-01","Increase per Amendment 4",500000000000-Number(balance));
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Increase per Amendment 4");
        balance = await equity.getBalance();
        assert.equal(balance,500000000000);
    })

    it('should initialize with the correct account name and group', function() {
        assert.strictEqual(equity.getName(), 'PreferredShares');
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should issue shares (credit) and update balance', async function() {
        await equity.issueShares('2024-10-21', 'Issue Preferred Shares', 50000);
        const creditAmount = equity.getCredit();
        const balance = await equity.getBalance();

        assert.strictEqual(creditAmount, 50000);
        assert.strictEqual(balance, 500000050000); 
    });

    it('should issue dividends (debit) and update balance', async function() {
        await equity.issueShares('2024-10-21', 'Issue Preferred Shares', 50000);
        await equity.issueDividends('2024-10-22', 'Issue Dividends', 10000);

        const debitAmount = equity.getDebit();
        const balance = await equity.getBalance();

        assert.strictEqual(debitAmount, 10000);
        assert.strictEqual(balance, 500000090000); 
    });

    it('should correctly adjust balance with multiple share issues and dividends', async function() {
        await equity.issueShares('2024-10-21', 'First Issue of Preferred Shares', 30000);
        await equity.issueDividends('2024-10-22', 'First Dividend Payment', 5000);
        await equity.issueShares('2024-10-23', 'Second Issue of Preferred Shares', 15000);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 500000130000); 
    });

    it('should return the correct base account type',async function() {
        assert.strictEqual(await equity.getAccountBaseType(), "Equity");
    });
})
