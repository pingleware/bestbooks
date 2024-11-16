const assert = require('assert');
const { 
    init, 
    BalanceSheet,
} = require("../index");
const {
    Cash,
    Revenue,
    Expense,
} = require('@pingleware/bestbooks-core');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create formatted Balance Sheet Report", function(){
    let report, sales, expense, cash, xml, data, formattedData, html, date;

    before(async() => {
        date = new Date().toDateString();
        report = new BalanceSheet();
        cash = new Cash("Cash");
        sales = new Revenue("Sales");
        expense = new Expense("COGS");
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

    it("should create an instance of BalanceSheet", async function(){
        assert.ok(report instanceof BalanceSheet);
    }) 

    it("should add debit cash entry",async function(){
        const [ledger_id,journal_id] = await cash.addDebit("2024-01-01","Deposit",1000,0,0,3);
        assert.strictEqual(ledger_id,1);
        assert.strictEqual(journal_id,1);
    })

    it("should add first debit sales entry",async() => {
        const [ledger_id,journal_id] = await sales.addDebit("2024-01-01","Sales",500,0,0,3);
        assert.strictEqual(ledger_id,2);
        assert.strictEqual(journal_id,2);
    })

    it("should add second debit sales entry",async() => {
        const [ledger_id,journal_id] = await sales.addDebit("2024-02-01","Sales",300,0,0,3);
        assert.strictEqual(ledger_id,3);
        assert.strictEqual(journal_id,3);
    })

    it("should add first credit expense entry",async() => {
        const [ledger_id,journal_id] = await expense.addCredit("2024-01-15","Expenses",200,0,0,3);
        assert.strictEqual(ledger_id,4);
        assert.strictEqual(journal_id,4);
    });

    it("should add second credit expense entry",async() => {
        const [ledger_id,journal_id] = await expense.addCredit("2024-02-10","Expenses",150,0,0,3);
        assert.strictEqual(ledger_id,5);
        assert.strictEqual(journal_id,5);
    });

    it("should get balance sheet data",async() => {
        data = await report.retrieveReportDataSync();
        const expected = [
            {
              code: '100',
              name: 'Cash',
              type: 'Asset',
              debit: 1000,
              credit: 0,
              balance: 1000,
              txdate: '2024-01-01'
            }
        ];
        assert.deepStrictEqual(data,expected);
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 210, Balance Sheet.`;

        formattedData = await report.formatArray(data,notes);
    })

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
        const expected = `<?xml version='1.0'?>
<balanceSheet>
    <date>${date}</date>
    <lineItems>
        <assets>
            <code>100</code>
            <name>Cash</name>
            <balance>1000.00</balance>
            <type>Asset</type>
        </assets>
    </lineItems>
    <totalAsset>1000.00</totalAsset>
    <totalLiability>0.00</totalLiability>
    <totalIncome>0.00</totalIncome>
    <totalExpense>0.00</totalExpense>
    <totalEquity>0.00</totalEquity>
    <totalLiabilitiesShareholdersEquity>0.00</totalLiabilitiesShareholdersEquity>
    <notes>In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 210, Balance Sheet.</notes>
</balanceSheet>`;
        assert.strictEqual(xml.trim(),expected.trim());
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("balanceSheet",xml,"xml");
        assert.strictEqual(path.basename(filePath),"balanceSheet.xml");
    })

    it("should format the balance sheet report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("balanceSheet",html,"html");
        assert.strictEqual(path.basename(filePath),"balanceSheet.html");
    })
})