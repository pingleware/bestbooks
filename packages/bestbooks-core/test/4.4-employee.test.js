const assert = require('assert');
const {Employee} = require('../index');

describe("Employee Class", async function(){
    let user;

    before(function(){
        user = new Employee();
    })

    it("should create an instance of Employee", async function(){
        assert.ok(user instanceof Employee);
    })
})
