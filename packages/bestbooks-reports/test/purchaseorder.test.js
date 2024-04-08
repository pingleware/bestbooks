var expect    = require("chai").expect;

const { init, PurchaseOrder } = require("../index");
const fs = require('fs');
const os = require('os');
const path = require('path');


describe("purchase order", function(){
    before(function(){
        init();
    });
    it("purchase order form", function(){
        var purchaseOrder = new PurchaseOrder();
        var purchaseOrderInfo = {
            number: "PO-20230226-001",
            date: new Date().toISOString().split('T')[0],
            company: {
                name: "PRESSPAGE ENTERTAINMENT INC",
                contact: "PATRICK INGLE", 
                email: "presspage.entertainment@gmail.com", 
                phone: "212-879-0758", 
                website: "https://support.pingleware.work", 
                billing: { 
                    address1: "PO Box 142814", 
                    address2: "", 
                    city: "Gainesville", 
                    state: "FL", 
                    zipcode: "32614-2814", 
                    phone: "212-879-0758", 
                    fax: "212-879-0758"
                }, 
                shipping: {
                    contact: "PATRICK INGLE", 
                    address1: "4055 SW 15 PL",
                    address2: "Apt G",
                    city: "Gainesville",
                    state: "FL",
                    zipcode: "32607",
                    phone: "212-879-0758",
                    fax: "212-879-0758"
                }
            }, 
            vendor: {
                id: 1,
                name: "A Vendor",
                email: "admin@vendor.vendor",
                contact: "John A. Doe",
                address1: "One Commerce Way",
                address2: "Suite 100",
                city: "New York",
                state: "NY",
                zipcode: "10001",
                phone: "212-555-1212",
                fax: "212-555-1212"
            }, 
            shipping: {
                service: "UPS", 
                method: "GROUND", 
                deliverydate: "2023-05-09"
            },
            lineitems: {
                lineitem: [
                    {
                        quantity: 1,
                        description: "Widget One",
                        unitprice: 10.00,
                        amount: 10.00
                    },
                    {
                        quantity: 3,
                        description: "Widget Two",
                        unitprice: 5.00,
                        amount: 15.00
                    }
                ]
            }, 
            comments: "Leave at door", 
            prices: {
                subtotal: 25.00, 
                tax: 1.50, 
                shipping: 5.00, 
                other: 0.00, 
                total: 31.50
            },
            payment: {
                amount: 0.00,
                method: 'NOT PAID',
                confirmation: 'None'
            }
        };
        
        purchaseOrder.createReport(purchaseOrderInfo,function(html){
            fs.writeFileSync('purchase-order.html',html);
        });
    })
})


