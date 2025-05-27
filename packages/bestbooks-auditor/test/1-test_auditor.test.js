const expect = require("chai").expect;
const {invoke} = require("../index");

const { start_server, stop_server } = require('@pingleware/bestbooks-api');

const fs = require("fs");
const os = require("os");
const path = require("path");
const which = require("which");

var host = "localhost";
var port = 9000 + Math.floor(Math.random() * 1000);

describe("auditor",function(){
    let rscriptPath;
    
    beforeEach(function(){
        rscriptPath = process.platform === "win32" ? "Rscript.exe" : "Rscript";
        if (!which.sync(rscriptPath, { nothrow: true })) {
            throw new Error("Rscript executable not found in PATH");
        }

        start_server(host,port);
    });
    it("check version",function(){
        in_progress = true;
        var script_filename = `scripts/audit_checkVersion.R ${host} ${port}`;
        invoke("Rscript",script_filename,1,"balanceSheet",function(output){
            //console.log(output);
            if (output.status === "success") {
                expect(output.message,"  version\n1   1.0.9\n");
            }
            stop_server();
        })
    })
})