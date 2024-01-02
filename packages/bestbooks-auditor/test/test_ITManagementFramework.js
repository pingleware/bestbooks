const expect = require("chai").expect;
const {ITManagementFramework} = require("../index");

describe("auditor",function(){
    it("check ITManagementFramework.governanceFramework equals COBIT",function(){
        expect(ITManagementFramework.governanceFramework=="COBIT","expected COBIT");
    });
    it("get procedures",function(){
        console.log(ITManagementFramework.procedures)
    })
});
