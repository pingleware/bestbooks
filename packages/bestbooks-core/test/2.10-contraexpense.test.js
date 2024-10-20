const assert = require('assert');
const {ContraExpense} = require('../index');

describe("ContraExpense Class", async function(){
    let expense;

    before(function(){
        expense = new ContraExpense();
    })

    it("should create an instance of ContraExpense", async function(){
        assert.ok(expense instanceof ContraExpense);
    })
})
