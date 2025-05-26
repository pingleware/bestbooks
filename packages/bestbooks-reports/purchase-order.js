"use strict"

const BaseReport = require('./report');
const {format, array2xml} = require('./formatReport');
const os = require('os');
const fs = require('fs');
const path = require('path');

class PurchaseOrder extends BaseReport {
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
        return format("purchaseOrder",formattedData);
    }

    async formatXml(contents) {
        return array2xml("purchaseOrder",contents);
    }
    
    async formatArray(data,notes) {
        var lineItems = [];
        let subtotal = 0;
        let total = 0;
        var _data = {
            number: data.number,
            date: data.date,
            company: data.company,
            vendor: data.vendor,
            shipping: data.shipping,
            lineItems: [],
            prices: {
                subtotal: subtotal,
                tax: 0,
                shipping: Number(data.prices.shipping).toFixed(2),
                other: Number(data.prices.other).toFixed(2),
                total: total    
            },
            comments: data.comments,
            payment: data.payment,  
            notes: notes
        };

        data.lineitems.forEach(function(lineItem){
            subtotal += Number(lineItem.amount);
            lineItems.push({
                quantity: lineItem.quantity,
                description: lineItem.description,
                unitprice: Number(lineItem.unitprice).toFixed(2),
                amount: Number(lineItem.amount).toFixed(2)
            })
        })

        total = Number(subtotal) + (Number(subtotal) * Number(data.prices.tax)) + Number(data.prices.shipping) + Number(data.prices.other);

        _data.lineItems = { lineitem: lineItems };
        _data.prices.tax = (Number(subtotal) * Number(data.prices.tax)).toFixed(2);
        _data.prices.subtotal = Number(subtotal).toFixed(2);
        _data.prices.total = Number(total).toFixed(2);

        return _data;
    }
    
    retrieveReportData(startDate,endDate,callback) {
        callback(this.retrieveReportDataSync(startDate, endDate));
    }

    async retrieveReportDataSync(startDate, endDate, company_id=0, vendor_id=0, metadata=null){
        var sql = `SELECT c.name,u.* FROM company c JOIN users u ON c.id=u.company_id WHERE c.id=?`;;
        var params = [company_id];
        const company = await this.model.querySync(sql,params);
        sql = `SELECT * FROM users WHERE id=?`;
        params = [vendor_id];
        const vendor = await this.model.querySync(sql,params);

        return  {
            number: metadata.number,
            date: startDate,
            company: {
                name: company[0].name,
                contact: company[0].display_name, 
                email: company[0].user_email, 
                phone: company[0].phone, 
                website: metadata.company.website, 
                billing: metadata.company.billing, 
                shipping: metadata.company.shipping
            }, 
            vendor: {
                id: 1,
                name: vendor[0].display_name,
                email: vendor[0].user_email,
                contact: vendor[0].display_name,
                address1: metadata.vendor.address1,
                address2: metadata.vendor.address2,
                city: metadata.vendor.city,
                state: metadata.vendor.state,
                zipcode: metadata.vendor.zipcode,
                phone: metadata.vendor.phone,
                fax: metadata.vendor.fax
            }, 
            shipping: {
                service: metadata.shipping.service, 
                method: metadata.shipping.method, 
                deliverydate: endDate
            },
            lineitems: metadata.lineitems, 
            comments: metadata.comments, 
            prices: metadata.prices,
            payment: metadata.payment
        };
    }
}

module.exports = PurchaseOrder;