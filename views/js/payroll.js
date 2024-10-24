function payroll_load() {
        // add document.getElementById statements
        document.getElementById("payroll-activities-back").addEventListener("click",function(e){
                e.preventDefault()
                document.getElementById("payroll-activities").style.display = "none";
                document.getElementById("main").style.display = "block";
        })

        document.getElementById("payroll-onboard-button").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("payroll-activities").style.display = "block";
        })

        document.getElementById("federal-employee-classification").addEventListener("change",function(e){
                e.preventDefault();
                switch(this.value) {
                        case 'w2':
                                document.getElementById("federal-w2-dialog").style.display = "block";
                                break;
                        case '1099':
                                document.getElementById("federal-1099-dialog").style.display = "block";
                                break;
                        case 'volunteer':
                                document.getElementById("federal-volunteer-dialog").style.display = "block";
                                break;
                        case 'intern':
                                document.getElementById("federal-intern-dialog").style.display = "block";
                                break;
                }
                this.value = "";
        })
}