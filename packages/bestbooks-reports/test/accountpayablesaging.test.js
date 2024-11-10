const assert = require('assert');
const { 
    init, 
    AccountPayablesAging,
} = require("../index");
const {
    AccountsPayable
} = require('@pingleware/bestbooks-core');
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create formatted Account Payables Aging Report", function(){
    let report, vendorOne, vendorTwo, data, formattedData, xml;
    let due15DaysAgo, due45DaysAgo, due75DaysAgo, due95DaysAgo, due135DaysAgo;

    before(async() => {
        report = new AccountPayablesAging();

        vendorOne = new AccountsPayable("Vendor 1");
        vendorTwo = new AccountsPayable("Vendor 2");

        due15DaysAgo = new Date();
        due45DaysAgo = new Date();
        due75DaysAgo = new Date();
        due95DaysAgo = new Date();
        due135DaysAgo = new Date();

        due15DaysAgo.setDate(due15DaysAgo.getDate() - 15);
        due45DaysAgo.setDate(due15DaysAgo.getDate() - 45);
        due75DaysAgo.setDate(due15DaysAgo.getDate() - 75);
        due95DaysAgo.setDate(due15DaysAgo.getDate() - 95);
        due135DaysAgo.setDate(due135DaysAgo.getDate() - 135);

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

    it("should create an instance of AccountPayablesAging", async function(){
        assert.ok(report instanceof AccountPayablesAging);
    }) 

    it('should add an aged debit 100 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",100,due15DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('should add an aged debit 50 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",50,due45DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    });

    it('should add an aged debit 200 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",200,due75DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    });

    it('should add an aged debit 300 days ago for vendor one',async() => {
        const [ledger_id,journal_id] = await vendorOne.addDebit(new Date().toISOString().split("T")[0],"",300,due95DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    });

    it('should add an aged debit 150 days ago for vendor two',async() => {
        const [ledger_id,journal_id] = await vendorTwo.addDebit(new Date().toISOString().split("T")[0],"",150,due135DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    });

    it("should get account payables aging data",async() => {
        data = await report.retrieveReportDataSync();
        const expected = [
            {
              account_code: 200,
              account_name: 'Vendor 1',
              current: -150,
              past_due_1_30: -200,
              past_due_31_60: -300,
              past_due_61_90: 0,
              past_due_over_90: 0,
              total_outstanding: -650,
              txdate: '2024-11-10'
            },
            {
              account_code: 201,
              account_name: 'Vendor 2',
              current: 0,
              past_due_1_30: 0,
              past_due_31_60: 0,
              past_due_61_90: 0,
              past_due_over_90: -150,
              total_outstanding: -150,
              txdate: '2024-11-10'
            }
        ];
        assert.deepStrictEqual(data,expected);
    })

    it("should format data into array",async() => {
        const notes = `In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 310, Receivables.`;

        formattedData = await report.formatArray(data,notes);
        const expected = {
            lineItems: [
              {
                account_code: 200,
                account_name: 'Vendor 1',
                current: -150,
                past_due_1_30: -200,
                past_due_31_60: -300,
                past_due_61_90: 0,
                past_due_over_90: 0,
                total_outstanding: -650,
                txdate: '2024-11-10'
              },
              {
                account_code: 201,
                account_name: 'Vendor 2',
                current: 0,
                past_due_1_30: 0,
                past_due_31_60: 0,
                past_due_61_90: 0,
                past_due_over_90: -150,
                total_outstanding: -150,
                txdate: '2024-11-10'
              }
            ],
            notes: 'In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 310, Receivables.'
        };
        assert.deepStrictEqual(formattedData,expected);
    })

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
        const expected = `<?xml version='1.0'?>
<accountPayablesAging>
    <lineItems>
        <account_code>200</account_code>
        <account_name>Vendor 1</account_name>
        <current>-150</current>
        <past_due_1_30>-200</past_due_1_30>
        <past_due_31_60>-300</past_due_31_60>
        <past_due_61_90>0</past_due_61_90>
        <past_due_over_90>0</past_due_over_90>
        <total_outstanding>-650</total_outstanding>
        <txdate>2024-11-10</txdate>
    </lineItems>
    <lineItems>
        <account_code>201</account_code>
        <account_name>Vendor 2</account_name>
        <current>0</current>
        <past_due_1_30>0</past_due_1_30>
        <past_due_31_60>0</past_due_31_60>
        <past_due_61_90>0</past_due_61_90>
        <past_due_over_90>-150</past_due_over_90>
        <total_outstanding>-150</total_outstanding>
        <txdate>2024-11-10</txdate>
    </lineItems>
    <notes>In our opinion, the balance sheet presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 310, Receivables.</notes>
</accountPayablesAging>`;
        assert.deepStrictEqual(xml,expected);
    })

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("accountPayablesAging",xml,"xml");
        assert.strictEqual(path.basename(filePath),"accountPayablesAging.xml");
    })

    it("should format the balance sheet report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("accountPayablesAging",html,"html");
        assert.strictEqual(path.basename(filePath),"accountPayablesAging.html");
    })
})