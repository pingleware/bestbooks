"use strict"

const {ipcMain} = require('electron');

let mainWindow;

// IPC communication between view and node
ipcMain.on('open_browser', function(evt, url){
    var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + url);
    mainWindow.webContents.send('open_browser','success');
});

ipcMain.on('error', function(evt, data){
    mainWindow.webContents.send('error',data);
});

ipcMain.on('run_script', function(evt, fullPathname){
    require('child_process').exec(fullPathname);
    mainWindow.webContents.send('run_script','success');
})

ipcMain.on('add_company', async function(evt, json){
    var data = JSON.parse(json);

    const {Company, Model} = require('@pingleware/bestbooks-core');
    var company = new Company();
    company.addCompany(data.name,data.note,
        function(lastID, changes){
            var result = {
                lastID: lastID,
                changes: changes
            };
            var model = new Model();
            var sql = `INSERT INTO company_metadata (company_id) VALUES (${lastID});`;
            model.insert(sql,function(nthing){
                mainWindow.webContents.send('add_company',JSON.stringify(result));
            })
        });
});
ipcMain.on("update_company", function(evt, json){
    var data = JSON.parse(json);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `UPDATE company_metadata SET address1='${data.address1}',address2='${data.address2}',city='${data.city}',state='${data.state}',zipcode='${data.zipcode}',contact='${data.contact}',email='${data.email}',phone='${data.phone}',fax='${data.fax}',website='${data.website}' WHERE company_id=${data.id};`;
    model.insert(sql,function(results){
        mainWindow.webContents.send('update_company',JSON.stringify(results));
    })
})
ipcMain.on("get_companies",function(evt,params){
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    // get commpanies with metadata
    model.query("SELECT c.*,m.address1,m.address2,m.city,m.state,m.zipcode,m.contact,m.email,m.phone,m.fax,m.website FROM company c JOIN company_metadata m ON c.id=m.company_id",function(rows){
        //localStorage.setItem('companies',JSON.stringify(rows));
        mainWindow.webContents.send("get_companies",JSON.stringify(rows));
    });
})
ipcMain.on("get_customers",function(evt,company_id){
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    //get customers
    model.query(`SELECT * FROM customer WHERE companf_id=${company_id}`,function(rows){
        //localStorage.setItem('customers',JSON.stringify(rows));
        mainWindow.webContents.send("get_customers",JSON.stringify(rows));
    });  
})
ipcMain.on("add_account", function(evt, json){
    var data = JSON.parse(json);
    const { ChartOfAccounts } = require("@pingleware/bestbooks-core");
    var coa = new ChartOfAccounts();
    let lastID = coa.add(data.name,data.type,data.company);
    mainWindow.webContents.send('add_account',JSON.stringify(lastID));
});

ipcMain.on("get_accounts_by_company", function(evt, company_id){
    const { ChartOfAccounts } = require("@pingleware/bestbooks-core");
    var coa = new ChartOfAccounts();
    coa.getList(company_id, function(accounts){
        mainWindow.webContents.send("get_accounts_by_company",JSON.stringify(accounts));
    });
});

ipcMain.on("accounting_budget", function(evt,json){
    var params = JSON.parse(json);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `UPDATE accounts SET Bud01=${params.budget_01},
                                      Bud02=${params.budget_02},
                                      Bud03=${params.budget_03},
                                      Bud04=${params.budget_04},
                                      Bud05=${params.budget_05},
                                      Bud06=${params.budget_06},
                                      Bud07=${params.budget_07},
                                      Bud08=${params.budget_08},
                                      Bud09=${params.budget_09},
                                      Bud10=${params.budget_10},
                                      Bud11=${params.budget_11},
                                      Bud12=${params.budget_12},
                                      Bud13=${params.budget_13},
                                      Bud14=${params.budget_14},
                                      Bud15=${params.budget_15},
                                      Bud16=${params.budget_16},
                                      Bud17=${params.budget_17},
                                      Bud18=${params.budget_18},
                                      Bud19=${params.budget_19},
                                      Bud20=${params.budget_20},
                                      Bud21=${params.budget_21},
                                      Bud22=${params.budget_22},
                                      Bud23=${params.budget_23},
                                      Bud24=${params.budget_24} 
                                      WHERE id=${params.account}`;
    var result = model.updateSync(sql);
    mainWindow.webContents.send("accounting_budget",JSON.stringify(result));
});

