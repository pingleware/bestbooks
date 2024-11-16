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
    let report, retainedEarnings, commonStock, revenue, expense, data, formattedData, xml, date, dateString;

    before(function(done){
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
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
        const [ledger_id,journal_id] = await retainedEarnings.addCredit(date,"Opening Balance",1000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add owner contributions entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit(date,"Owner Contribution",200);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add dividends entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addDebit(date,"Dividends",300);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should add other adjustment entry to retained earnings',async() => {
        const [ledger_id,journal_id] = await retainedEarnings.addCredit(date,"Other Adjustment",100);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    })

    it('should add revenue credit entry',async() => {
        const [ledger_id,journal_id] = await revenue.addCredit(date,"Revenue",500);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    })

    it('should add expense debit entry',async() => {
        const [ledger_id,journal_id] = await expense.addDebit(date,"Expense",100);
        assert.equal(ledger_id,6);
        assert.equal(journal_id,6);
    })

    it('should add common stock entry for owner contributions',async() => {
        const [ledger_id,journal_id] = await commonStock.addDebit(date,"Owner Contribution",200);
        assert.equal(ledger_id,7);
        assert.equal(journal_id,7);
    })

    it('should return the retained earnings',async function(){
        const expected = [
            {
              beginning_retained_earnings: 1000,
              net_income: 400,
              dividends_paid: 0,
              ending_retained_earnings: 1400
            }
        ];
        data = await report.retrieveReportDataSync(); 
        assert.deepStrictEqual(data,expected);
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the retained earnings report presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 505 - Equity.`;
        const expected = {
            date: dateString,
            previous_retained_earnings: '1000.00',
            net_income: '400.00',
            dividends_paid: '0.00',
            retained_earnings: '1400.00',
            notes: 'In our opinion, the retained earnings report presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 505 - Equity.'
        };
        formattedData = await report.formatArray(data,notes);
        assert.deepStrictEqual(formattedData,expected);
    })

    it("should format array into xml",async () => {
        const expected = `<?xml version='1.0'?>
<retainedEarnings>
    <date>${dateString}</date>
    <previous_retained_earnings>1000.00</previous_retained_earnings>
    <net_income>400.00</net_income>
    <dividends_paid>0.00</dividends_paid>
    <retained_earnings>1400.00</retained_earnings>
    <notes>In our opinion, the retained earnings report presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 505 - Equity.</notes>
</retainedEarnings>`;
        xml = await report.formatXml(formattedData);
        assert.deepStrictEqual(xml,expected);
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