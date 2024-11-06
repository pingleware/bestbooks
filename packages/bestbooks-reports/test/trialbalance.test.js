const assert = require('assert');
const { 
    TrialBalance, 
} = require("../index");
const {
    Cash,
    Revenue,
    Expense,
} = require("@pingleware/bestbooks-core");

const path = require('path');
const os = require('os');
const fs = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


describe("Create formatted Trial Balance Report", function(){
    let report, cash, expense, revenue, data, formattedData, xml, html;

    before(function(){
        report = new TrialBalance();
        cash = new Cash('Cash');
        revenue = new Revenue('Sales');
        expense = new Expense('COGS');
    });

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

    it("should create an instance of TrialBalance", async function(){
        assert.ok(report instanceof TrialBalance);
    }) 

    it('should add a cash opening deposit entry',async () => {
        const [ledger_id,journal_id] = await cash.increase("2024-01-01", "Opening Deposit", 1000.0);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add a revenue credit entry',async () => {
        const [ledger_id,journal_id] = await revenue.addCredit("2024-01-01", "Sales", 500.0);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add an expense credit entry', async() => {
        const [ledger_id,journal_id] = await expense.addCredit("2024-01-01", "COGS", 500.0);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should get trial balance data', async function() {    
        data = await report.retrieveReportDataSync();
        const expected = [
            {
                code: 100,
                name: 'Cash',
                type: 'Asset',
                base_type: 'Asset',
                total_debit: 1000,
                total_credit: 0,
                txdate: '2024-01-01'
            },
            {
                code: 200,
                name: 'COGS',
                type: 'Expense',
                base_type: 'Liability',
                total_debit: 0,
                total_credit: 500,
                txdate: '2024-01-01'
            },
            {
                code: 500,
                name: 'Sales',
                type: 'Revenue',
                base_type: 'Revenue',
                total_debit: 0,
                total_credit: 500,
                txdate: '2024-01-01'
            }
        ];
        assert.deepStrictEqual(data,expected);
    });  

    it("should format data into array",async() => {
        const notes = `In our opinion, the trial balance presents fairly, in all material respects, the financial position as of the date specified.`;

        formattedData = await report.formatArray(data,notes);
        const expected = `{"date":"Tue Nov 05 2024","lineItems":[{"code":100,"name":"Cash","debit":"1000.00","credit":"0.00"},{"code":200,"name":"COGS","debit":"0.00","credit":"500.00"},{"code":500,"name":"Sales","debit":"0.00","credit":"500.00"}],"total":{"debit":"1000.00","credit":"1000.00"}}`;
        assert.strictEqual(JSON.stringify(formattedData).trim(),expected.trim())
    })

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
        const expected = `<?xml version='1.0'?>
<trialBalance>
    <date>${new Date().toDateString()}</date>
    <lineItems>
        <code>100</code>
        <name>Cash</name>
        <debit>1000.00</debit>
        <credit>0.00</credit>
    </lineItems>
    <lineItems>
        <code>200</code>
        <name>COGS</name>
        <debit>0.00</debit>
        <credit>500.00</credit>
    </lineItems>
    <lineItems>
        <code>500</code>
        <name>Sales</name>
        <debit>0.00</debit>
        <credit>500.00</credit>
    </lineItems>
    <total>
        <debit>1000.00</debit>
        <credit>1000.00</credit>
    </total>
</trialBalance>`;
        assert.strictEqual(xml.trim(),expected.trim());
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("trialBalance",xml,"xml");
        assert.strictEqual(path.basename(filePath),"trialBalance.xml");
    })

    it("should format the inome statement report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("trialBalance",html,"html");
        assert.strictEqual(path.basename(filePath),"trialBalance.html");
    })
})