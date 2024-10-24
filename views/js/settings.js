function settings_load() {
        // add document.getElementById statements
        var pagination_limit = localStorage.getItem("pagination-limit");
        var corporatebook_url = localStorage.getItem("corporate-book-url");
        var company_sender_email = localStorage.getItem("company_sender_email");
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
        if (company_sender_email) {
                document.getElementById("settings-company-sender").value = company_sender_email;
        } else {
                document.getElementById("settings-company-sender").value = "";
        }
        document.getElementById("settings-save").addEventListener("click",function(e){
                e.preventDefault();
                localStorage.setItem("pagination-start",0);
                localStorage.setItem("pagination-limit",document.getElementById("settings-pagination-limit").value);
                localStorage.setItem("corporate-book-url",document.getElementById("settings-corporatebook-url").value);
                localStorage.setItem("company_sender_email",document.getElementById("settings-company-sender").value);
                // Notify the CompanySenderChanged custom event that the company sender email has been changed.
                const eventCompanySenderChange = new Event("CompanySenderChanged");
                document.dispatchEvent(eventCompanySenderChange);

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