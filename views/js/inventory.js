function inventory_load() {
        // add document.getElementById statements
        document.getElementById("inventory-products-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("inventory-products").style.display = "block";
        });
        document.getElementById("inventory-services-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("inventory-services").style.display = "block";
        });
        document.getElementById("inventory-capital-assets-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("inventory-capital-assets").style.display = "block";
        });
        document.getElementById("inventory-products-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("inventory-products").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("inventory-services-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("inventory-services").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("inventory-capital-assets-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("inventory-capital-assets").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("inventory-add-capital-asset").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("add-capitalasset-dialog").style.display = 'block';
        });

}