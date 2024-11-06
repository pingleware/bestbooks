const assert = require('assert');
const { 
    init, 
    IncomeStatement, 
} = require("../index");
const {
    Income,
    Expense,
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create formatted Income Statement Report',function(){
    let report, sales, expense, xml, data, geodata, formattedData, html;

    before(async() => {
        report = new IncomeStatement();
        sales = new Income("Sales");
        expense = new Expense("COGS","Expense","Expense");
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

    it("should create an instance of IncomeStatement", async function(){
        assert.ok(report instanceof IncomeStatement);
    }) 

    it("should add first debit sales entry",async function(){
        const [ledger_id,journal_id] = await sales.addDebit("2024-01-01","Sales",500,0,0,3);
        assert.strictEqual(ledger_id,1);
        assert.strictEqual(journal_id,1);
    });

    it("should add second debit sales entry",async function(){
        const [ledger_id,journal_id] = await sales.addDebit("2024-02-01","Sales",300,0,0,3);
        assert.strictEqual(ledger_id,2);
        assert.strictEqual(journal_id,2);
    });

    it("should add first credit expense entry",async function(){
        // TODO: implement company_id,office_id, and location in Expense::addCredit
        const [ledger_id,journal_id] = await expense.addCredit("2024-01-15","Expenses",200,0,0,3);
        // WORAROUND: until the above TODO is implemented
        await report.model.updateSync(`UPDATE ledger SET location=3 WHERE id=${ledger_id};`);
        assert.strictEqual(ledger_id,3);
        assert.strictEqual(journal_id,3);
    });

    it("should add second credit expense entry",async function(){
        // TODO: implement company_id,office_id, and location in Expense::addCredit
        const [ledger_id,journal_id] = await expense.addCredit("2024-02-10","Expenses",150,0,0,3);
        // WORAROUND: until the above TODO is implemented
        await report.model.updateSync(`UPDATE ledger SET location=3 WHERE id=${ledger_id};`);
        assert.strictEqual(ledger_id,4);
        assert.strictEqual(journal_id,4);
    });    

    it("should get income statement data",async() => {
        data = await report.retrieveReportDataSync();
        const expected = [
            {
              account_code: 400,
              account_name: 'COGS',
              type: 'Expense',
              total_revenue: 0,
              total_expense: 200,
              txdate: '2024-01-15'
            },
            {
              account_code: 400,
              account_name: 'COGS',
              type: 'Expense',
              total_revenue: 0,
              total_expense: 150,
              txdate: '2024-02-10'
            },
            {
              account_code: 500,
              account_name: 'Sales',
              type: 'Revenue',
              total_revenue: 500,
              total_expense: 0,
              txdate: '2024-01-01'
            },
            {
              account_code: 500,
              account_name: 'Sales',
              type: 'Revenue',
              total_revenue: 300,
              total_expense: 0,
              txdate: '2024-02-01'
            }
        ];
        assert.deepStrictEqual(data,expected);
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the income statement presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 225, Income Statement.`;

        formattedData = await report.formatArray(data,notes);
        const expected = `{"date":"${new Date().toDateString()}","lineItems":{"lineitem":[{"account_code":400,"account_name":"COGS","type":"Expense","total_revenue":0,"total_expense":200,"txdate":"2024-01-15","code":400,"name":"COGS","balance":200},{"account_code":400,"account_name":"COGS","type":"Expense","total_revenue":0,"total_expense":150,"txdate":"2024-02-10","code":400,"name":"COGS","balance":150},{"account_code":500,"account_name":"Sales","type":"Income","total_revenue":500,"total_expense":0,"txdate":"2024-01-01","code":500,"name":"Sales","balance":500},{"account_code":500,"account_name":"Sales","type":"Income","total_revenue":300,"total_expense":0,"txdate":"2024-02-01","code":500,"name":"Sales","balance":300}]},"geographies":[],"totalIncome":"800.00","totalExpense":"350.00","netIncome":"450.00","notes":"In our opinion, the income statement presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 225, Income Statement."}`;
        assert.strictEqual(JSON.stringify(formattedData).trim(),expected.trim())
    })

    it("should format array into xml",async () => {
        xml = await report.formatXml("incomeStatement",formattedData);
        const expected = `<?xml version='1.0'?>
<incomeStatement>
    <date>${new Date().toDateString()}</date>
    <lineItems>
        <lineitem>
            <account_code>400</account_code>
            <account_name>COGS</account_name>
            <type>Expense</type>
            <total_revenue>0</total_revenue>
            <total_expense>200</total_expense>
            <txdate>2024-01-15</txdate>
            <code>400</code>
            <name>COGS</name>
            <balance>200</balance>
        </lineitem>
        <lineitem>
            <account_code>400</account_code>
            <account_name>COGS</account_name>
            <type>Expense</type>
            <total_revenue>0</total_revenue>
            <total_expense>150</total_expense>
            <txdate>2024-02-10</txdate>
            <code>400</code>
            <name>COGS</name>
            <balance>150</balance>
        </lineitem>
        <lineitem>
            <account_code>500</account_code>
            <account_name>Sales</account_name>
            <type>Income</type>
            <total_revenue>500</total_revenue>
            <total_expense>0</total_expense>
            <txdate>2024-01-01</txdate>
            <code>500</code>
            <name>Sales</name>
            <balance>500</balance>
        </lineitem>
        <lineitem>
            <account_code>500</account_code>
            <account_name>Sales</account_name>
            <type>Income</type>
            <total_revenue>300</total_revenue>
            <total_expense>0</total_expense>
            <txdate>2024-02-01</txdate>
            <code>500</code>
            <name>Sales</name>
            <balance>300</balance>
        </lineitem>
    </lineItems>
    <totalIncome>800.00</totalIncome>
    <totalExpense>350.00</totalExpense>
    <netIncome>450.00</netIncome>
    <notes>In our opinion, the income statement presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 225, Income Statement.</notes>
</incomeStatement>`;
        assert.strictEqual(xml.trim(),expected.trim());
    });

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("incomeStatement",xml,"xml");
        assert.strictEqual(path.basename(filePath),"incomeStatement.xml");
    })

    it("should format the inome statement report",async() => {
        html = await report.formatHtml("incomeStatement",xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("incomeStatement",html,"html");
        assert.strictEqual(path.basename(filePath),"incomeStatement.html");
    })

    it("should get income statement data by geography",async() => {
        geodata = await report.retrieveReportDataSync("","",true);
        const expected = [
            {
              location: 'FL',
              region: 'USA',
              account_code: 400,
              account_name: 'COGS',
              type: 'Expense',
              total_revenue: 0,
              total_expense: 200,
              txdate: '2024-01-15'
            },
            {
              location: 'FL',
              region: 'USA',
              account_code: 400,
              account_name: 'COGS',
              type: 'Expense',
              total_revenue: 0,
              total_expense: 150,
              txdate: '2024-02-10'
            },
            {
              location: 'FL',
              region: 'USA',
              account_code: 500,
              account_name: 'Sales',
              type: 'Revenue',
              total_revenue: 500,
              total_expense: 0,
              txdate: '2024-01-01'
            },
            {
              location: 'FL',
              region: 'USA',
              account_code: 500,
              account_name: 'Sales',
              type: 'Revenue',
              total_revenue: 300,
              total_expense: 0,
              txdate: '2024-02-01'
            }
        ];

        assert.deepStrictEqual(geodata,expected);
    });

    it("should format geodata data into array",async() => {
        const notes = `In our opinion, the income statement presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 225, Income Statement. SALES ARE GENERATED 100% FROM THE LOCATION OF FL IN THE REGION OF THE USA.`;

        formattedData = await report.formatArray(geodata,notes);
        const geographies = formattedData.geographies;
        assert.strictEqual(geographies["USA"]["FL"],100);
    })

    it("should format geodata array into xml",async() => {
        xml = await report.formatXml("incomeStatementGeographic",formattedData);
    })

    it("should save the geodata xml to a file",async() => {
        const filePath = await report.saveReportSync("incomeStatementGeography",xml,"xml");
        assert.strictEqual(path.basename(filePath),"incomeStatementGeography.xml");
    })

    it("should format the geographic income statement report",async() => {
        html = await report.formatHtml("incomeStatementGeographic",xml);
    })

    it("should save the geographic income statement html report to a file",async function(){
        const filePath = await report.saveReportSync("incomeStatementGeography",html,"html");
        assert.strictEqual(path.basename(filePath),"incomeStatementGeography.html");
    })

})