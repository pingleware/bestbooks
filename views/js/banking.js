function banking_load() {
        // add document.getElementById statements
        document.getElementById("banking-accounts-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("banking-accounts").style.display = "block";
        });
        document.getElementById("banking-accounts-back").addEventListener("click", function(e){
                e.preventDefault();
                document.getElementById("banking-accounts").style.display = 'none';
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("add_bank").addEventListener("click", function(e){
                document.getElementById("add-bank-dialog").style.display = "block";
        });
}