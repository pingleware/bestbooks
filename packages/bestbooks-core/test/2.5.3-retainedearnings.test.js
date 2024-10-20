const assert = require('assert');
const {RetainedEarnings} = require('../index');

describe("RetainedEarnings Class", async function(){
    let earnings;

    before(function(){
        earnings = new RetainedEarnings();
    })

    it("should create an instance of RetainedEarnings", async function(){
        assert.ok(earnings instanceof RetainedEarnings);
    })
})
