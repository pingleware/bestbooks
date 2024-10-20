const assert = require('assert');
const {Customer} = require('../index');

describe("Customer Class", async function(){
    let user;

    before(function(){
        user = new Customer();
    })

    it("should create an instance of Customer", async function(){
        assert.ok(user instanceof Customer);
    })
})
