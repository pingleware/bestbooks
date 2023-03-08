function sales_load() {
    // add document.getElementById statements

    document.getElementById("sales-estimates-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-estimates").style.display = "block";
    });
    document.getElementById("sales-invoices-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-invoices").style.display = "block";
    });
    document.getElementById("sales-recurring-invoices-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-recurring-invoices").style.display = "block";
    });
    document.getElementById("sales-payments-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-payments").style.display = "block";
    });
    document.getElementById("sales-customer-statements-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-customer-statements").style.display = "block";
    });
    document.getElementById("sales-customers-button").addEventListener("click",function(e){
        e.preventDefault();
        var sql = `SELECT * FROM customer;`;
        SendIPC("query_sql",sql,function(channel,event,json){
            console.log(json);
            localStorage.setItem("customers",json);
            var customers = JSON.parse(json);
            console.log(customers);

            document.getElementById("sales-customers-table").innerHTML = `<tr><th>Name</th><th>EMail</th><th>Action</th></tr>`;
            customers.forEach(function(customer){
                var base64 = btoa(JSON.stringify(customer));
                document.getElementById("sales-customers-table").innerHTML += `<tr><td>${customer.name}</td><td>${customer.email}</td><td>
                <select class="w3-input w3-block" data-id="${customer.id}" data-customer="${base64}" onchange="customerAction(this)">
                    <option value="">Select</option>
                    <option value="edit">View/Edit</option>
                    <option value="delete">Delete</option>
                </td></tr>`;
            })
            document.getElementById("main").style.display = "none";
            document.getElementById("sales-customers").style.display = "block";    
        });
    });
    document.getElementById("sales-products-services-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-products-services").style.display = "block";
    });
    document.getElementById("sales-payment-terms-methods-forms-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-payment-terms").style.display = "block";
    });
    document.getElementById("sales-tax-jurisdictions-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-tax-jurisdictions").style.display = "block";
    });


    // back buttons
    document.getElementById("sales-estimates-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-estimates").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-invoices-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-invoices").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-recurring-invoices-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-recurring-invoices").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-payments-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-payments").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-customer-statements-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-customer-statements").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-customers-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-customers").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-products-services-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-products-services").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-payment-terms-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-payment-terms").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("sales-tax-jurisdictions-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("sales-tax-jurisdictions").style.display = "none";
        document.getElementById("main").style.display = "block";
    });

    // dialog acctions
    document.getElementById("add_product_action").addEventListener("click",function(e){
        e.preventDefault();

    });
    document.getElementById("add_service_action").addEventListener("click",function(e){
        e.preventDefault();

    })
    document.getElementById("add-estimate").addEventListener("click",function(e){
        e.preventDefault();
        newEstimateNumber(function(){
            document.getElementById("add-estimate-dialog-title").innerHTML = "Add New Estimate";
            document.getElementById("add-estimate-dialog-recurring").style.display = "none";
            document.getElementById("add-estimate-dialog").style.display = "block";
        })
    });
    document.getElementById("add_tax_jurisdiction").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById('add-tax-jurisdiction-dialog').style.display='block';
    });
    document.getElementById("add-invoice").addEventListener("click",function(e){
        e.preventDefault();
        newInvoiceNumber(function(){
            document.getElementById("add-estimate-dialog-title").innerHTML = "Add New Invoice";
            document.getElementById("add-estimate-dialog-recurring").style.display = "none";
            document.getElementById("add-estimate-dialog").style.display = "block";
        })
    });
    document.getElementById("add-recurring-invoice").addEventListener("click",function(e){
        e.preventDefault();
        newInvoiceNumber(function(){
            document.getElementById("add-estimate-dialog-title").innerHTML = "Add New Recurring Invoice";
            document.getElementById("add-estimate-dialog-recurring").style.display = "block";
            document.getElementById("add-estimate-dialog").style.display = "block";
        })
    });
    document.getElementById("add-customer").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById('new-customer-dialog').style.display='block';
    });
    document.getElementById("add-tax-jurisdiction").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById('sales-tax-jurisdictions-addnew-dialog').style.display='block';
    });
    document.getElementById("add_estimate_action").addEventListener("click",function(e){
        e.preventDefault();
        var formObject = getData(document.getElementById("estimate_form"));
        console.log(formObject);
        if (Number(formObject.edit_post_id) > 0) {
            // update existing estimate
        } else {
            // insert a new estimate
            var timestamp = new Date().getTime();
            var _item_no = Number(document.getElementById("estimate_items").value);
            var total = 0;
            for (let i=1; i <= _item_no; i++) {
                total += Number(document.getElementById(`item_total_${i}`).value);
            }
            var content = btoa(JSON.stringify(formObject));
            var sql = `INSERT invoice (status,txdate,number,customer,amount,taxstate,countent) VALUES ('draft','${timestamp}','${formObject.estimate_invnum}',${Number(formObject.estimate_customer)},${total},'${formObject.tax_jurisdiction}','${content}');`;
            console.log(sql);
        }
    });

    document.getElementById("add_item_row").addEventListener("click",function(e){
        e.preventDefault();
        var _item_no = Number(document.getElementById("estimate_items").value) + 1;
        document.getElementById("estimate_items").value = _item_no;
        var itemlist = '<tr>';
        itemlist += '<td><input type="text" class="w3-input" name="item_qty_'+_item_no+'" id="item_qty_'+_item_no+'" onchange="updateItem('+_item_no+')" value="0" /></td>';
        itemlist += '<td>';
        itemlist += '<input type="text" name="item_desc_'+_item_no+'" id="item_desc_'+_item_no+'" list="productservices-list"  onchange="updateItemDescription(this,'+_item_no+')" value="" />';
        itemlist += '</td>';
        itemlist += '<td><input type="text" class="w3-input" onchange="updateItem('+_item_no+')" name="item_price_'+_item_no+'" id="item_price_'+_item_no+'" value="0.00" /></td>';
        itemlist += '<td><input type="text" class="w3-input" onchange="updateItem('+_item_no+')" name="item_disc_'+_item_no+'" id="item_disc_'+_item_no+'" value="0.00" /></td>';
        itemlist += '<td><input type="text" class="w3-input w3-grey" name="item_tax_'+_item_no+'" id="item_tax_'+_item_no+'" value="0.00" readonly /></td>';
        itemlist += '<td><input type="checkbox" class="w3-input" onchange="updateItemTax('+_item_no+')" name="item_taxable_'+_item_no+'" id="item_taxable_'+_item_no+'" value="YES" /></td>';
        itemlist += '<td><input type="text" class="w3-input w3-grey" name="item_total_'+_item_no+'" id="item_total_'+_item_no+'" value="" readonly /></td>';
        itemlist += '</tr>';
        document.getElementById("estimate_itemizations").innerHTML += itemlist;
    });
    document.getElementById("add_customer_action").addEventListener("click",function(e){
        e.preventDefault();
        var formObject = getData(document.getElementById("new_customer_form"));
        console.log(formObject);

        var company_id = localStorage.getItem("company_id");

        var sql = `INSERT INTO customer (company_id,name,email,address_1,address_2,city,state,postalCode,phone,fax,ship_address_1,ship_address_2,ship_city,ship_state,ship_postalCode) VALUES
         (${company_id},'${formObject.customer_name}','${formObject.customer_email}','${formObject.customer_billing_address}','${formObject.customer_billing_address_2}','${formObject.customer_billing_city}','${formObject.customer_billing_state}','${formObject.customer_billing_zip}','${formObject.customer_phone}','${formObject.customer_fax}','${formObject.customer_shipping_address}','${formObject.customer_shipping_address_2}','${formObject.customer_shipping_city}','${formObject.customer_shipping_state}','${formObject.customer_shipping_zip}')`;

        console.log(sql);
        SendIPC("insert_sql",sql,function(channel,event,results){
            console.log(results);
            window.location.reload();
        })
    });
    document.getElementById("customer-copy-billing-address").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("customer_shipping_address").value = document.getElementById("customer_billing_address").value;
        document.getElementById("customer_shipping_address_2").value = document.getElementById("customer_billing_address_2").value;
        document.getElementById("customer_shipping_city").value = document.getElementById("customer_billing_city").value;
        document.getElementById("customer_shipping_state").value = document.getElementById("customer_billing_state").value;
        document.getElementById("customer_shipping_zip").value = document.getElementById("customer_billing_zip").value;
    });
}

