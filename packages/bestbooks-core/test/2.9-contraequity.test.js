const assert = require('assert');
const {ContraEquity} = require('../index');

describe("ContraEquity Class", async function(){
    let equity;

    before(function(){
        equity = new ContraEquity();
    })

    it("should create an instance of ContraEquity", async function(){
        assert.ok(equity instanceof ContraEquity);
    })
})
