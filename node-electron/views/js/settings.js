function settings_load() {
        // add document.getElementById statements
        var pagination_limit = localStorage.getItem("pagination-limit");
        var corporatebook_url = localStorage.getItem("corporate-book-url");
        if (pagination_limit) {
                document.getElementById("settings-pagination-limit").value = pagination_limit;
        } else {
                document.getElementById("settings-pagination-limit").value = 10;
                localStorage.setItem("pagination-limit",10);
                localStorage.setItem("pagination-start",0);
        }
        if (corporatebook_url) {
                document.getElementById("settings-corporatebook-url").value = corporatebook_url;
        } else {
                document.getElementById("settings-corporatebook-url").value = "";
        }
        document.getElementById("settings-save").addEventListener("click",function(e){
                e.preventDefault();
                localStorage.setItem("pagination-start",0);
                localStorage.setItem("pagination-limit",document.getElementById("settings-pagination-limit").value);
                localStorage.setItem("corporate-book-url",document.getElementById("settings-corporatebook-url").value);
                showAlert("success","Settings Status","Settings successfully saved.");
        });

        document.getElementById("settings-button").addEventListener("click", function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("settings").style.display = "block";
        });
        document.getElementById("settings-back").addEventListener("click", function(e){
                e.preventDefault();
                document.getElementById("settings").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
}