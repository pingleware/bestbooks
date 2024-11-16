const assert = require('assert');
const { 
    init, 
    BudgetVsActual,
} = require("../index");
const {
    Asset,
} = require('@pingleware/bestbooks-core');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create formatted Budget vs Actual Report", function(){
    let report, asset, data, formattedData, xml, date;

    before(async() => {
        report = new BudgetVsActual();
        asset = new Asset("Account A","Asset","Asset");
        await asset.addBalance("Account A","01",100);
        await asset.addBalance("Account A","02",150);
        await asset.addBalance("Account A","03",120);
        await asset.addBalance("Account A","04",130);
        await asset.addBalance("Account A","05",110);
        await asset.addBalance("Account A","06",140);
        await asset.addBalance("Account A","07",160);
        await asset.addBalance("Account A","08",180);
        await asset.addBalance("Account A","09",200);
        await asset.addBalance("Account A","10",170);
        await asset.addBalance("Account A","11",190);
        await asset.addBalance("Account A","12",210);
        await asset.addBalance("Account A","13",220);
        await asset.addBalance("Account A","14",230);
        await asset.addBalance("Account A","15",240);
        await asset.addBalance("Account A","16",250);
        await asset.addBalance("Account A","17",260);
        await asset.addBalance("Account A","18",270);
        await asset.addBalance("Account A","19",280);
        await asset.addBalance("Account A","20",290);
        await asset.addBalance("Account A","21",300);
        await asset.addBalance("Account A","22",310);
        await asset.addBalance("Account A","23",320);
        await asset.addBalance("Account A","24",330);
        await asset.addBudget("Account A","01",90);
        await asset.addBudget("Account A","02",140);
        await asset.addBudget("Account A","03",110);
        await asset.addBudget("Account A","04",120);
        await asset.addBudget("Account A","05",100);
        await asset.addBudget("Account A","06",130);
        await asset.addBudget("Account A","07",150);
        await asset.addBudget("Account A","08",170);
        await asset.addBudget("Account A","09",190);
        await asset.addBudget("Account A","10",160);
        await asset.addBudget("Account A","11",180);
        await asset.addBudget("Account A","12",200);
        await asset.addBudget("Account A","13",210);
        await asset.addBudget("Account A","14",220);
        await asset.addBudget("Account A","15",230);
        await asset.addBudget("Account A","16",240);
        await asset.addBudget("Account A","17",250);
        await asset.addBudget("Account A","18",260);
        await asset.addBudget("Account A","19",270);
        await asset.addBudget("Account A","20",280);
        await asset.addBudget("Account A","21",290);
        await asset.addBudget("Account A","22",300);
        await asset.addBudget("Account A","23",310);
        await asset.addBudget("Account A","24",320);
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

    it("should create an instance of BudgetVsActual", async function(){
        assert.ok(report instanceof BudgetVsActual);
    }) 

    it('should return correct budget-vs-actual report',async function() {
        data = await report.retrieveReportDataSync();
        date = data[0].txdate;
        const expected = [
            {
              account_code: 100,
              account_name: 'Account A',
              account_type: 'Asset',
              actual_year_1: null,
              budget_year_1: 1740,
              variance_year_1: null,
              actual_year_2: 3300,
              budget_year_2: 3180,
              variance_year_2: 120,
              txdate: date
            }
        ];
        assert.deepStrictEqual(data,expected);
    });

    it("should format data into array",async() => {
        const notes = `In our opinion, the break-even anaysis presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 842 Adoption.`;
        const expected = {
            lineItems: [
              {
                account_code: 100,
                account_name: 'Account A',
                account_type: 'Asset',
                actual_year_1: null,
                budget_year_1: 1740,
                variance_year_1: null,
                actual_year_2: 3300,
                budget_year_2: 3180,
                variance_year_2: 120,
                txdate: date
              }
            ],
            notes: 'In our opinion, the break-even anaysis presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 842 Adoption.'
        };
        formattedData = await report.formatArray(data,notes);
        assert.deepStrictEqual(formattedData,expected)
    });

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
        const expected = `<?xml version='1.0'?>
<budgetVsActual>
    <lineItems>
        <account_code>100</account_code>
        <account_name>Account A</account_name>
        <account_type>Asset</account_type>
        <actual_year_1>null</actual_year_1>
        <budget_year_1>1740</budget_year_1>
        <variance_year_1>null</variance_year_1>
        <actual_year_2>3300</actual_year_2>
        <budget_year_2>3180</budget_year_2>
        <variance_year_2>120</variance_year_2>
        <txdate>${date}</txdate>
    </lineItems>
    <notes>In our opinion, the break-even anaysis presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 842 Adoption.</notes>
</budgetVsActual>`;
        assert.deepStrictEqual(xml,expected);
    });

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("budgetVsActual",xml,"xml");
        assert.strictEqual(path.basename(filePath),"budgetVsActual.xml");
    })

    it("should format the balance sheet report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("budgetVsActual",html,"html");
        assert.strictEqual(path.basename(filePath),"budgetVsActual.html");
    })
})