ipcMain.on("accounting_balance",function(evt,json){
    var params = JSON.parse(json);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `UPDATE accounts SET Bal01=${params.balance_01},
                                      Bal02=${params.balance_02},
                                      Bal03=${params.balance_03},
                                      Bal04=${params.balance_04},
                                      Bal05=${params.balance_05},
                                      Bal06=${params.balance_06},
                                      Bal07=${params.balance_07},
                                      Bal08=${params.balance_08},
                                      Bal09=${params.balance_09},
                                      Bal10=${params.balance_10},
                                      Bal11=${params.balance_11},
                                      Bal12=${params.balance_12},
                                      Bal13=${params.balance_13},
                                      Bal14=${params.balance_14},
                                      Bal15=${params.balance_15},
                                      Bal16=${params.balance_16},
                                      Bal17=${params.balance_17},
                                      Bal18=${params.balance_18},
                                      Bal19=${params.balance_19},
                                      Bal20=${params.balance_20},
                                      Bal21=${params.balance_21},
                                      Bal22=${params.balance_22},
                                      Bal23=${params.balance_23},
                                      Bal24=${params.balance_24} 
                                      WHERE id=${params.account}`;

    
    var result = model.updateSync(sql);
    mainWindow.webContents.send("accounting_balance",JSON.stringify(result));
});

ipcMain.on("account_balances", function(evt,id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT Bal01,Bal02,Bal03,Bal04,Bal05,Bal06,Bal07,Bal08,Bal09,Bal10,Bal11,Bal12,Bal13,Bal14,Bal15,Bal16,Bal17,Bal18,Bal19,Bal20,Bal21,Bal22,Bal23,Bal24 FROM accounts WHERE id=${id};`;
    model.query(sql, function(data){
        mainWindow.webContents.send('account_balances',JSON.stringify(data));
    })
});

ipcMain.on("account_budgets", function(evt,id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT Bud01,Bud02,Bud03,Bud04,Bud05,Bud06,Bud07,Bud08,Bud09,Bud10,Bud11,Bud12,Bud13,Bud14,Bud15,Bud16,Bud17,Bud18,Bud19,Bud20,Bud21,Bud22,Bud23,Bud24 FROM accounts WHERE id=${id};`;
    model.query(sql, function(data){
        mainWindow.webContents.send('account_budgets',JSON.stringify(data));
    })
})

ipcMain.on("delete_account", function(evt, name){
    const { ChartOfAccounts } = require("@pingleware/bestbooks-core");
    var coa = new ChartOfAccounts();
    var status = coa.remove(name);
    mainWindow.webContents.send("delete_account",JSON.stringify(status));
});

ipcMain.on("add_transaction", function(evt, json){
    var data = JSON.parse(json);
    const { addTransaction } = require("@pingleware/bestbooks-helpers");
    var date = new Date(data.date + ' ' + data.time);
    var txdate = date.toISOString();
    if (data.id > 0) {
        const { Model } = require("@pingleware/bestbooks-core");
        var model = new Model();
        var balance = Number(data.debit) - Number(data.credit);
        var sql = `UPDATE ledger SET company_id=${Number(data.company)},account_name='${data.name}',txdate='${txdate}',note='${data.description}',ref=${data.ref},debit=${Number(data.debit)},credit=${Number(data.credit)},balance=${balance} WHERE id=${data.id};`;
        model.insert(sql, function(results){
            mainWindow.webContents.send("add_transaction",JSON.stringify(results));
        });
    } else {
        addTransaction(data.name,data.type,txdate,data.description,data.debit,data.credit,
            function(status){
                mainWindow.webContents.send("add_transaction",JSON.stringify(status));
            },data.company,0);        
    }
});

