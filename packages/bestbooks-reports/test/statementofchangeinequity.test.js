const assert = require('assert');
const { 
    init, StatementChangeInEquity, 
} = require("../index");
const {
    Equity,
    Expense,
    Revenue,
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Statement of Change in Equity Report',function(){
    let report, expense, equity, revenue, data, formattedData, xml, html;

    before(function(){
        report = new StatementChangeInEquity();
        equity = new Equity("Equity");
        expense = new Expense("Expense");
        revenue = new Revenue("Revenue");
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

    it("should create an instance of StatementChangeInEquity", async function(){
        assert.ok(report instanceof StatementChangeInEquity);
    })

    it('should add opening balance to equity',async () => {
        equity.addCredit('2023-01-01','Opening Balance',1000.0,0,0,0,'Opening Balance');
    })

    it('should add owner contribution to equity',async () => {
        equity.addCredit('2023-02-01','Owner Contribution',500.0,0,0,0,'Owner Contribution');
    })

    it('should add dividends to equity',async () => {
        equity.addDebit('2023-03-01','Dividends',200.0,0,0,0,'Dividends');
    })

    it('should add other adjustments to equity',async () => {
        equity.addCredit('2023-04-01','Other Adjustment',300.0,0,0,0,'Other Adjustment')
    })

    it('should add credit entry to revenue',async () => {
        revenue.addCredit('2023-05-01','Revenue Account',2000.0);
    })

    it('should add debit entry to expense',async () => {
        expense.addDebit('2023-06-01','Expense Account',1500.0);
    })

    it('should return the statement of changes in equity',async function(){
        const expected = [
            {
              equity_component: 'Equity',
              type: 'Equity',
              beginning_balance: 1000,
              net_income: 500,
              owner_contributions: 500,
              dividends: 200,
              other_adjustments: 300,
              ending_balance: 2100,
              txdate: '2023-01-01'
            }
        ];
        data = await report.retrieveEquityMovementDataSync();
        assert.deepStrictEqual(data,expected)
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the statement of change in equity report presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic.`;
        const expected = {
            equity_component: 'Equity',
            type: 'Equity',
            beginning_balance: 1000,
            net_income: 500,
            owner_contributions: 500,
            dividends: 200,
            other_adjustments: 300,
            ending_balance: 2100,
            txdate: '2023-01-01',
            notes: 'In our opinion, the statement of change in equity report presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic.'
        };
        formattedData = await report.formatArray(data[0],notes);
        assert.deepStrictEqual(formattedData,expected)
    })

    it("should format array into xml",async () => {
        const expected = `<?xml version='1.0'?>
<statementChangeInEquity>
    <equity_component>Equity</equity_component>
    <type>Equity</type>
    <beginning_balance>1000</beginning_balance>
    <net_income>500</net_income>
    <owner_contributions>500</owner_contributions>
    <dividends>200</dividends>
    <other_adjustments>300</other_adjustments>
    <ending_balance>2100</ending_balance>
    <txdate>2023-01-01</txdate>
    <notes>In our opinion, the statement of change in equity report presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic.</notes>
</statementChangeInEquity>`;
        xml = await report.formatXml(formattedData);
        assert.deepStrictEqual(xml,expected);
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("statementChangeInEquity",xml,"xml");
        assert.strictEqual(path.basename(filePath),"statementChangeInEquity.xml");
    })

    it("should format the statement of change in equity report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("statementChangeInEquity",html,"html");
        assert.strictEqual(path.basename(filePath),"statementChangeInEquity.html");
    })
})