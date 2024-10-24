function import_load() {
        // add document.getElementById statements
        document.getElementById("import").addEventListener("click",function(e){
                e.preventDefault();
                document.getElementById("main").style.display = "none";
                document.getElementById("import-panel").style.display = "block";
        });
        document.getElementById("import-panel-back").addEventListener("click",function(e){
                e.preventDefault()
                document.getElementById("import-panel").style.display = "none";
                document.getElementById("main").style.display = "block";
        });
        document.getElementById("import-panel-submit").addEventListener("click",function(e){
                e.preventDefault();
                var file = document.getElementById("import-panel-file").files[0];
                if (file) {
                        var choice = document.getElementById("import-panel-source").value;
                        var source = '';
                        var type = '';
                        console.log(choice);
                        switch (choice) {
                                case 'wave_accounting':
                                        source = 'accounting';
                                        type = 'waveaccounting';
                                        readImport(file,type,source)
                                        break;
                                case 'wave_bill_items':
                                        source = 'bill_items'
                                        type = 'waveaccounting';
                                        readImport(file,type,source)
                                        break;
                                case 'wave_customers':
                                        source = 'customers';
                                        type = 'waveaccounting';
                                        readImport(file,type,source)
                                        break;
                                case 'wave_vendors':
                                        source = 'vendors';
                                        type = 'waveaccounting';
                                        readImport(file,type,source)
                                        break;
                        } 
                }
        });
}

function readImport(file,type,source) {
        console.log([file,type,source])
        if (type == "waveaccounting") {
                switch(source) {
                        case 'accounting': 
                             {
                                var params = {
                                        type: type,
                                        source:  source,
                                        filename: file.path,
                                        mainWindow: null,
                                        channel: ''
                                };                
                                document.getElementById("progress-dialog").style.display = "block";
                                SendIPC("import",JSON.stringify(params),function(channel,event,result){
                                        console.log(result);
                                        document.getElementById("progress-dialog").style.display = "none";
                                })
                             }
                             break;
                }                        
        }
}

window.api.receive("import_progress",function(channel,event,size){
        document.getElementById("progrss-dialog-bar").style.width = `${size}%`;
})