ipcMain.on("get_transactions", function(evt, json){
    var params = JSON.parse(json);
    var company_id = params.company;
    var start = params.start;
    var limit = params.limit;
    var start_date = params.start_date;
    var end_date = params.end_date;
    // SELECT id,account_name,account_code,note,ref,debit,credit,balance FROM ledger WHERE company_id=1
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var between = ``;
    if (start_date.length > 0 && end_date.length > 0) {
        between = ` AND txdate >= ${start_date} AND txdate < ${end_date}`;
    } else if (start_date.length > 0 && end_date.length == 0) {
        between = ` AND txdate >= ${start_date} `;
    } else if (start_date.length == 0 && end_date.length > 0) {
        between = ` AND txdate < ${end_date}`;
    }
    var sql = `SELECT id,txdate AS date,account_name AS name,account_code AS code,note,ref,debit,credit,balance,(SELECT COUNT(id) FROM Ledger WHERE company_id=${company_id}) ${between} AS total FROM ledger WHERE company_id=${company_id} LIMIT ${start},${limit};`;
    model.query(sql, function(results){
        mainWindow.webContents.send("get_transactions",JSON.stringify(results));
    })
});

ipcMain.on('delete_transaction', function(evt, id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `DELETE FROM ledger WHERE id=${id};`;
    model.insert(sql, function(results){
        mainWindow.webContents.send('delete_transaction',JSON.stringify(results));
    });

});

ipcMain.on("add_journal_transaction", function(evt, json){
    var params = JSON.parse(json);
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var date = new Date(params.date + ' ' + params.time);
    var txdate = date.toISOString();
    var sql = `INSERT INTO journal (company_id,office_id,txdate,account,ref,debit,credit) 
                VALUES (${params.company},${params.office},'${txdate}','${params.name}',${Number(params.ref)},${Number(params.debit)},${Number(params.credit)});`;

    if (params.id > 0) {
        sql = `UPDATE journal SET txdate='${txdate}',account='${params.name}',ref=${Number(params.ref)},debit=${Number(params.debit)},credit=${Number(params.credit)} WHERE id=${params.id};`
    }
    model.insert(sql,function(results){
        mainWindow.webContents.send('add_journal_transaction',JSON.stringify(results));
    });
});

ipcMain.on("get_journal_transactions", function(evt, company_id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `SELECT * FROM journal WHERE company_id=${company_id}`;
    model.query(sql, function(results){
        mainWindow.webContents.send("get_journal_transactions",JSON.stringify(results));
    })
})

ipcMain.on('delete_journal_transaction', function(evt,id){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    var sql = `DELETE FROM journal WHERE id=${id};`;
    model.insert(sql, function(results){
        mainWindow.webContents.send('delete_journal_transaction',JSON.stringify(results));
    });
});

ipcMain.on("report_balancesheet", function(evt, json){
    try {
        const { BalanceSheet } = require("@pingleware/bestbooks-reports");
        var params = JSON.parse(json);
        var data = BalanceSheet.retrieveReportData(params.startDate,params.endDate);
        mainWindow.webContents.send("report_balancesheet",JSON.stringify(data));    
    } catch(error) {
        mainWindow.webContents.send("report_balancesheet",JSON.stringify(error));
    }
});
ipcMain.on("report_incomestatement", function(evt, json){
    try {
        const { IncomeStatement } = require("@pingleware/bestbooks-reports");
        var params = JSON.parse(json);
        var data = IncomeStatement.retrieveReportData(params.startDate,params.endDate);
        mainWindow.webContents.send("report_incomestatement",JSON.stringify(data));    
    } catch(error) {
        mainWindow.webContents.send("report_incomestatement",JSON.stringify(error));
    }
});
ipcMain.on("report_trialbalance", function(evt, json){
    try {
        const { TrialBalance } = require("@pingleware/bestbooks-reports");
        var params = JSON.parse(json);
        var data = TrialBalance.retrieveReportData(params.startDate,params.endDate);
        mainWindow.webContents.send("report_trialbalance",JSON.stringify(data));    
    } catch(error) {
        mainWindow.webContents.send("report_trialbalance",JSON.stringify(error));
    }
});
ipcMain.on("import", function(evt, json){
    const { import_from_waveaccounting } = require('@pingleware/bestbooks-import');
    var params = JSON.parse(json);
    if (params.type == "waveaccounting") {
        params.mainWindow = mainWindow;
        params.channel = 'import_progress';
        import_from_waveaccounting(params,params.contents,function(data){
            mainWindow.webContents.send('import',JSON.stringify(data));
        })
    } else {
        mainWindow.webContents.send("error","Unknown import type");
    }
});

