"use strict"

const { addTransaction } = require("@pingleware/bestbooks-helpers");

/**
 * 
 * @param {object} params {filename, comapny_id, office_id} 
 */
function import_csv(params) {
    const parse = require('csv-parse')
    const fs = require('fs') 
    
    const data = []
    fs.createReadStream(params.filename)
        .pipe(parse({ delimiter: ',' }))
        .on('data', (r) => {
            console.log(r);
            data.push(r);        
        })
        .on('end', () => {
            return importTransactions(data,params.company_id,params.office_id);
        });
}

async function import_pdf(params) {
    return await importTransactions(params);
}

async function import_from_wordpress(params) {
    return await importTransactions(params);
}

async function import_from_waveaccounting(params) {
    return await importTransactions(params);
}

async function import_from_quickbooks(params) {
    return await importTransactions(params);
}
/**
 * 
 * @param {array} import_data [date,description,debit,credit,account,type]
 * @param {number} company_id 
 * @param {number} office_id 
 */
function importTransactions(import_data,company_id=0,office_id=0) {
    var date = new Date(import_data[0]).toISOString();
    var description = import_data[1].replace(/"|'/g, '');
    description = description.replace(/"|\\/g, '');
    var debit = import_data[2].replace(/"|,/g, '');
    var credit = import_data[3].replace(/"|,/g, '');
    var account = import_data[4];
    var type = import_data[5];

    addTransaction(account,type,date,description,debit,credit,
        function(results){
            return results;          
        },company_id,office_id);
}

module.exports = {
    import_csv,
    import_pdf,
    import_from_wordpress,
    import_from_waveaccounting,
    import_from_quickbooks
}