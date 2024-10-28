const assert = require('assert');
const {
    Report
} = require('../index');

describe("Report Class", async function(){
    let report;

    before(async function(){
        report = new Report();
    })
    
    after(async function(){
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })
    
    it("should create an instance of Report", async function(){
        assert.ok(report instanceof Report);
    })
})
