var customer = null;

function sales_load() {
    // add document.getElementById statements

    document.getElementById("sales-estimates-button").addEventListener("click",function(e){
        e.preventDefault();
        let company_id = localStorage.getItem("company_id");
        var sql = `SELECT * FROM invoice WHERE company_id=${company_id} AND (status='draft' OR status='rejected') ORDER BY txdate DESC;`;
        SendIPC("get_estimates",sql,function(channel,event,rows){
            var estimates = JSON.parse(rows);
            console.log(estimates);
            var customers = JSON.parse(localStorage.getItem("customers"));
            console.log(customers);
            document.getElementById("sales-estimates-table").innerHTML = `<tr><th>ID</th><th>Date</th><th>Number</th><th>Customer</th><th>Amount</th><th>Tax State</th><th>Action</th></tr>`;
            document.getElementById("sales-rejected-estimates-table").innerHTML = `<tr><th>Date</th><th>Number</th><th>Customer</th><th>Amount</th><th>Action</th></tr>`;
            estimates.forEach(function(estimate){
                var txdate = new Date(estimate.txdate).toISOString();
                var customer = '';
                customers.forEach(function(_customer){
                    if (_customer.id == estimate.customer) {
                        customer = _customer.name;
                    }
                })

                if (estimate.status == "draft") {
                    document.getElementById("sales-estimates-table").innerHTML += `<tr><td>${estimate.id}</td><td>${txdate}</td><td>${estimate.number}</td><td>${customer}</td><td>${Number(estimate.amount).toFixed(2)}</td><td>${estimate.taxstate}</td><td><select class="w3-input" data-id="${estimate.id}" data-estimate="${estimate.content}" onchange="estimateAction(this)"><option value="">Select</option><option value="edit">Edit</option>
                    <option value="view">View/Print</option>
                    <option value="send">Send</option>
                    <option value="invoice">Make an Invoice</option>
                    <option value="delete">Delete</option></select></td></tr>`;
                } else if (estimate.status == "rejected") {
                    document.getElementById("sales-rejected-estimates-table").innerHTML += `<tr><td>${txdate}</td><td>${estimate.number}</td><td>${customer}</td><td>${Number(estimate.amount).toFixed(2)}</td><td><select class="w3-input" data-id="${estimate.id}" data-estimate="${estimate.content}" onchange="estimateAction(this)"><option value="">Select</option><option value="edit">Edit</option><option value="delete">Delete</option></select></td></tr>`;
                }
            })
            document.getElementById("main").style.display = "none";
            document.getElementById("sales-estimates").style.display = "block";
        });
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
        var json = localStorage.getItem("resale_products");
        if (json.length > 0) {
            const resale_products = JSON.parse(json);
            document.getElementById("inventory-resale-product-list-table").innerHTML = `<tr><th>Name</th><th>Description</th><th>Quantity</th><th>Unit Type</th><th>Cost</th><th>Price</th><th>Vendor</th><th>Action</th></tr>`;
            resale_products.forEach(function(product){
                document.getElementById("inventory-resale-product-list-table").innerHTML += `<tr>
                                                                                                <td>${product.name}</td>
                                                                                                <td>${product.description}</td>
                                                                                                <td>${product.unit_qty}</td>
                                                                                                <td>${product.unit_type}</td>
                                                                                                <td>${product.cost}</td>
                                                                                                <td>${product.price}</td>
                                                                                                <td>${product.vendor}</td>
                                                                                                <td>
                                                                                                    <select class="w3-input" onclick="productResaleAction(this)">
                                                                                                        <option value-"">Select</option>
                                                                                                        <option value="edit">Edit</option>
                                                                                                        <option value="delete">Delete</option>
                                                                                                    </select>
                                                                                                </td>
                                                                                             </tr>`;
            })
        }
        json = localStorage.getItem("resale_services");
        if (json.length > 0) {
            const resale_services = JSON.parse(json);
            document.getElementById("inventory-resale-service-list-table").innerHTML = `<tr><th>Name</th><th>Description</th><th>Quantity</th><th>Unit Type</th><th>Cost</th><th>Price</th><th>Vendor</th><th>Action</th></tr>`;
            resale_services.forEach(function(service){
                document.getElementById("inventory-resale-service-list-table").innerHTML += `<tr>
                                                                                                <td>${service.name}</td>
                                                                                                <td>${service.description}</td>
                                                                                                <td>${service.unit_qty}</td>
                                                                                                <td>${service.unit_type}</td>
                                                                                                <td>${service.cost}</td>
                                                                                                <td>${service.price}</td>
                                                                                                <td>${service.vendor}</td>
                                                                                                <td>
                                                                                                    <select class="w3-input" onclick="productResaleAction(this)">
                                                                                                        <option value-"">Select</option>
                                                                                                        <option value="edit">Edit</option>
                                                                                                        <option value="delete">Delete</option>
                                                                                                    </select>
                                                                                                </td>
                                                                                             </tr>`;
            })
        }

        document.getElementById("main").style.display = "none";
        document.getElementById("sales-products-services").style.display = "block";
    });
    document.getElementById("sales-payment-terms-methods-forms-button").addEventListener("click",function(e){
        e.preventDefault();
        var json = localStorage.getItem('payment_terms');
        if (json.length > 0) {
            var payment_terms = JSON.parse(json);
            document.getElementById("sales-payment-terms-list-table").innerHTML = `<tr><th>Name</th><th>Description</th><th>Action</th></tr>`;
            payment_terms.forEach(function(term){
                document.getElementById("sales-payment-terms-list-table").innerHTML += `<tr>
                                                                                            <td>${term.name}</td>
                                                                                            <td>${term.description}</td>
                                                                                            <td>
                                                                                                <select class="w3-input" onclick="paymentTermAction(this)">
                                                                                                    <option value="">Select</option>
                                                                                                    <option value="edit">Edit</option>
                                                                                                    <option value="delete">Delete</option>
                                                                                                </select>
                                                                                            </td>
                                                                                        </tr>`;
            })
        }
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-payment-terms").style.display = "block";
    });
    document.getElementById("sales-tax-jurisdictions-button").addEventListener("click",function(e){
        e.preventDefault();
        var json = localStorage.getItem("salestax_jurisdictions");
        if (json.length > 0) {
            var salestax_jurisdictions = JSON.parse(json);
            document.getElementById("sales-tax-jurisdictions-list-table").innerHTML = `<tr><th>State</th><th>Rate</th></tr>`;
            salestax_jurisdictions.forEach(function(jurisdiction){
                document.getElementById("sales-tax-jurisdictions-list-table").innerHTML += `<tr><td>${jurisdiction.state}</td><td>${jurisdiction.rate}</td></tr>`;
            })
        }
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
        var product_name = document.getElementById("product_name").value;
        var product_desc = document.getElementById("product_desc").value;
        var product_quantity = document.getElementById("product_quantity").value;
        var product_unit_type = document.getElementById("product_unit_type").value;
        var product_cost = document.getElementById("product_cost").value;
        var product_price = document.getElementById("product_price").value;

        var purchase_date = new Date().toISOString().split("T")[0];

        var sql = `INSERT INTO inventory (type,purchase_date,name,description,cost,price,unit_qty,unit_type) VALUES 
                    ('product.resale','${purchase_date}','${product_name}','${product_desc}',${product_cost},${product_price},${product_quantity},'${product_unit_type}')`;
        SendIPC("add_resale_product",sql,function(channel,event,results){
            window.location.reload();
        })
    });
    document.getElementById("add_service_action").addEventListener("click",function(e){
        e.preventDefault();
        var service_name = document.getElementById("service_name").value;
        var service_desc = document.getElementById("service_desc").value;
        var service_quantity = document.getElementById("service_quantity").value;
        var service_unit_type = document.getElementById("service_unit_type").value;
        var service_cost = document.getElementById("service_cost").value;
        var service_price = document.getElementById("service_price").value;

        var service_add_date = new Date().toISOString().split("T")[0];

        var sql = `INSERT INTO inventory (type,purchase_date,name,description,cost,price,unit_qty,unit_type) VALUES 
        ('service.resale','${service_add_date}','${service_name}','${service_desc}',${service_cost},${service_price},${service_quantity},'${service_unit_type}')`;
        SendIPC("add_resale_service",sql,function(channel,event,results){
            window.location.reload();
        })
    })
    document.getElementById("add-estimate").addEventListener("click",function(e){
        e.preventDefault();
        newEstimateNumber(function(){
            var json = localStorage.getItem("customers");
            if (json.length > 0) {
                const customers = JSON.parse(json);
                document.getElementById("estimate_customer").innerHTML = `<option value="">Select</option>`;
                customers.forEach(function(customer){
                    var option = new Option(`${customer.name} [${customer.email}]`,customer.id);
                    option.setAttribute("data-customer",btoa(JSON.stringify(customer)));
                    document.getElementById("estimate_customer").appendChild(option);
                })
            }
            json = localStorage.getItem("salestax_jurisdictions");
            if (json.length > 0) {
                const salestax_jurisdictions = JSON.parse(json);
                document.getElementById("tax_jurisdiction").innerHTML = `<option value="">Select</option>`;
                salestax_jurisdictions.forEach(function(jurisdiction){
                    var option = new Option(jurisdiction.state,jurisdiction.state);
                    option.setAttribute("data-taxrate",jurisdiction.rate);
                    document.getElementById("tax_jurisdiction").appendChild(option);
                })
            }
            json = localStorage.getItem("payment_terms");
            if (json.length > 0) {
                const payment_terms = JSON.parse(json);
                document.getElementById("net_terms").innerHTML = `<option value="">Select</option>`;
                payment_terms.forEach(function(term){
                    var option = new Option(`${term.name} [${term.description}]`,term.name);
                    option.setAttribute("data-id",term.id);
                    document.getElementById("net_terms").appendChild(option);
                })
            }
            var resale_html = '<optgroup>Product(s)</optgroup>';
            json = localStorage.getItem("resale_products");
            if (json.length > 0) {
                const resale_products = JSON.parse(json);
                resale_products.forEach(function(product){
                    resale_html += `<option data-price="${product.price}">${product.description}</option>`;
                })
            }
            resale_html += '<optgroup>Service(s)</optgroup>';
            json = localStorage.getItem("resale_services");
            if (json.length > 0) {
                const resale_services = JSON.parse(json);
                resale_services.forEach(function(service){
                    resale_html += `<option data-price="${service.price}">${service.description}</option>`;
                })
            }
            document.getElementById("productservices-list").innerHTML = resale_html;

            document.getElementById("add-estimate-dialog-title").innerHTML = "Add New Estimate";
            document.getElementById("add-estimate-dialog-recurring").style.display = "none";
            document.getElementById("add-estimate-dialog").style.display = "block";
        })
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
            var tax = 0;
            var subtotal = 0;
            for (let i=1; i <= _item_no; i++) {
                total += Number(document.getElementById(`item_total_${i}`).value);
                tax += Number(document.getElementById(`item_tax_${i}`).value);
                subtotal += Number(document.getElementById(`item_total_${i}`).value) - Number(document.getElementById(`item_tax_${i}`).value);
            }
            var content = btoa(JSON.stringify(formObject));
            var sql = `INSERT INTO invoice (company_id,status,txdate,number,customer,amount,taxstate,content) VALUES (${company.id},'draft','${timestamp}','${formObject.estimate_invnum}',${Number(formObject.estimate_customer)},${total},'${formObject.tax_jurisdiction}','${content}');`;
            console.log(sql);
            var params = {
                sql: sql,
                form: formObject,
                customer: customer,
                company: company,
                prices: {
                    subtotal: subtotal, 
                    tax: tax, 
                    shipping: Number(formObject.shipping), 
                    other: Number(formObject.other),     
                    total: Number(total) + Number(formObject.shipping) + Number(formObject.other)
                }
            }
            console.log(params);
            SendIPC("save_estimate",params,function(channel,event,results){
                window.location.reload();
            })
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
        return false;
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
    document.getElementById("add_invoice_payment_term").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("payment-terms-dialog").style.display = 'block';
    });
    document.getElementById("payment-terms-dialog-add").addEventListener("click",function(e){
        e.preventDefault();
        var name = document.getElementById("payment-terms-dialog-name").value;
        var description = document.getElementById("payment-terms-dialog-description").value;
        var sql = `INSERT INTO payment_terms (name,description) VALUES ('${name}','${description}');`;
        console.log(sql);
        SendIPC("add_payment_term",sql,function(channel,evetm,result){
            window.location.reload();
        })
        document.getElementById("payment-terms-dialog-name").value = "";
        document.getElementById("payment-terms-dialog-description").value = "";
    });
    document.getElementById("add_invoice_payment_method").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("payment-method-dialog").style.display = 'block';
    });
    document.getElementById("payment-method-dialog-add").addEventListener("click",function(e){

    });

    document.getElementById("add-tax-jurisdiction-now").addEventListener("click",function(e){
        e.preventDefault();
        var state = document.getElementById("add-tax-jurisdiction-dialog-state").value;
        var rate = document.getElementById("add-tax-jurisdiction-dialog-rate").value;
        var url = document.getElementById("add-tax-jurisdiction-dialog-url").value;
        var sql = `INSERT INTO sales_tax (state,rate,url) VALUES ('${state}',${rate},'${url}')`;
        SendIPC("add_salestax_jurisdiction",sql,function(channel,event,results){
            window.location.reload();
        })
    })
    document.getElementById("add-estimate-dialog-generate").addEventListener("click",function(e){
        e.preventDefault();
        var randomstring = Math.random().toString(36).slice(-8);
        document.getElementById("estimate_password").value = randomstring;
        return false;
    })
}

