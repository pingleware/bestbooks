const assert = require('assert');
const {MergerAcquisitionShares} = require('../index');

/**
 * See company's asset allocation amendments at
 * https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080&aggregateId=domp-p18000065008-35ef79fd-d447-41b9-ab4d-c0a2d1641d5a&searchTerm=presspage%20entertainment&listNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080
 */

describe("MergerAcquisitionShares Class", async function(){
    let equity;

    before(function(){
        equity = new MergerAcquisitionShares();
    })
    
    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of MergerAcquisitionShares", async function(){
        assert.ok(equity instanceof MergerAcquisitionShares);
    })
    
    it("should initialize the merger-acqusiition equity balance of 140 million per Amendement 3", async function(){
        const [ledger_id,journal_id] = await equity.increase("2022-04-11","Allocated debt shares per Amendment 3",140000000);
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Allocated debt shares per Amendment 3");
        const balance = await equity.getBalance();
        assert.equal(balance,140000000);
    })

    it("should increase the merger-acqusiition equity balance to 700 billion per amendment 4", async function(){
        let balance = await equity.getBalance();
        const [ledger_id,journal_id] = await equity.increase("2022-11-01","Increase per Amendment 4",700000000000-Number(balance));
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Increase per Amendment 4");
        balance = await equity.getBalance();
        assert.equal(balance,700000000000);
    })

    it('should initialize with the correct account name and group', function() {
        assert.strictEqual(equity.getName(), 'MergerAcquisitionShares');
        assert.strictEqual(equity.getGroup(), 300);
    });

    it('should merge equity (credit) and update balance', async function() {
        await equity.mergeEquity('2024-10-21', 'Merger with XYZ Corp', 10000);
        const creditAmount = equity.getCredit();
        const balance = await equity.getBalance();

        assert.strictEqual(creditAmount, 10000);
        assert.strictEqual(balance, 700000010000); 
    });

    it('should acquire equity (debit) and update balance', async function() {
        await equity.mergeEquity('2024-10-21', 'Merger with XYZ Corp', 10000);
        await equity.acquireEquity('2024-10-22', 'Acquisition of ABC Corp', 4000);

        const debitAmount = equity.getDebit();
        const balance = await equity.getBalance();

        assert.strictEqual(debitAmount, 4000);
        assert.strictEqual(balance, 700000016000);
    });

    it('should correctly adjust balance with multiple mergers and acquisitions', async function() {
        await equity.mergeEquity('2024-10-21', 'Merger with XYZ Corp', 20000);
        await equity.acquireEquity('2024-10-22', 'Acquisition of ABC Corp', 5000);
        await equity.mergeEquity('2024-10-23', 'Merger with DEF Corp', 8000);

        const balance = await equity.getBalance();
        assert.strictEqual(balance, 700000039000); 
    });

    it('should return the correct base account type',async function() {
        assert.strictEqual(await equity.getAccountBaseType(), "Equity");
    });
})
