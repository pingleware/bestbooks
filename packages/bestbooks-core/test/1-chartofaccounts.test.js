const ChartOfAccounts = require("../chartOfAccounts");
const assert = require('assert').strict
const AccountTypes = require("../accountTypes");
const Model = require("../model");

describe("testing ChartOfAccounts class",function(){
    it("create new cash account",async function(){
        var coa = new ChartOfAccounts();
        var id = await coa.add("Cash",AccountTypes.Cash,1);
        console.log(id);

        var model = new Model();
        var rows = await model.querySync(`SELECT code,name,type,base_type FROM accounts WHERE name='Cash';`);

        assert.equal(rows.length,1,`Expected only one Cash account, got ${rows.length} Cash account(s)?`);
        assert.equal(Number(rows[0].code),100,`Expected Cash account code to 100 [${rows[0].code}]`)
    })
    it("get next Asset account code",async function(){
        var coa = new ChartOfAccounts();
        var code = await coa.getNextAccountCode("Asset");
        assert.equal(Number(code),101,"Wrong expected next asset account code")
        console.log(`Next Asset code = ${Number(code)}`)
    })
    it("get accoount list",async function(){
        var coa = new ChartOfAccounts();
        await coa.add("Cash",AccountTypes.Cash,1);
        var accounts = await coa.getListSync(1);
        console.log(accounts)
    })
    it("remove Cash account",async function(){
        var coa = new ChartOfAccounts();
        coa.remove("Cash")

        var model = new Model();
        var rows = await model.querySync(`SELECT code,name,type,base_type FROM accounts WHERE name='Cash';`);
        assert.equal(rows.length,0,`Cash account not deleted [${rows.length}]`);
    })
    this.afterAll(function(){
        var model = new Model();
        model.emptyTableSync("accounts");
    })
})