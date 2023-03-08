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
        document.getElementById("main").style.display = "none";
        document.getElementById("sales-customers").style.display = "block";
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
    })
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
        document.getElementById("estimate-invnum").value = invnum;
        document.getElementById("estimate-public-url").value = `${url}/customer/invoice/?num=${invnum}`;
        if (callback) callback();
    })
}
function newEstimateNumber(callback=null) {
    SendIPC("new_invoice_number","E",function(channel,event,invnum){
        console.log(invnum)
        var url = localStorage.getItem("corporate-book-url");
        document.getElementById("estimate-invnum").value = invnum;
        document.getElementById("estimate-public-url").value = `${url}/customer/estimate/?num=${invnum}`;
        if (callback) callback();
    })
}