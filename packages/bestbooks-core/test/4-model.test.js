var Model = require("../model.js");

describe("testing Model class",function(){
    it("get all tables", function(){
        var model = new Model();
        model.getAllTables(function(rows){
            var tables = [];
            rows.forEach(function(row){
                tables.push(row.name);
            })
            console.log(tables);
        });
    })
    it("get all tables via sync",async function(){
        var model = new Model();
        var rows = await model.getAllTablesSync();
        var tables = [];
        rows.forEach(function(row){
            tables.push(row.name);
        })
        console.log(tables);
    })
    it("empty ledger table",async function(){
        var model = new Model();
        await model.emptyTableSync("ledger");
    })
    it("empty journal table",async function(){
        var model = new Model();
        await model.emptyTableSync("journal");
    })
    it("empty accounts table",async function(){
        var model = new Model();
        await model.emptyTableSync("accounts");
    })    
})