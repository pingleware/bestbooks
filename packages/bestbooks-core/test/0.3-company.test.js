"use strict";

const assert = require('assert');
const {
    Company
} = require("../index");

describe("Company class",function(){
    let company;

    before(function(){
        company = new Company();
    })

    after(async function(){
        await company.model.insertSync(`DELETE FROM company;`);
        await company.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='company';`);
    })

    it("should create an instance of Company", async function(){
        assert.ok(company instanceof Company);
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