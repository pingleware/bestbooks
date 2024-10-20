const assert = require('assert');
const {ContraRevenue} = require('../index');

describe("ContraRevenue Class", async function(){
    let revenue;

    before(function(){
        revenue = new ContraRevenue("Test");
    })

    it("should create an instance of ContraRevenue", async function(){
        assert.ok(revenue instanceof ContraRevenue);
    })
})
