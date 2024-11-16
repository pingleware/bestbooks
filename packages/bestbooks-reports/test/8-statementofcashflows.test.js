const assert = require('assert');
const { 
    init, 
    StatementCashFlows, 
} = require("../index");
const {
    Asset,
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const path = require('path');
const os = require('os');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Statement of Cash Flows Report',function(){
    let report, investment, operatingAccount, data, starting_balance, formattedData, xml, html, date, dateString;

    before(function(){
        date = new Date().toISOString().split("T")[0];
        dateString = new Date().toDateString();
        report = new StatementCashFlows();
        investment = new Asset("Investments","Non-Current Asset","Asset");
        operatingAccount = new Asset("Operating Account","Current Asset","Asset");
        init();
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

    it("should create an instance of StatementCashFlows", async function(){
        assert.ok(report instanceof StatementCashFlows);
    }) 

    it('should add the investment debit entry',async() => {
        const [ledger_id,journal_id] = await investment.addDebit(date,"Investments",1000,0,0,0,"Investing")
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add the investment credit entry',async() => {
        const [ledger_id,journal_id] = await investment.addCredit(date,"Investments",500,0,0,0,"Investing")
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add the operating account debit entry',async() => {
        const [ledger_id,journal_id] = await operatingAccount.addDebit(date,"Operating Account",500,0,0,0,"Financing");
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should add the operating account credit entry',async() => {
        const [ledger_id,journal_id] = await operatingAccount.addCredit(date,"Operating Account",700,0,0,0,"Financing");
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    })

    it('should return the cash flow statement',async function(){
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
              txdate: date
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
              txdate: date
            }
        ];
        data = await report.retrieveReportDataSync();
        assert.deepStrictEqual(data,expected);
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the statement of cash flows presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 230 Statement of Cash Flows.`;
        const expected = {
            date: dateString,
            starting_balance: 0,
            operating_total: 0,
            investment_total: -500,
            financing_total: 200,
            ending_balance: -300,
            notes: 'In our opinion, the statement of cash flows presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 230 Statement of Cash Flows.'
        };
        formattedData = await report.formatArray(data,notes,starting_balance);
        assert.deepStrictEqual(formattedData,expected);
    })

    it("should format array into xml",async () => {
        const expected = `<?xml version='1.0'?>
<statementCashFlows>
    <date>${dateString}</date>
    <starting_balance>0</starting_balance>
    <operating_total>0</operating_total>
    <investment_total>-500</investment_total>
    <financing_total>200</financing_total>
    <ending_balance>-300</ending_balance>
    <notes>In our opinion, the statement of cash flows presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 230 Statement of Cash Flows.</notes>
</statementCashFlows>`;
        xml = await report.formatXml(formattedData);
        assert.deepStrictEqual(xml,expected);
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("statementCashFlows",xml,"xml");
        assert.strictEqual(path.basename(filePath),"statementCashFlows.xml");
    })

    it("should format the statement of cash flows report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("statementCashFlows",html,"html");
        assert.strictEqual(path.basename(filePath),"statementCashFlows.html");
    })
})