function changeState(state) {
    var taxrate = state.options[state.selectedIndex].getAttribute("data-taxrate");
    document.getElementById("tax_amount").value = taxrate;
}
function changeCustomer(customer) {
    console.log(customer);
}
function setProductType(item_no) {
    var item_desc = document.getElementById("item_desc_"+item_no);
    var selectedIndex = item_desc.selectedIndex;
    var item_type = item_desc.options[selectedIndex].getAttribute("data-type");
    var item_price = item_desc.options[selectedIndex].getAttribute("data-price");
    document.getElementById("item_type_"+item_no).value = item_type;
    document.getElementById("item_price_"+item_no).value = item_price;
    updateItem(item_no);
}
function updateItem(item_no) {
    var qty = document.getElementById("item_qty_" + item_no).value;
    var price = document.getElementById("item_price_" + item_no).value;
    var discount = document.getElementById("item_disc_" + item_no).value;
    var tax_value = document.getElementById("item_tax_" + item_no).value;
    var total = (+price * +qty) - +discount + +tax_value;
    document.getElementById("item_total_" + item_no).value = total;
}
function updateItemTax(item_no) {
    var tax_rate = document.getElementById("tax_amount").value;
    var qty = document.getElementById("item_qty_" + item_no).value;
    var price = document.getElementById("item_price_" + item_no).value;
    var discount = document.getElementById("item_disc_" + item_no).value;
    var tax_value = ((qty * price) - discount) * (tax_rate / 100);
    tax_value = parseFloat(Math.round(tax_value * 100) / 100).toFixed(2);
    var taxable = document.getElementById("item_taxable_" + item_no);
    if (taxable.checked) {
        document.getElementById("item_tax_" + item_no).value = tax_value;
    } else {
        document.getElementById("item_tax_" + item_no).value = "0.00";
    }
    updateItem(item_no);
}
function updateItemDescription(element, item_no) {
    var products_services_list = document.getElementById("productservices-list");

    for (var i=0;i<products_services_list.options.length;i++) {
        if (products_services_list.options[i].value == element.value) {
            var price = products_services_list.options[i].getAttribute("data-price");
            document.getElementById('item_price_' + item_no).value = price;
            console.log(price);
            updateItem(item_no);
            break;
        }				
    }
}

function newInvoiceNumber(callback=null) {
    SendIPC("new_invoice_number","I",function(channel,event,invnum){
        console.log(invnum)
        var url = localStorage.getItem("corporate-book-url");
        document.getElementById("estimate_invnum").value = invnum;
        document.getElementById("estimate_public_url").value = `${url}/customer/invoice/?num=${invnum}`;
        if (callback) callback();
    })
}
function newEstimateNumber(callback=null) {
    SendIPC("new_invoice_number","E",function(channel,event,invnum){
        console.log(invnum)
        var url = localStorage.getItem("corporate-book-url");
        document.getElementById("estimate_invnum").value = invnum;
        document.getElementById("estimate_public_url").value = `${url}/customer/estimate/?num=${invnum}`;
        if (callback) callback();
    })
}

function customerAction(element_obj) {
    var action = element_obj.value;
    var customer_id = element_obj.getAttribute("data-id");
    var customer = JSON.parse(atob(element_obj.getAttribute("data-customer")));
    console.log([action,customer_id,customer]);
    element_obj.value = "";
}