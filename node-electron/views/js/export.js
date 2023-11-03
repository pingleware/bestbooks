function export_load() {
        // add document.getElementById statements
        document.getElementById("export").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("export-panel").style.display = "block";
        });
        document.getElementById("export-panel-back").addEventListener("click",function(e){
                e.preventDefault()
                document.getElementById("export-panel").style.display = "none";
                document.getElementById("main").style.display = "block";
        });

}