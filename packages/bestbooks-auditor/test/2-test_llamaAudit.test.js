const expect = require("chai").expect;
const {GAAP_RULES} = require("../index");

describe("llama auditor",async function(){
    it("check gaap rules",async function(){
        console.log(GAAP_RULES);
    })
})