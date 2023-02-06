function accounting_load() {
    document.getElementById("accounting-budget-table-current-year").innerHTML = Number(year);
    document.getElementById("accounting-budget-table-next-year").innerHTML = Number(year) + 1;
    
    document.getElementById("accounting-starting-balances-table-current-year").innerHTML = Number(year);
    document.getElementById("accounting-starting-balances-table-next-year").innerHTML = Number(year) + 1;    


    document.getElementById("accounting-chartofaccounts-button").addEventListener("click",function(e){
        e.preventDefault();
        getAccounts(function(results){
            console.log(results);
            var accounts = JSON.parse(results);
            document.getElementById("chartofaccounts-table").innerHTML = `<tr>
                <th width="20%">ID</th>
                <th width="20%">Name</th>
                <th width="20%">Type</th>
                <th width="20%">Balance</th>
                <th width="20%">In-Use</th>
            </tr>`;
            accounts.forEach(function(account){
                console.log(account);
                var checked = `No, <button data-id="${account.id}" class="w3-button w3-red" onclick="deleteAccount(this)">Delete</button>`;
                if (account.inuse == 1) {
                    checked = 'Yes';
                }
                document.getElementById("chartofaccounts-table").innerHTML += `<tr>
                    <td>${account.id}</td>
                    <td>${account.name}</td>
                    <td>${account.type}</td>
                    <td>${account.balance}</td>
                    <td>${checked}</td>
                    </tr>`;
            });
        })
        document.getElementById("main").style.display = "none";
        document.getElementById("accounting-chartofaccounts").style.display = "block";
    });
    document.getElementById("accounting-chartofaccounts-back").addEventListener("click",function(e){
        e.preventDefault();
        document.getElementById("accounting-chartofaccounts").style.display = "none";
        document.getElementById("main").style.display = "block";
    })
    document.getElementById("accounting-transactions-button").addEventListener("click", function(e){
        e.preventDefault();
        getTransactions(function(transactions){
            console.log(transactions);
            document.getElementById("transactions-table").innerHTML = `<tr>
            <th>ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Account</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Action</th>
            </tr>`;
            transactions.forEach(function(transaction){
                var base64 = btoa(JSON.stringify(transaction))
                document.getElementById("transactions-table").innerHTML += `<tr>
                    <td>${transaction.id}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.note}</td>
                    <td>${transaction.name}</td>
                    <td>${transaction.debit}</td>
                    <td>${transaction.credit}</td>
                    <td>
                        <select class="w3-input" data-id="${transaction.id}" data-trans="${base64}" onchange="updateTransaction(this)">
                            <option value="">Select</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                        </select>
                    </td>
                    </tr>`;
            });
            document.getElementById("main").style.display = "none";
            document.getElementById("accounting-transactions").style.display = "block";
        });
    })
    document.getElementById("accounting-transactions-back").addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById("accounting-transactions").style.display = "none";
        document.getElementById("main").style.display = "block";
    })
    document.getElementById("accounting-journals-button").addEventListener("click", function(e){
        e.preventDefault();
    
        getJournalTransactions(function(transactions){
            document.getElementById("journal_transactions_table").innerHTML = `<tr>
                <th>ID</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Action</th>
            </tr>`;
            transactions.forEach(function(transaction){
                var base64 = btoa(JSON.stringify(transaction))
                document.getElementById("journal_transactions_table").innerHTML += `<tr>
                    <td>${transaction.id}</td>
                    <td>${transaction.txdate}</td>
                    <td>${transaction.ref}</td>
                    <td>${transaction.account}</td>
                    <td>${transaction.debit}</td>
                    <td>${transaction.credit}</td>
                    <td>
                        <select class="w3-input" data-id="${transaction.id}" data-trans="${base64}" onchange="updateJournalTransaction(this)">
                            <option value="">Select</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                        </select>
                    </td>
                    </tr>`;
            });
    
            document.getElementById("main").style.display = "none";
            document.getElementById("accounting-journals").style.display = "block";
        });
    });
    document.getElementById("add_journal_transaction").addEventListener("click", function(e){
        e.preventDefault();
        getAccounts(function(results){
            console.log(results);
            var accounts = JSON.parse(results);
            accounts.forEach(function(account){
                var option = document.createElement("option");
                option.value = account.name;
                option.innerText = account.name;
                document.getElementById("journal_account_name").appendChild(option);
            });
            document.getElementById("add-journal-transaction-dialog").style.display = 'block';
        });
    });
    document.getElementById("accounting-journals-back").addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById("accounting-journals").style.display = "none";
        document.getElementById("main").style.display = "block";
    })
    document.getElementById("accounting-budget-button").addEventListener("click", function(e){
        e.preventDefault();
        getAccounts(function(results){
            document.getElementById("accounting-budget-account").innerHTML = `<option value="">Select</option>`;
            var accounts = JSON.parse(results);
            accounts.forEach(function(account){
                var option = new Option();
                option.value = account.id;
                option.text = account.name;
                document.getElementById("accounting-budget-account").appendChild(option);
            });
            document.getElementById("main").style.display = "none";
            document.getElementById("accounting-budget").style.display = 'block';
        });
    });
    document.getElementById("accounting-budget-back").addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById("accounting-budget").style.display = 'none';
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("accounting-budget-account").addEventListener("change", function(e){
        e.preventDefault();
        let id = this.value;
        console.log(id);
        if (Number(id) > 0) {
            document.getElementById("accounting-budget-save").removeAttribute("disabled");
        } else {
            document.getElementById("accounting-budget-save").setAttribute("disabled","disabled");
        }
    });
    document.getElementById("accounting-starting-balances-button").addEventListener("click",function(e){
        e.preventDefault();
        getAccounts(function(results){
            document.getElementById("accounting-starting-balances-account").innerHTML = `<option value="">Select</option>`;
            var accounts = JSON.parse(results);
            accounts.forEach(function(account){
                var option = new Option();
                option.value = account.id;
                option.text = account.name;
                document.getElementById("accounting-starting-balances-account").appendChild(option);
            });
            document.getElementById("main").style.display = "none";
            document.getElementById("accounting-starting-balances").style.display = 'block';
        });
    });
    document.getElementById("accounting-starting-balances-back").addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById("accounting-starting-balances").style.display = 'none';
        document.getElementById("main").style.display = "block";
    });
    document.getElementById("accounting-starting-balances-account").addEventListener("change", function(e){
        e.preventDefault();
        let id = this.value;
        console.log(id);
        if (Number(id) > 0) {
            document.getElementById("accounting-starting-balances-save").removeAttribute("disabled");
        } else {
            document.getElementById("accounting-starting-balances-save").setAttribute("disabled","disabled");
        }
    });    
    document.getElementById("addnew-now").addEventListener("click", function(e){
        e.preventDefault();
        var data = {
            name: document.getElementById("addnew-name").value,
            type: document.getElementById("addnew-type").value,
            company: company.id
        };
        console.log(data);
        SendIPC("add_account",JSON.stringify(data),function(channel,event,result){
            console.log(result);
            document.getElementById("addnew-name").value = "";
            document.getElementById("addnew-type").value = "Unknown";
            document.getElementById('accounting-chartofaccounts-addnew').style.display='none';
        });
    });
    document.getElementById("add_transaction").addEventListener("click", function(e){
        e.preventDefault();
        getAccounts(function(results){
            console.log(results);
            var accounts = JSON.parse(results);
            accounts.forEach(function(account){
                var option = document.createElement("option");
                option.value = account.name;
                option.innerText = account.name;
                document.getElementById("account_name").appendChild(option);
            });
            var accountTypes = Object.keys(JSON.parse(localStorage.getItem("accountTypes")));
            accountTypes.forEach(function(accountType){
                var option = document.createElement("option");
                option.value = accountType;
                option.innerText = accountType;
                document.getElementById("account_type").appendChild(option); 
            });
            document.getElementById('add-transaction-dialog').style.display='block';
        });
    });
    document.getElementById("add_transaction_action").addEventListener("click", function(e){
        e.preventDefault();
        var data = {
            name: document.getElementById("account_name").value,
            type: document.getElementById("account_type").value,
            date: document.getElementById("account_date").value,
            time: document.getElementById("account_time").value,
            description: document.getElementById("account_description").value,
            debit: document.getElementById("account_debit").value,
            credit: document.getElementById("account_credit").value,
            company: company.id
        };
        SendIPC("add_transaction",JSON.stringify(data),function(channel,event,result){
            console.log(result);
            document.getElementById("account_name").value = "Cash";
            document.getElementById("account_type").value = "Unknown";
            document.getElementById("account_date").value = "";
            document.getElementById("account_time").value = "";
            document.getElementById("account_description").value = "";
            document.getElementById("account_debit").value = "0.00";
            document.getElementById("account_credit").value = "0.00";
            document.getElementById('add-transaction-dialog').style.display='none';
        });
    });
    document.getElementById("add_account").addEventListener("click",function(e){
        e.preventDefault();
        var account_types = Object.keys(JSON.parse(localStorage.getItem("accountTypes"),true));
        console.log(account_types);
        account_types.forEach(function(account_type){
            var option = document.createElement('option');
            option.value = account_type;
            option.innerHTML = account_type;
            document.getElementById("addnew-type").appendChild(option);
        });
        document.getElementById('accounting-chartofaccounts-addnew').style.display='block';
    });        
}
function getAccounts(callback) {
    SendIPC("get_accounts_by_company",company.id,function(channel,event,results){
        callback(results);
    });
}
function getTransactions(callback) {
    SendIPC("get_transactions",company.id,function(channel,event,results){
        callback(JSON.parse(results));
    })
}
function getJournalTransactions(callback) {
    SendIPC("get_journal_transactions",company.id,function(channel,event,results){
        callback(JSON.parse(results));
    })
}
function deleteAccount(obj) {
    let id = obj.getAttribute("data-id");
}
function updateTransaction(obj) {
    let id = obj.getAttribute("data-id");
    var transaction = atob(obj.getAttribute("data-trans"));
    var action = obj.value;
    console.log([id,transaction,action]);
    obj.value = "";
}
function updateJournalTransaction(obj) {
    let id = obj.getAttribute("data-id");
    var transaction = atob(obj.getAttribute("data-trans"));
    var action = obj.value;
    console.log([id,transaction,action]);
    obj.value = "";
}