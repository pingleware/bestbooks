const assert = require('assert');
const {Treasury} = require('../index');

/**
 * See company's asset allocation amendments at
 * https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080&aggregateId=domp-p18000065008-35ef79fd-d447-41b9-ab4d-c0a2d1641d5a&searchTerm=presspage%20entertainment&listNameOrder=PRESSPAGEENTERTAINMENT%20P180000650080
 */

describe("Treasury Class", async function(){
    let treasury;

    before(function(){
        treasury = new Treasury();
    })

    after(async function(){
        await treasury.model.insertSync(`DELETE FROM accounts;`);
        await treasury.model.insertSync(`DELETE FROM ledger;`);
        await treasury.model.insertSync(`DELETE FROM journal`);
        await treasury.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await treasury.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await treasury.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of Treasury", async function(){
        assert.ok(treasury instanceof Treasury);
    })

    it("should initialize the treasury balance of 1,000,000 on formation date", async function(){
        const [ledger_id,journal_id] = await treasury.increase("2018-07-28","Opening Balance",1000000);
        const result = await treasury.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Opening Balance");
        const balance = await treasury.getBalance();
        assert.equal(balance,1000000);
    })

    it("should increase the treasury balance to 900 billion per amendment 1", async function(){
        let balance = await treasury.getBalance();
        const [ledger_id,journal_id] = await treasury.increase("2021-12-13","Increase per Amendment 1",900000000000-Number(balance));
        const result = await treasury.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Increase per Amendment 1");
        balance = await treasury.getBalance();
        assert.equal(balance,900000000000);
    })
    it("should reduce the treasury balance to 501 billion per amendment 2", async function(){
        let balance = await treasury.getBalance();
        const [ledger_id,journal_id] = await treasury.decrease("2022-02-28","Reduce per Amendment 2",Number(balance)-501000000000);
        const result = await treasury.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Reduce per Amendment 2");
        balance = await treasury.getBalance();
        assert.equal(balance,501000000000);
    })
    it("should reduce the treasury equity balance to 2.55 trillion per amendment 4", async function(){
        let balance = await treasury.getBalance();
        const [ledger_id,journal_id] = await treasury.increase("2022-11-01","Reduce per Amendment 4",2550000000000-Number(balance));
        const result = await treasury.model.querySync(`SELECT * FROM ledger WHERE id=?`,[ledger_id]);
        assert.strictEqual(result[0].note,"Reduce per Amendment 4");
        balance = await treasury.getBalance();
        assert.equal(balance,2550000000000);
    })
})
