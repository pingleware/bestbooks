"use strict";

const assert = require('assert');
const Company = require("../company");

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

    /* TODO: FIX github workflow
    it("add Sample Company",async function(){
        const result = await company.add("Sample Company","not a real company");
    })

    it("get company list",async function(){
        await company.getAll(function(companies){
            console.log(companies)
        })
    })

    it("remove Sample Company",async function(){
        const result = await company.remove("Sample Company");
    })
    */
})