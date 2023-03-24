const assert = require('assert').strict
const Ledger = require("../ledger.js");
const ChartOfAccounts = require("../chartOfAccounts");
const AccountTypes = require("../accountTypes");
const Model = require("../model");


describe("testing Ledger class",function(){
    it("deposit $100 to Cash account",async function(){
        var coa = new ChartOfAccounts();
        await coa.add("Cash",AccountTypes.Cash,1);

        var cash = new Ledger("Cash",AccountTypes.Cash);
        var ids = await cash.addDebit(new Date().toISOString(),"Deposit",100.00,1,0);

        var model = new Model();
        var cash_account_row = await model.querySync(`SELECT * FROM accounts WHERE name='Cash';`)
        var ledger_row = await model.querySync(`SELECT * FROM ledger WHERE id=${ids[0]};`)
        var journal_row = await model.querySync(`SELECT * FROM journal WHERE id=${ids[1]};`)

        assert.equal(Number(cash_account_row[0].code),100,`Expected Cash account code to be 100 [${cash_account_row[0].code}]`)
        assert.equal(ledger_row[0].company_id,journal_row[0].company_id,"Company ID is NOT updated between Ledger and Journal");
        assert.equal(Number(ledger_row[0].debit),100.00,`Debit entry is incorrect [${ledger_row[0].debit}]`)
    })
    it("withdrawl $50 from Cash account",async function(){
        var coa = new ChartOfAccounts();
        await coa.add("Cash",AccountTypes.Cash,1);

        var cash = new Ledger("Cash",AccountTypes.Cash);
        var ids = await cash.addCredit(new Date().toISOString(),"Withdrawal",50.00,1,0);

        var model = new Model();
        var ledger_row = await model.querySync(`SELECT * FROM ledger WHERE id=${ids[0]};`)

        assert.equal(Number(ledger_row[0].credit),50.00,`Credit entry is incorrect [${ledger_row[0].credit}]`)
    })
    this.afterAll(function(){
        var model = new Model();
        model.emptyTableSync("ledger");
        model.emptyTableSync("journal");
        model.emptyTableSync("accounts");
    })
})