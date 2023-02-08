const { TrialBalance } = require("../index");

describe("trial balance", function(){
    it("get trial balance report data", function(){
        var trialBalance = new TrialBalance();
        var data = trialBalance.createReport("","","array");
        console.log(data);
    })
})