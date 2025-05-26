const assert = require('assert');
const { 
    init, 
    AccountsReceivablesAging,
} = require("../index");
const {
    AccountsReceivable
} = require('@pingleware/bestbooks-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const glob = require('glob');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create formatted Account Receivables Aging Report", function(){
    let report, customerOne, customerTwo, data, formattedData, xml, date;
    let due15DaysAgo, due20DaysAgo, due45DaysAgo, due50DaysAgo, due75DaysAgo, due80DaysAgo, due95DaysAgo, due135DaysAgo; 

    before(async() => {
        date = new Date().toISOString().split('T')[0];

        report = new AccountsReceivablesAging();
        due15DaysAgo = new Date();
        due20DaysAgo = new Date();
        due45DaysAgo = new Date();
        due50DaysAgo = new Date();
        due75DaysAgo = new Date();
        due80DaysAgo = new Date();
        due95DaysAgo = new Date();
        due135DaysAgo = new Date();

        due15DaysAgo.setDate(due15DaysAgo.getDate() - 15);
        due20DaysAgo.setDate(due20DaysAgo.getDate() - 20);
        due45DaysAgo.setDate(due45DaysAgo.getDate() - 45);
        due50DaysAgo.setDate(due50DaysAgo.getDate() - 50);
        due75DaysAgo.setDate(due75DaysAgo.getDate() - 75);
        due80DaysAgo.setDate(due80DaysAgo.getDate() - 80);
        due95DaysAgo.setDate(due95DaysAgo.getDate() - 95);
        due135DaysAgo.setDate(due135DaysAgo.getDate() - 135);
        
        init();
    })

    beforeEach(async function() {
        await delay(2000); // Delay of 2 seconds before each test
    });

    after(async() => {
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`DELETE FROM company`);
        await report.model.insertSync(`DELETE FROM users`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='users';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='company';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);

        const basePath = path.join(os.homedir(), `.bestbooks`);
        const pattern = `${basePath}/accountReceivablesAging.*`;
        
        // Find files matching the pattern
        const files = glob.sync(pattern);

        // Remove each file
        files.forEach(file => {
            if (fs.existsSync(file)) {
                fs.rmSync(file, { force: true });
            }
        });
    })

    it("should create an instance of AccountsReceivablesAging", async function(){
        assert.ok(report instanceof AccountsReceivablesAging);
    }) 

    it("shouold create customer one",async function(){
        customerOne = new AccountsReceivable("Customer One");
    })

    it("shouold create customer two",async function(){
        customerTwo = new AccountsReceivable("Customer Two");
    })

    it('add an aged debit 500 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(date, "", 500, due15DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,1);
        assert.equal(journal_id,1);
    })

    it('add an aged debit 200 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(date, "", 200, due45DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,2);
        assert.equal(journal_id,2);
    });

    it('add an aged debit 100 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(date, "", 100, due75DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,3);
        assert.equal(journal_id,3);
    });

    it('add an aged debit 50 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(date, "", 50, due95DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,4);
        assert.equal(journal_id,4);
    });

    it('add an aged debit 25 days ago for customer one',async() => {
        const [ledger_id,journal_id] = await customerOne.addDebit(date, "", 25, due135DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,5);
        assert.equal(journal_id,5);
    });

    it('add an aged debit 1000 days ago for customer two',async() => {
        const [ledger_id,journal_id] = await customerTwo.addDebit(date, "", 1000, due20DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,6);
        assert.equal(journal_id,6);
    });

    it('add an aged debit 300 days ago for customer two',async() => {
        const [ledger_id,journal_id] = await customerTwo.addDebit(date, "", 300, due50DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,7);
        assert.equal(journal_id,7);
    });

    it('add an aged debit 150 days ago for customer two',async() => {
        const [ledger_id,journal_id] = await customerTwo.addDebit(date, "", 150, due80DaysAgo.toISOString().split("T")[0]);
        assert.equal(ledger_id,8);
        assert.equal(journal_id,8);
    });

    it('should return the account receivables aging report', async function() {
        data = await report.retrieveReportDataSync();
        const expected = [
            {
              account_code: 100,
              account_name: 'Customer One',
              current: 500,
              past_due_1_30: 200,
              past_due_31_60: 100,
              past_due_61_90: 50,
              past_due_over_90: 25,
              total_outstanding: 875,
              txdate: date
            },
            {
              account_code: 101,
              account_name: 'Customer Two',
              current: 1000,
              past_due_1_30: 300,
              past_due_31_60: 150,
              past_due_61_90: 0,
              past_due_over_90: 0,
              total_outstanding: 1450,
              txdate: date
            }
        ];
        assert.deepStrictEqual(data,expected)
    });

    it("should format data into array",async() => {
        const notes = `In our opinion, the account receivables aging presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 310, Receivables.`;

        formattedData = await report.formatArray(data,notes);
        const expected = {
            lineItems: [
              {
                account_code: 100,
                account_name: 'Customer One',
                current: 500,
                past_due_1_30: 200,
                past_due_31_60: 100,
                past_due_61_90: 50,
                past_due_over_90: 25,
                total_outstanding: 875,
                txdate: date
              },
              {
                account_code: 101,
                account_name: 'Customer Two',
                current: 1000,
                past_due_1_30: 300,
                past_due_31_60: 150,
                past_due_61_90: 0,
                past_due_over_90: 0,
                total_outstanding: 1450,
                txdate: date
              }
            ],
            notes: 'In our opinion, the account receivables aging presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 310, Receivables.'
        };
        assert.deepStrictEqual(formattedData,expected)
    })

    it("should format array into xml",async () => {
        xml = await report.formatXml(formattedData);
        const expected = `<?xml version='1.0'?>
<accountReceivablesAging>
    <lineItems>
        <account_code>100</account_code>
        <account_name>Customer One</account_name>
        <current>500</current>
        <past_due_1_30>200</past_due_1_30>
        <past_due_31_60>100</past_due_31_60>
        <past_due_61_90>50</past_due_61_90>
        <past_due_over_90>25</past_due_over_90>
        <total_outstanding>875</total_outstanding>
        <txdate>${date}</txdate>
    </lineItems>
    <lineItems>
        <account_code>101</account_code>
        <account_name>Customer Two</account_name>
        <current>1000</current>
        <past_due_1_30>300</past_due_1_30>
        <past_due_31_60>150</past_due_31_60>
        <past_due_61_90>0</past_due_61_90>
        <past_due_over_90>0</past_due_over_90>
        <total_outstanding>1450</total_outstanding>
        <txdate>${date}</txdate>
    </lineItems>
    <notes>In our opinion, the account receivables aging presents fairly, in all material respects, the financial position as of the date specified in accordance with FASB ASC Topic 310, Receivables.</notes>
</accountReceivablesAging>`;
        assert.deepStrictEqual(xml,expected);
    });

    it("should save the xml to a file",async() => {
        const filePath = await report.saveReportSync("accountReceivablesAging",xml,"xml");
        assert.strictEqual(path.basename(filePath),"accountReceivablesAging.xml");
    })

    it("should format the account receivables aging report",async() => {
        html = await report.formatHtml(xml);
    })

    it("should save the html to a file",async function(){
        const filePath = await report.saveReportSync("accountReceivablesAging",html,"html");
        assert.strictEqual(path.basename(filePath),"accountReceivablesAging.html");
    })
})