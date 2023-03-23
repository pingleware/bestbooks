function purchases_load() {
        // add document.getElementById statements
        document.getElementById("purchases-purchaseorders-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("purchases-purchaseorders").style.display = "block";
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