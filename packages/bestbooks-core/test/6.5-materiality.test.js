const assert = require('assert');
const {Materiality} = require('../index');

describe("Materiality Class", async function(){
    let materiality;

    before(function(){
        materiality = new Materiality();
    })

    it("should create an instance of Materiality", async function(){
        assert.ok(materiality instanceof Materiality);
    })
})