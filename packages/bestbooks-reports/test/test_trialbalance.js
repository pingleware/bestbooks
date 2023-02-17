const { TrialBalance } = require("../index");

describe("trial balance", function(){
    it("get trial balance report data", function(){
        var trialBalance = new TrialBalance();
        trialBalance.createReport("","","array",function(data){
            console.log(data);
        });
    })
})