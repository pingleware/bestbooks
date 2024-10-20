const assert = require('assert');
const {CommonShares} = require('../index');

/**
 * See company's asset allocation amendments at
 * https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080&aggregateId=domp-p18000065008-35ef79fd-d447-41b9-ab4d-c0a2d1641d5a&searchTerm=presspage%20entertainment&listNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080
 */

describe("CommonShares Class", async function(){
    let equity;

    before(function(){
        equity = new CommonShares();
    })
    
    after(async function(){
        await equity.model.insertSync(`DELETE FROM accounts;`);
        await equity.model.insertSync(`DELETE FROM ledger;`);
        await equity.model.insertSync(`DELETE FROM journal`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await equity.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    

    it("should create an instance of CommonShares", async function(){
        assert.ok(equity instanceof CommonShares);
    })
    
    it("should initialize the common equity balance of 200 billion per Amendement 2", async function(){
        const [ledger_id,journal_id] = await equity.increase("2022-02-28","Allocated common shares per Amendment 2",200000000000);
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Allocated common shares per Amendment 2");
        const balance = await equity.getBalance();
        assert.equal(balance,200000000000);
    })

    it("should reduce the common equity balance to 100 billion per amendment 3", async function(){
        let balance = await equity.getBalance();
        const [ledger_id,journal_id] = await equity.decrease("2022-04-11","Reduce per Amendment 3",Number(balance)-100000000000);
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Reduce per Amendment 3");
        balance = await equity.getBalance();
        assert.equal(balance,100000000000);
    })
    it("should increase the common equity balance to 500 billion per amendment 4", async function(){
        let balance = await equity.getBalance();
        const [ledger_id,journal_id] = await equity.increase("2022-11-01","Increase per Amendment 4",500000000000-Number(balance));
        const result = await equity.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Increase per Amendment 4");
        balance = await equity.getBalance();
        assert.equal(balance,500000000000);
    })
})
