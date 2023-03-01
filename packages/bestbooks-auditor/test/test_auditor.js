const expect = require("chai").expect;
const invoke = require("../index");

const { start_server, stop_server } = require('@pingleware/bestbooks-api');

const fs = require("fs");
const os = require("os");
const path = require("path");

var host = "localhost";
var port = 9090;

describe("auditor",function(){
    beforeEach(function(){
        start_server(host,port);
    });
    it("check version",function(){
        in_progress = true;
        var script_filename = `scripts/audit_checkVersion.R ${host} ${port}`;
        invoke("Rscript",script_filename,1,"balanceSheet",function(output){
            console.log(output);
            stop_server();
        })
    })
})