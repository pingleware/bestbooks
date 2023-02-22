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

function import_from_waveaccounting(params,callback) {
    const fs = require("fs");
    const { parse } = require("csv-parse");

    const data = [];

    fs.createReadStream(params.filename)
        .pipe(parse({ delimiter: ',' }))
        .on('data', (r) => {
            //console.log(r);
            data.push(r);        
        })
        .on('end', () => {
            import_from_waveaccounting_contents(params,data,callback);
        });
}

function import_from_waveaccounting_contents(params,data,callback) {
    const { addTransaction, payExpenseByCard } = require("@pingleware/bestbooks-helpers");
    
            // import transactions
            switch(params.source) {
                case 'accounting':
                    {
                        /**
                         * Transaction ID,
                         * Transaction Date, [1]
                         * Account Name, [2]
                         * Transaction Description, [3]
                         * Transaction Line Description,
                         * Amount (One column),
                         *  ,
                         * Debit Amount (Two Column Approach), [7]
                         * Credit Amount (Two Column Approach), [8]
                         * Other Accounts for this Transaction,
                         * Customer,
                         * Vendor,
                         * Invoice Number,
                         * Bill Number,
                         * Notes / Memo
                         * Amount Before Sales Tax
                         * Sales Tax Amount,
                         * Sales Tax Name,
                         * Transaction Date Added,
                         * Transaction Date Last Modified,
                         * Account Group,
                         * Account Type, [21]
                         * Account ID
                         */
                        var accounting = [];
                        let total = data.length;
                        let count = 0;
                        data.forEach(function(lineItem){
                            accounting.push({
                                date: lineItem[1],
                                account: lineItem[2],
                                type: lineItem[20],
                                description: lineItem[3],
                                debit: Number(lineItem[7]),
                                credit: Number(lineItem[8])
                            });
                            addTransaction(lineItem[2],lineItem[20],lineItem[1],lineItem[3],Number(lineItem[7]),Number(lineItem[8]),function(results){
                                if (count++ >= total) {
                                    callback(accounting);
                                }
                                if (params.mainWindow) {
                                    let percent = Number(count / total) * 100;
                                    console.log(percent);
                                    // params.updater is mainWindow.webContents.send(param.channel,percent)
                                    params.mainWindow.webContents.send(params.channel,percent)
                                }
                            }, params.company_id, params.office_id);
                        });
                    }
                    break;
                case 'bill_items':
                    {
                        /**
                         * vendor,
                         * description, [1]
                         * invoice_num,
                         * po_so,
                         * account, [4]
                         * product,
                         * amount, [6]
                         * quantity,
                         * bill_date, [8]
                         * currency,
                         * due_date,
                         * taxes
                         */
                        var bill_items = [];
                        let total = data.length;
                        let count = 0;
                        data.forEach(function(lineItem){
                            bill_items.push({
                                date: lineItem[8],
                                description: lineItem[1],
                                amount: lineItem[6],
                                account: lineItem[4]
                            });
                            payExpenseByCard(lineItem[8],lineItem[1],lineItem[6],lineItem[4]);
                            if (params.updater) {
                                let percent = Number(count / total) * 100;
                                // params.updater is mainWindow.webContents.send(param.channel,percent)
                                params.updater(params.channel,percent)
                            }
                        });
                        callback(bill_items);
                    }
                    break;
                case 'customers':
                    {
                        /**
                         * customer_name,email,
                         * contact_first_name,
                         * contact_last_name,
                         * customer_currency,
                         * account_number,
                         * phone,
                         * fax,
                         * mobile,
                         * toll_free,
                         * website,
                         * country,
                         * province/state,
                         * address_line_1,
                         * address_line_2,
                         * city,
                         * postal_code/zip_code,
                         * shipping_address,
                         * ship-to_contact,
                         * ship-to_country,
                         * ship-to_province/state,
                         * ship-to_address_line_1,
                         * ship-to_address_line_2,
                         * ship-to_city,
                         * ship-to_postal_code/zip_code,
                         * ship-to_phone,
                         * delivery_instructions
                         */
                    }
                    break;
                case 'vendors':
                    {
                        /**
                         * vendor_name,
                         * email,
                         * contact_first_name,
                         * contact_last_name,
                         * vendor_currency,
                         * account_number,
                         * phone,
                         * fax,
                         * mobile,
                         * toll_free,
                         * website,
                         * country,
                         * province/state,
                         * address_line_1,
                         * address_line_2,
                         * city,
                         * postal_code/zip_code
                         */
                    }
                    break;
            }        

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
    import_from_waveaccounting_contents,
    import_from_quickbooks
}