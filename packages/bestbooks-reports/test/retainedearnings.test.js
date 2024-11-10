const assert = require('assert'); 
const { 
    init, 
    RetainedEarningsReport, 
} = require("../index");
const {
    RetainedEarnings,
    Equity,
    Revenue,
    Expense,
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create formatted Retained Earnings Report',function(){
    let report, retainedEarnings, commonStock, revenue, expense, data, formattedData, xml;

    before(function(done){
        report = new RetainedEarningsReport();
        retainedEarnings = new RetainedEarnings();
        commonStock = new Equity("Common Stock");
        revenue = new Revenue("Revenue");
        expense = new Expense("Expense");
        init();
        done();
    })

    beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
    });

    after(async() => {
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of RetainedEarningsReport", async function(){
        assert.ok(report instanceof RetainedEarningsReport);
    }) 

    it('should add opening balance entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-01","Opening Balance",1000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add owner contributions entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-02","Owner Contribution",200);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add dividends entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addDebit("2024-10-03","Dividends",300);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should add other adjustment entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit("2024-10-04","Other Adjustment",100);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    })

    it('should add revenue credit entry',async() => {
        const [ledger_id,journal_id] = await revenue.addCredit("2024-10-05","Revenue",500);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    })

    it('should add expense debit entry',async() => {
        const [ledger_id,journal_id] = await expense.addDebit("2024-10-05","Expense",100);
        assert.equal(ledger_id,6);
        assert.equal(journal_id,6);
    })

    it('should add common stock entry for owner contributions',async() => {
        const [ledger_id,journal_id] = await commonStock.addDebit("2024-10-02","Owner Contribution",200);
        assert.equal(ledger_id,7);
        assert.equal(journal_id,7);
    })

    it('should return the retained earnings',async function(){
        data = await report.retrieveReportDataSync(); 
        //assert.equal(rows.length,2);
        console.log(data)
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 505 - Equity.`;

        formattedData = await report.formatArray(data,notes);
        //const expected = `{"date":"${new Date().toDateString()}","lineItems":{"assets":[{"code":"100","name":"Cash","balance":"1000.00","type":"Asset"}],"liabilities":[{"code":"200","name":"COGS","balance":"350.00","type":"Liability"}],"expenses":[],"income":[],"equity":[]},"totalAsset":"1000.00","totalLiability":"350.00","totalIncome":"0.00","totalExpense":"0.00","totalEquity":"0.00","totalLiabilitiesShareholdersEquity":"350.00","notes":"In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 210, Balance Sheet."}`;
        //assert.strictEqual(JSON.stringify(formattedData).trim(),expected.trim())
        console.log(formattedData)
    })

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
    });

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("retainedEarnings",xml,"xml");
        assert.strictEqual(path.basename(filePath),"retainedEarnings.xml");
    })

    it("should format the retained earnings report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("retainedEarnings",html,"html");
        assert.strictEqual(path.basename(filePath),"retainedEarnings.html");
    })
})