var _nonce = {
    nonce: "",
    expiration: 0
};

ipcMain.on("nonce",function(evt,params){
    const crypto = require('crypto');
    let nonce = crypto.randomBytes(16).toString('base64');
    let expiration = new Date(Date.now() + 5 * (60 * 60 * 1000) );
    _nonce.nonce = nonce;
    _nonce.expiration = expiration;
    mainWindow.webContents.send("nonce",nonce);
})

ipcMain.on("new_invoice_number",function(evt,params){
    var sql = `SELECT count(id) AS total FROM invoice;`;
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    model.query(sql,function(rows){
        var invoice_num = `0000${Number(rows[0].total) + 1}`.substring(-4);
        var now = new Date().toISOString().split("T")[0].replace("-","");
        invoice_num = `${params}${now}-${invoice_num}`;
        mainWindow.webContents.send("new_invoice_number",invoice_num);
    });
})
ipcMain.on("get_purchaseorders",function(evt,params){
    var sql = `SELECT * FROM report WHERE name='purchase-order' ORDER BY txdate DESC;`;    
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    model.query(sql,function(rows){
        mainWindow.webContents.send("get_purchaseorders",rows);
    });
})
ipcMain.on("transform_purchaseorder",function(evt,xml){
    try {
        const { init, PurchaseOrder } = require("@pingleware/bestbooks-reports");
        init();
        const purchaseOrder = new PurchaseOrder();
        purchaseOrder.createReportFromXML(xml,function(html){
            mainWindow.webContents.send("transform_purchaseorder",html);
        })    
    } catch(error) {
        mainWindow.webContents.send("error",error.message);
    }
})
ipcMain.on("new_purchaseorder_number",function(evt,params){
    var sql = `SELECT count(id) AS total FROM purchase;`;
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    model.query(sql,function(rows){
        var purchaseorder_num = `000000${Number(rows[0].total) + 1}`.substring(-6);
        var now = new Date().toISOString().split("T")[0].replace("-","");
        purchaseorder_num = `${params}${now}-${purchaseorder_num}`;
        mainWindow.webContents.send("new_purchaseorder_number",purchaseorder_num);
    });
})
ipcMain.on("insert_sql",function(evt,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    model.insert(sql,function(results){
        mainWindow.webContents.send("insert_sql",JSON.stringify(results));
    })
})
ipcMain.on("query_sql",function(evt,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    model.query(sql,function(rows){
        mainWindow.webContents.send("query_sql",JSON.stringify(rows));
    })
})
ipcMain.on("add_salestax_jurisdiction",function(evt,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    model.query(sql,function(rows){
        mainWindow.webContents.send("add_salestax_jurisdiction",JSON.stringify(rows));
    })
})
ipcMain.on("add_payment_term",function(event,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    model.query(sql,function(rows){
        mainWindow.webContents.send("add_payment_term",JSON.stringify(rows));
    })
})
ipcMain.on("add_resale_product",function(event,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    model.insert(sql,function(results){
        mainWindow.webContents.send("add_resale_product",JSON.stringify(results));
    })
})
ipcMain.on("add_resale_service",function(event,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    var model = new Model();
    model.insert(sql,function(results){
        mainWindow.webContents.send("add_resale_service",JSON.stringify(results));
    })
})
ipcMain.on("save_estimate",function(event,params){
    const { Model } = require("@pingleware/bestbooks-core");

    var model = new Model();
    model.insert(params.sql,function(results){
        mainWindow.webContents.send("save_estimate",JSON.stringify(results));
    });
})
ipcMain.on("get_estimates",function(evt,sql){
    const { Model } = require("@pingleware/bestbooks-core");
    const model = new Model();
    model.query(sql,function(results){
        mainWindow.webContents.send("get_estimates",JSON.stringify(results));
    })
})
ipcMain.on("send_estimate",function(evt,params){
    const { CustomerEstimate } = require("@pingleware/bestbooks-reports");
    //const { SendEMail, SaveToDatabase } = require("@pingleware/bestbooks-mailer");

    var recipient = params.customer.email;

    var customer_contact = params.customer.name;
    if (params.customer.poc_firstname && params.customer.poc_lastname) {
        customer_contact = params.customer.poc_firstname + ' ' + params.customer.poc_lastname;
    }
    var ship_phone = params.customer.phone;
    if (params.customer.ship_phone) {
        ship_phone = params.customer.ship_phone;
    }

    var customerEstimateInfo = {
        number: params.form.estimate_invnum,
        date: params.txdate,
        company: {
            name: params.company.name,
            contact: params.company.contact, 
            email: params.company.email, 
            website: params.company.website, 
            address1: params.company.address1, 
            address2: params.company.address2, 
            city: params.company.city, 
            state: params.company.state, 
            zipcode: params.company.zipcode, 
            phone: params.company.phone, 
            fax: params.company.fax
        }, 
        customer: {
            id: params.customer.id,
            name: params.customer.name,
            email: recipient,
            contact: customer_contact,
            address1: params.customer.address_1,
            address2: params.customer.address_2,
            city: params.customer.city,
            state: params.customer.state,
            zipcode: params.customer.postalCode,
            phone: params.customer.phone,
            fax: params.customer.fax,
            shipping: {
                contact: customer_contact, 
                address1: params.customer.ship_address_1,
                address2: params.customer.ship_address_2,
                city: params.customer.ship_city,
                state: params.customer.ship_state,
                zipcode: params.customer.ship_postalCode,
                phone: ship_phone,
                fax: params.customer.fax
            }
        }, 
        terms: params.form.net_terms,
        tax: params.form.tax_jurisdiction,
        duedate: params.form.due_date,
        lineitems: {
            lineitem: []
        }, 
        comments: params.form.add_terms, 
        prices: {
            subtotal: Number(params.prices.subtotal).toFixed(2), 
            tax: Number(params.prices.tax).toFixed(2), 
            shipping: Number(params.prices.shipping).toFixed(2), 
            other: Number(params.prices.other).toFixed(2), 
            total: Number(params.prices.total).toFixed(2)
        },
        payment: {
            amount: 0.00,
            method: 'NOT PAID',
            confirmation: 'None'
        }
    };
    var lineitems = [];
    for (let i=1; i <= Number(params.form.estimate_items); i++) {
        lineitems.push(
            {
                quantity: Number(params.form[`item_qty_${i}`]),
                description: params.form[`item_desc_${i}`],
                unitprice: Number(params.form[`item_price_${i}`]).toFixed(2),
                discount: Number(params.form[`item_disc_${i}`]).toFixed(2),
                tax: Number(params.form[`item_tax_${i}`]).toFixed(2),
                total: Number(params.form[`item_total_${i}`]).toFixed(2)
            }
        )
    }
    customerEstimateInfo.lineitems.lineitem = lineitems;
    var customerEstimate = new CustomerEstimate();

    customerEstimate.createReport(customerEstimateInfo,function(html){
        fs.writeFileSync('customer-estimate.html',html);
        var subject = `New Estimate #${params.formObject.invoice_num}`;
        SendEMail(company.sender,recipient,subject,message,25,function(results){
            SaveToDatabase("sent",company.sender,recipient,customerEstimateInfo.date,subject,html,html.envelop,function(results){
                mainWindow.webContents.send("send_estimate",JSON.stringify(results));
            })
        });    
    });
})

module.exports = {
    _mainWindow: mainWindow
}