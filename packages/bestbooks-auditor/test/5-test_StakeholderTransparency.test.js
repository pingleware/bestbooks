const expect = require("chai").expect;
const {StakeholderTransparency} = require('../index');

describe("auditor",function(){
    it("check StakeholderTransparency.governanceFramework equals COBIT",function(){
        expect(StakeholderTransparency.governanceFramework=="COBIT","expected COBIT");
    });
    it("get procedures",function(){
        console.log(StakeholderTransparency)
    })
});
