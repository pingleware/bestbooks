function shareholder_load() {
    // add document.getElementById statements
    document.getElementById("shareholder-list-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("shareholder-list").style.display = "block";
    });
    document.getElementById("shareholder-issuance-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("shareholder-issuance").style.display = "block";
    });
    document.getElementById("shareholder-transfer-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("shareholder-transfer").style.display = "block";
    });
    document.getElementById("shareholder-redeem-button").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("main").style.display = "none";
        document.getElementById("shareholder-redeem").style.display = "block";
    });
    // back button actions
    document.getElementById("shareholder-list-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("shareholder-list").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("shareholder-issuance-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("shareholder-issuance").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("shareholder-transfer-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("shareholder-transfer").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("shareholder-redeem-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("shareholder-redeem").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("shareholder-add-new").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById('shareholder-add-dialog').style.display='block';
    });

}