const Company = require("../company");

describe("testing Company class",function(){
    it("get company list",async function(){
        const company = new Company();
        company.getCompanies(function(companies){
            console.log(companies)
        })
    })
})