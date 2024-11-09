const assert = require('assert');
const { 
    init, 
    BudgetVsActual,
} = require("../index");
const path = require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Create formatted Budget vs Actual Report", function(){
    let report;

    before(async() => {
        report = new BudgetVsActual();
        init();
    })

    beforeEach(async function() {
        await delay(1000); // Delay of 1 second before each test
    });

    after(async() => {
        await report.model.insertSync(`DELETE FROM ledger;`);
        await report.model.insertSync(`DELETE FROM accounts`);
        await report.model.insertSync(`DELETE FROM journal`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='journal';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';`);
        await report.model.insertSync(`UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';`);
    })

    it("should create an instance of BudgetVsActual", async function(){
        assert.ok(report instanceof BudgetVsActual);
    }) 

})