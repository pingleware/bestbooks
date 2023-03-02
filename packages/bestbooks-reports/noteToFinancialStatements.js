"use strict"

/**
 * Note to a Finanical Statements is the basis for GAAP compliance because an accountant will add notes to resolve
 * misunderstandings in the financial reporting. Codification is employed to assist the accountant for references
 * in GAAP.
 */

const { Model } = require('@pingleware/bestbooks-core');
const { array2xml,getReportRootFileName } = require('./formatReport');

class NoteToFinancialStatements {
    constructor() {
    }

    modifyReport(reportId=0,name,notes,callback=null) {
        var _reportId = reportId;
        var report_rootfilename = getReportRootFileName(name);
        var sql = `SELECT * FROM report WHERE id=${reportId} AND name='${report_rootfilename}';`;
        if (reportId == 0) {
            sql = `SELECT * FROM report WHERE name='${report_rootfilename} LIMIT 1'`;
        }

        const model = new Model();
        model.query(sql,function(rows){
            if (rows.length > 0) {
                var data = rows[0];
                _reportId = data.id;
                var buffer = require('buffer').Buffer;
                var reportDataXML = buffer.from(data.contents, "base64").toString("utf8");

                const parseString = require('xml2js').parseString;
                parseString(reportDataXML, function (err, result) {
                    if (result.notes) {
                        result.notes = result.notes + notes;
                    } else {
                        result.notes = notes;
                    }
                    var xml = array2xml(name,result);

                    var buffer = require('buffer').Buffer;
                    var sql = `UPDATE report SET contents='${buffer.from(xml).toString("base64")}' WHERE id=${_reportId};`;
                    model.insert(sql,function(result){
                        callback(xml);
                    })
                });
            }    
        });
    }
}

module.exports = NoteToFinancialStatements;