function changeState(state) {
    var taxrate = state.options[state.selectedIndex].getAttribute("data-taxrate");
    document.getElementById("tax_amount").value = taxrate;
}
function changeCustomer(customer_obj) {
    var base64 = customer_obj.options[customer_obj.selectedIndex].getAttribute("data-customer");
    var json = atob(base64);
    customer = JSON.parse(json);
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
    const timestamp = new Date();
    const invnum = 'I' + timestamp.getTime() + Math.random();
    var url = localStorage.getItem("corporate-book-url");
    document.getElementById("estimate_invnum").value = invnum;
    document.getElementById("estimate_public_url").value = `${url}/customer/invoice/?num=${invnum}`;
    if (callback) callback();

    //SendIPC("new_invoice_number","I",function(channel,event,invnum){
    //    console.log(invnum)
    //    var url = localStorage.getItem("corporate-book-url");
    //    document.getElementById("estimate_invnum").value = invnum;
    //    document.getElementById("estimate_public_url").value = `${url}/customer/invoice/?num=${invnum}`;
    //    if (callback) callback();
    //})
}
function newEstimateNumber(callback=null) {
    const timestamp = new Date();
    const invnum = 'E' + timestamp.getTime() + Math.random();
    var url = localStorage.getItem("corporate-book-url");
    document.getElementById("estimate_invnum").value = invnum;
    document.getElementById("estimate_public_url").value = `${url}/customer/estimate/?num=${invnum}`;
    if (callback) callback();

    //SendIPC("new_invoice_number","E",function(channel,event,invnum){
    //    console.log(invnum)
    //    var url = localStorage.getItem("corporate-book-url");
    //    document.getElementById("estimate_invnum").value = invnum;
    //    document.getElementById("estimate_public_url").value = `${url}/customer/estimate/?num=${invnum}`;
    //    if (callback) callback();
    //})
}

function customerAction(element_obj) {
    var action = element_obj.value;
    var customer_id = element_obj.getAttribute("data-id");
    var customer = JSON.parse(atob(element_obj.getAttribute("data-customer")));
    console.log([action,customer_id,customer]);
    element_obj.value = "";
}

function estimateAction(element_obj) {
    var action = element_obj.value;
    var estimate_id = element_obj.getAttribute("data-id");
    var estimate = JSON.parse(atob(element_obj.getAttribute("data-estimate")));
    console.log([action,estimate_id,estimate]);
    switch(action) {
        case 'edit':
            // popup edit dialog
            break;
        case 'view':
            // invoke bestbooks-reports to create a HTML estimate to view
            break;
        case 'send':
            // invoke bestbooks-reportes to create a HTML estimate and then invoice bestbooks-mailer to send the HTML
            break;
        case 'invoice':
            // change status to "invoice"
            break;
        case 'delete':
            // popup delete confirmation, then IPC delete estimate by estimate.id reference
            break;
    }
    element_obj.value = "";
}