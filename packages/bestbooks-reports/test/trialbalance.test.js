const { copy, TrialBalance } = require("../index");

const path = require('path');
const os = require('os');
const fs = require('fs');

describe("trial balance", function(){
    before(function(){
        copy('trial-balance.xslt','trial-balance.xslt');
    });
    after(function(){
        var fullpath = path.join(os.homedir(),'./bestbooks/trial-balance.xslt');
        if (fs.existsSync(fullpath)) {
            fs.unlink(fullpath);
        }
    });
    it("get trial balance report data", function(){
        var trialBalance = new TrialBalance();
        trialBalance.createReport("","","array",function(html){
            fs.writeFileSync('trial-balance.html',html);
        });
    })
})