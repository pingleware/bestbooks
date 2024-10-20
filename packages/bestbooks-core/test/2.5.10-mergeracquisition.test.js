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
})
