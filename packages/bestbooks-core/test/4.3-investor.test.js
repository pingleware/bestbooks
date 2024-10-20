const assert = require('assert');
const {Investor} = require('../index');

describe("Investor Class", async function(){
    let user;

    before(function(){
        user = new Investor();
    })

    it("should create an instance of Investor", async function(){
        assert.ok(user instanceof Investor);
    })
})
