const expect = require("chai").expect;
const { init, NoteToFinancialStatements } = require("../index");
const fs = require('fs');

describe("note to financial statement", function(){
    before(function(){
        init();
    })
    it("add a note to financial statement", function(){
        var noteToFinancialStatement = new NoteToFinancialStatements();
        noteToFinancialStatement.modifyReport(0,"balanceSheet","A new note",function(results){
            console.log(results)
        });
    })
})