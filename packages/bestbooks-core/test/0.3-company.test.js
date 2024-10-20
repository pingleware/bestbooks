"use strict";

const assert = require('assert');
const {
    Cash,
    Journal,
    Company
} = require("../index");

describe("Company class",function(){
    let company, cash, petty_cash;

    before(function(){
        company = new Company();
        cash = new Cash("Cash");
        petty_cash = new Journal("PettyCash");
    })

    after(async function(){
        await company.model.insertSync(`DELETE FROM company;`);
        //await company.model.insertSync(`DELETE FROM accounts;`);
        await company.model.insertSync(`DELETE FROM ledger;`);
        await company.model.insertSync(`DELETE FROM journal;`);
        await company.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='company';`);
        //await company.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
        await company.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await company.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
    })

    it("should create an instance of Company", async function(){
        assert.ok(company instanceof Company);
    })

    it("should create an instance of Cash", async function(){
        assert.ok(cash instanceof Cash);
    })

    it("should create an instance of Journal", async function(){
        assert.ok(petty_cash instanceof Journal);
    })

    it("add Sample Company",async function(){
        const result = await company.add("Sample Company","not a real company");
        assert.strictEqual(result,1,"company id is NOT 1");
    })

    it("get company list",async function(){
        const companies = await company.getAll();
        assert.strictEqual(companies[0].name,"Sample Company","expected 'Sample Company' for the name");
    })

    it("remove Sample Company",async function(){
        const result = await company.remove("Sample Company");
        assert.strictEqual(result,1,"company id is NOT 1");
    })
})