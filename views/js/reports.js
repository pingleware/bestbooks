// REPORTS ACTIONS
function reports_load() {
    document.getElementById("reports-balancesheet-button").addEventListener("click", function(e){
        document.getElementById("main").style.display = "none";
        document.getElementById("reports-balancesheet").style.display = "block";
    });
    document.getElementById("reports-balancesheet-back").addEventListener("click", function(e){
        document.getElementById("reports-balancesheet").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("reports-balancesheet-create").addEventListener("click",function(e){
        e.preventDefault();
        var params = {
            startDate: document.getElementById("reports-balancesheet-start-date").value,
            endDate: document.getElementById("reports-balancesheet-end-date").value
        }
        SendIPC("report_balancesheet",JSON.stringify(params),function(channel,event,data){
            document.getElementById("reports-balancesheet-textarea").value = data;
        });
    });
    document.getElementById("reports-incomestatement-button").addEventListener("click", function(e){
        document.getElementById("main").style.display = "none";
        document.getElementById("reports-incomestatement").style.display = "block";
    });
    document.getElementById("reports-incomestatement-back").addEventListener("click", function(e){
        document.getElementById("reports-incomestatement").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("reports-incomestatement-create").addEventListener("click", function(e){
        e.preventDefault();
        var params = {
            startDate: document.getElementById("reports-incomestatement-start-date").value,
            endDate: document.getElementById("reports-incomestatement-end-date").value
        }
        SendIPC("report_incomestatement",JSON.stringify(params),function(channel,event,data){
            document.getElementById("reports-incomestatement-textarea").value = data;
        });
    });
    document.getElementById("reports-trialbalance-button").addEventListener("click", function(e){
        document.getElementById("main").style.display = "none";
        document.getElementById("reports-trialbalance").style.display = "block";
    });
    document.getElementById("reports-trialbalance-back").addEventListener("click", function(e){
        document.getElementById("reports-trialbalance").style.display = "none";
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("reports-trialbalance-create").addEventListener("click", function(e){
        e.preventDefault();
        var params = {
            startDate: document.getElementById("reports-trialbalance-start-date").value,
            endDate: document.getElementById("reports-trialbalance-end-date").value
        }
        SendIPC("report_trialbalance",JSON.stringify(params),function(channel,event,data){
            document.getElementById("reports-trialbalance-textarea").value = data;
        });
    });    
}