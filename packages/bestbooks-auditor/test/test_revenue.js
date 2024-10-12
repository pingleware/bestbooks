const expect = require("chai").expect;
const {train,query} = require("../index");
const fs = require('fs');
const path = require('path');

describe("auditor",function(){
    it("train revenue mode", async function(){
        try {
            const trainingData = JSON.parse(fs.readFileSync('./assets/revenue.json'));
            const status = await train(trainingData,"revenue");
            expect(status.success, true);   
            console.log(status) 
        } catch(error) {
            console.log(error);
            expect(error.success, true);
        }
    })
});