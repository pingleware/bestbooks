const assert = require('assert');
const {ContraAsset} = require('../index');

describe("ContraAsset Class", async function(){
    let asset;

    before(function(){
        asset = new ContraAsset();
    })

    it("should create an instance of ContraAsset", async function(){
        assert.ok(asset instanceof ContraAsset);
    })
})
