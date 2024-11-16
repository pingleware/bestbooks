const assert = require('assert');
const { 
    init, 
    BreakevenAnalysis,
} = require("../index");
const {
    FixedCost,
    VariableCost,
    Revenue,
} = require('@pingleware/bestbooks-core');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create formatted Breakeven Analysis Report", function(){
    let report, rent, supplies, sales, data, formattedData, xml, html, date;

    before(async() => {
        date = new Date().toISOString().split("T")[0];
        report = new BreakevenAnalysis();
        rent = new FixedCost("Rent");
        supplies = new VariableCost("Supplies");
        sales = new Revenue("Sales");
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

    it("should create an instance of BreakevenAnalysis", async function(){
        assert.ok(report instanceof BreakevenAnalysis);
    }) 

    it('should add a rent entry',async() => {
        const [ledger_id,journal_id] = await rent.addDebit(date,"Rent",1000);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add a supplies entry',async() => {
        const [ledger_id,journal_id] = await supplies.addDebit(date,"Supplies",500);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    })

    it('should add a sales entry',async() => {
        const [ledger_id,journal_id] = await sales.addCredit(date,"Sales",2000);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    })

    it('should return correct break-even analysis report',async function() {
        data = await report.retrieveReportDataSync();
        const expected = [
            {
              total_fixed_costs: 1000,
              total_variable_costs: 500,
              total_revenue: 2000,
              net_profit_loss: 500,
              txdate: date
            }
        ];
        assert.deepStrictEqual(data,expected);
    });

    it("should format data into array",async() => {
        const notes = `In our opinion, the break-even anaysis presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic Cost-Benefit.`;
        const expected = {
            lineItems: [
              {
                total_fixed_costs: 1000,
                total_variable_costs: 500,
                total_revenue: 2000,
                net_profit_loss: 500,
                txdate: date
              }
            ],
            notes: 'In our opinion, the break-even anaysis presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic Cost-Benefit.'
        };
        formattedData = await report.formatArray(data,notes);
        assert.deepStrictEqual(formattedData,expected)
    });

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
        const expected = `<?xml version='1.0'?>
<breakevenAnalysis>
    <lineItems>
        <total_fixed_costs>1000</total_fixed_costs>
        <total_variable_costs>500</total_variable_costs>
        <total_revenue>2000</total_revenue>
        <net_profit_loss>500</net_profit_loss>
        <txdate>${date}</txdate>
    </lineItems>
    <notes>In our opinion, the break-even anaysis presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic Cost-Benefit.</notes>
</breakevenAnalysis>`;
        assert.deepStrictEqual(xml,expected);
    });

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("breakevenAnalysis",xml,"xml");
        assert.strictEqual(path.basename(filePath),"breakevenAnalysis.xml");
    })

    it("should format the balance sheet report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("breakevenAnalysis",html,"html");
        assert.strictEqual(path.basename(filePath),"breakevenAnalysis.html");
    })
})