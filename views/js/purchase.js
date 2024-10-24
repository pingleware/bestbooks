function purchases_load() {
        // add document.getElementById statements
        document.getElementById("purchases-purchaseorders-button").addEventListener("click",function(e){
                e.preventDefault();
                SendIPC("get_purchaseorders",{},function(channel,event,purchaseorders){
                        console.log(purchaseorders);
                        document.getElementById("purchaseorder-list-table").innerHTML = `<tr><th>Date</th><th>PO Number</th><th>Amount</th><th>Status</th><th>Action</th></tr>`;
                        purchaseorders.forEach(function(purchaseOrder){
                                var txdate = new Date(purchaseOrder.txdate).toISOString().split("T")[0]
                                var contents = atob(purchaseOrder.contents);
                                var json = parseXmlToJson(contents);
                                document.getElementById("purchaseorder-list-table").innerHTML += `<tr><td>${txdate}</td><td>${json.number}</td><td>${json.amount}</td><td>${json.method}</td><td><select onchange="purchaseOrder(this)" data-ponum="${json.number}" data-contents="${contents}"><option value="">Select</option><option value="view">View</option></select></td></tr>`;
                        })
                        document.getElementById("main").style.display = "none";
                        document.getElementById("purchases-purchaseorders").style.display = "block";        
                })
        });
        document.getElementById("purchases-purchaseorders-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("purchases-purchaseorders").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("purchases-bills-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("purchases-bills").style.display = "block";
        });
        document.getElementById("purchases-receipts-button").addEventListener("click",function(e){
                e.preventDefault();
                randomString(function(nonce){
                        document.getElementById("receipt_upload_nonce").value = nonce;
                        document.getElementById("main").style.display = "none";
                        document.getElementById("purchases-receipts").style.display = "block";        
                })
        });
        document.getElementById("purchases-vendors-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("purchases-vendors").style.display = "block";
        });
        document.getElementById("purchases-products-services-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("purchases-products-services").style.display = "block";
        });
        document.getElementById("purchases-payment-terms-methods-forms-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("purchases-payment-terms").style.display="block";
        });
        // back button actions
        document.getElementById("purchases-bills-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("purchases-bills").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("purchases-receipts-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("purchases-receipts").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("purchases-vendors-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("purchases-vendors").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("purchases-products-services-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("purchases-products-services").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("purchases-payment-terms-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("purchases-payment-terms").style.display="none";
                document.getElementById("main").style.display = "block";
        });

        document.getElementById("add_bill").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById('add-new-bill').style.display='block';
        });
        document.getElementById("create_po").addEventListener("click",function(e){
                e.preventDefault();
                newPurchaseOrderNumber(function(){
                        document.getElementById('new-purchase-order-dialog').style.display='block';
                });
        });
        document.getElementById("add_vendor").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById('new-vendor-dialog').style.display='block';
        });
        document.getElementById("inventory-new-allotment").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("add-allotment-dialog").style.display = 'block';
        });
}
function newPurchaseOrderNumber(callback=null) {
        SendIPC("new_purchaseorder_number","PO-",function(channel,event,ponum){
                console.log(ponum)
                var url = localStorage.getItem("corporate-book-url");
                document.getElementById("po_number").value = ponum;
                document.getElementById("ponumber").value = ponum;
                //document.getElementById("estimate-public-url").value = `${url}/vendor/estimate/?num=${ponum}`;
                if (callback) callback();
        })
}

function purchaseOrder(element_obj) {
        switch(element_obj.value) {
                case 'view':
                        var contents = element_obj.getAttribute("data-contents")
                        var ponum = element_obj.getAttribute("data-ponum");
                        console.log(contents);
                        //SendIPC("transform_purchaseorder",contents,function(channel,event,html){
                        //        var win = window.open("", `PO #${ponum}`, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=1000,top="+(screen.height-400)+",left="+(screen.width-840));
                        //        win.document.body.innerHTML = html;        
                        //})
                        break;
        }
}