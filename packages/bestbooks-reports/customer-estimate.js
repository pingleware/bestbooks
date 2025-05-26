"use strict"

const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class CustomerEstimate extends BaseReport {
    constructor() {
        super()
    }

    saveReport(name, contents, type="xml",callback=null){
        const filePath = path.join(os.homedir(),`.bestbooks/${name}.${type}`);
        // the xslt-processor does not support the XSLT syntax xsl:for-each-group, 
        // so the XML generated is returned,
        // using a free tool like https://xslttest.appspot.com/, 
        // to copy the .bestbooks/balance-sheet.xslt and .bestbooks/balance-sheet.xml
        // to render a HTML
        // TODO: implement xsl:for-each-group. callback(format("balanceSheet",formattedData));

        fs.writeFileSync(filePath, contents);
        callback(filePath)
    }

    async saveReportSync(name, html, type) {
        return new Promise((resolve,reject) => {
            try {
                this.saveReport(name, html, type, function(filePath){
                    resolve(filePath);
                })    
            } catch(error) {
                reject(error);
            }
        })
    }

    async formatHtml(formattedData) {
        return format("customerEstimate",formattedData);
    }

    async formatXml(contents) {
        return array2xml("customerEstimate",contents);
    }

    async formatArray(data,notes="") {
        return data;
    }

    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate, endDate));
    }

    async retrieveReportDataSync(startDate, endDate, company_id=0, customer_id=0, metadata=null) {
        var sql = `SELECT c.name,u.* FROM company c JOIN users u ON c.id=u.company_id WHERE c.id=?`;;
        var params = [company_id];
        const company = await this.model.querySync(sql,params);
        sql = `SELECT * FROM users WHERE id=?`;
        params = [customer_id];
        const customer = await this.model.querySync(sql,params);

        return  {
            number: metadata.number,
            date: metadata.date,
            company: {
                name: company[0].name,
                contact: company[0].display_name, 
                email: company[0].user_email, 
                phone: company[0].phone, 
                website: metadata.company.website, 
                address1: metadata.company.address1, 
                address2: metadata.company.address2, 
                city: metadata.company.city, 
                state: metadata.company.state, 
                zipcode: metadata.company.zipcode, 
                fax: metadata.company.fax
            }, 
            customer: {
                id: customer[0].id,
                name: customer[0].display_name,
                email: customer[0].user_email,
                contact: customer[0].display_name,
                address1: metadata.customer.address1,
                address2: metadata.customer.address2,
                city: metadata.customer.city,
                state: metadata.customer.state,
                zipcode: metadata.customer.zipcode,
                phone: customer[0].phone,
                fax: metadata.customer.fax,
                shipping: metadata.customer.shipping
            }, 
            terms: metadata.terms,
            tax: metadata.tax,
            duedate: metadata.duedate,
            lineitems: metadata.lineitems, 
            comments: metadata.comments, 
            prices: metadata.prices,
            payment: metadata.payment
        }
    };
}

module.exports = CustomerEstimate;