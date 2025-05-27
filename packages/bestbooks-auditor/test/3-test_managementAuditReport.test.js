const expect = require("chai").expect;
const {generateManagementAuditReport} = require("../index");

describe("management report",function(){
    it("create management audit report", async function(){
        try {
            const companyName = "PERSSPAGE ENTERTAINMENT INC";
            const yearEnd = 2023;
            const managerName = "PATRICK O. INGLE";
            const managerTitle = "FOUNDER";
            const report = await generateManagementAuditReport(companyName, yearEnd, managerName, managerTitle);
            console.log(report);
        } catch(error) {
            console.log(error);
            expect(error.success, true);
        }
    })
});