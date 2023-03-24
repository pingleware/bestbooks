const Journal = require("../journal");
const Model = require("../model");

describe("testing Journal class",function(){
    it("add Cash entry", async function(){
        var journal = new Journal("General");
        var result = await journal.add(new Date().toISOString(),0,"Cash",100,0,1,0);
        console.log(result)

        var model = new Model();
        var rows = await model.querySync(`SELECT * FROM journal;`);
        console.log(rows);
    })
})