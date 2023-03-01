"use strict"

const { exec } = require('child_process');
const {  NoteToFinancialStatements } = require('@pingleware/bestbooks-reports');

function invoke(rexepathname,scriptpathname,reportId,reportName,callback=null) {
    exec(`${rexepathname} ${scriptpathname} ${reportName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          if (callback) {
            callback(JSON.stringify({status: 'error', message: error.message}));
          } else {
            return error.message;
          }
        }
      
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          if (callback) {
            callback(JSON.stringify({status: 'error', message: stderr}));
            } else {
                return JSON.stringify({status: 'error', message: stderr});
            }
        }
      
        console.log(`stdout:\n${stdout}`);
        var noteToFinancialStatement = new NoteToFinancialStatements();
        if (noteToFinancialStatement.modifyReport) {
          noteToFinancialStatement.modifyReport(reportId,reportName,stdout,function(results){
            if (callback) {
                callback(JSON.stringify({status: 'success', message: stdout}));
            } else {
                return JSON.stringify({status: 'success', message: stdout});
            }
          });
        } else {
          if (callback) {
            callback(JSON.stringify({status: 'success', message: stdout}));
          } else {
              return JSON.stringify({status: 'success', message: stdout});
          }
        }
    });
}

module.exports = invoke;