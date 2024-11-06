const assert = require('assert'); 
const { 
    init, 
    RetainedEarnings, 
} = require("../index");
const fs = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create formatted Retained Earnings Report',function(){
    let report;

    before(function(){
        init();
        report = new RetainedEarnings();
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

    it("should create an instance of RetainedEarnings", async function(){
        assert.ok(report instanceof RetainedEarnings);
    }) 

})