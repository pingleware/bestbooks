function help_load() {
        // add document.getElementById statements
        document.getElementById("help-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("help").style.display = "block";
        });
        document.getElementById("help-back").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("help").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
}