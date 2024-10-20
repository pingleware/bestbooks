const assert = require('assert');
const {ContraLiability} = require('../index');

describe("ContraLiability Class", async function(){
    let liability;

    before(function(){
        liability = new ContraLiability();
    })

    it("should create an instance of ContraLiability", async function(){
        assert.ok(liability instanceof ContraLiability);
    })
})
