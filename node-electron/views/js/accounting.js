function accounting_load() {
    var year = new Date().getFullYear();

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
                var checked = `No, <button data-id="${account.id}" data-name="${account.name}" data-type="${account.type}" class="w3-button w3-red" onclick="deleteAccount(this)">Delete</button>`;
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
                console.log(transaction);
                var base64 = btoa(JSON.stringify(unescape(encodeURIComponent(transaction))))
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
                console.log(transaction);
                var base64 = btoa(JSON.stringify(unescape(encodeURIComponent(transaction))))
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
                option.setAttribute('data-type',account.type);
                document.getElementById("journal_account_name").appendChild(option);
            });
            document.getElementById("add_journal_transaction_action").value = "Add";
            document.getElementById("journal_account_name").value = "";
            document.getElementById("journal_account_date").value = "";
            document.getElementById("journal_account_time").value = "";
            document.getElementById("journal_account_reference").value = "";
            document.getElementById("journal_account_debit").value = "0.00";
            document.getElementById("journal_account_credit").value = "0.00";
            document.getElementById("journal_account_id").value = "0";
            document.getElementById("add-journal-transaction-dialog-title").innerHTML = 'Add Journal Transaction';
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
                option.setAttribute('data-type',account.type);
                option.setAttribute("data-account",btoa(JSON.stringify(account)));
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
            SendIPC("account_budgets",id, function(channel,event,json){
                var data = JSON.parse(json);
                document.getElementById("accounting-budget-01").value = data[0].Bud01;
                document.getElementById("accounting-budget-02").value = data[0].Bud02;
                document.getElementById("accounting-budget-03").value = data[0].Bud03;
                document.getElementById("accounting-budget-04").value = data[0].Bud04;
                document.getElementById("accounting-budget-05").value = data[0].Bud05;
                document.getElementById("accounting-budget-06").value = data[0].Bud06;
                document.getElementById("accounting-budget-07").value = data[0].Bud07;
                document.getElementById("accounting-budget-08").value = data[0].Bud08;
                document.getElementById("accounting-budget-09").value = data[0].Bud09;
                document.getElementById("accounting-budget-10").value = data[0].Bud10;
                document.getElementById("accounting-budget-11").value = data[0].Bud11;
                document.getElementById("accounting-budget-12").value = data[0].Bud12;
                document.getElementById("accounting-budget-13").value = data[0].Bud13;
                document.getElementById("accounting-budget-14").value = data[0].Bud14;
                document.getElementById("accounting-budget-15").value = data[0].Bud15;
                document.getElementById("accounting-budget-16").value = data[0].Bud16;
                document.getElementById("accounting-budget-17").value = data[0].Bud17;
                document.getElementById("accounting-budget-18").value = data[0].Bud18;
                document.getElementById("accounting-budget-19").value = data[0].Bud19;
                document.getElementById("accounting-budget-20").value = data[0].Bud20;
                document.getElementById("accounting-budget-21").value = data[0].Bud21;
                document.getElementById("accounting-budget-22").value = data[0].Bud22;
                document.getElementById("accounting-budget-23").value = data[0].Bud23;
                document.getElementById("accounting-budget-24").value = data[0].Bud24;
    
                document.getElementById("accounting-budget-save").removeAttribute("disabled");
            });
        } else {
            document.getElementById("accounting-budget-01").value = "0.00";
            document.getElementById("accounting-budget-02").value = "0.00";
            document.getElementById("accounting-budget-03").value = "0.00";
            document.getElementById("accounting-budget-04").value = "0.00";
            document.getElementById("accounting-budget-05").value = "0.00";
            document.getElementById("accounting-budget-06").value = "0.00";
            document.getElementById("accounting-budget-07").value = "0.00";
            document.getElementById("accounting-budget-08").value = "0.00";
            document.getElementById("accounting-budget-09").value = "0.00";
            document.getElementById("accounting-budget-10").value = "0.00";
            document.getElementById("accounting-budget-11").value = "0.00";
            document.getElementById("accounting-budget-12").value = "0.00";
            document.getElementById("accounting-budget-13").value = "0.00";
            document.getElementById("accounting-budget-14").value = "0.00";
            document.getElementById("accounting-budget-15").value = "0.00";
            document.getElementById("accounting-budget-16").value = "0.00";
            document.getElementById("accounting-budget-17").value = "0.00";
            document.getElementById("accounting-budget-18").value = "0.00";
            document.getElementById("accounting-budget-19").value = "0.00";
            document.getElementById("accounting-budget-20").value = "0.00";
            document.getElementById("accounting-budget-21").value = "0.00";
            document.getElementById("accounting-budget-22").value = "0.00";
            document.getElementById("accounting-budget-23").value = "0.00";
            document.getElementById("accounting-budget-24").value = "0.00";

            document.getElementById("accounting-budget-save").setAttribute("disabled","disabled");
        }
    });
    document.getElementById("accounting-budget-save").addEventListener("click", function(e){
        e.preventDefault();

        var params = {
            company: Number(company.id),
            account: Number(document.getElementById("accounting-budget-account").value),
            budget_01: Number(document.getElementById("accounting-budget-01").value),
            budget_02: Number(document.getElementById("accounting-budget-02").value),
            budget_03: Number(document.getElementById("accounting-budget-03").value),
            budget_04: Number(document.getElementById("accounting-budget-04").value),
            budget_05: Number(document.getElementById("accounting-budget-05").value),
            budget_06: Number(document.getElementById("accounting-budget-06").value),
            budget_07: Number(document.getElementById("accounting-budget-07").value),
            budget_08: Number(document.getElementById("accounting-budget-08").value),
            budget_09: Number(document.getElementById("accounting-budget-09").value),
            budget_10: Number(document.getElementById("accounting-budget-10").value),
            budget_11: Number(document.getElementById("accounting-budget-11").value),
            budget_12: Number(document.getElementById("accounting-budget-12").value),
            budget_13: Number(document.getElementById("accounting-budget-13").value),
            budget_14: Number(document.getElementById("accounting-budget-14").value),
            budget_15: Number(document.getElementById("accounting-budget-15").value),
            budget_16: Number(document.getElementById("accounting-budget-16").value),
            budget_17: Number(document.getElementById("accounting-budget-17").value),
            budget_18: Number(document.getElementById("accounting-budget-18").value),
            budget_19: Number(document.getElementById("accounting-budget-19").value),
            budget_20: Number(document.getElementById("accounting-budget-20").value),
            budget_21: Number(document.getElementById("accounting-budget-21").value),
            budget_22: Number(document.getElementById("accounting-budget-22").value),
            budget_23: Number(document.getElementById("accounting-budget-23").value),
            budget_24: Number(document.getElementById("accounting-budget-24").value)
        };
        console.log(params);
        SendIPC("accounting_budget",JSON.stringify(params),function(channel,event,data){
            console.log(data);
            showAlert("success","Budget Status","Budget has been updated successfully!");
        });
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
                option.setAttribute('data-type',account.type);
                option.setAttribute("data-account",btoa(JSON.stringify(account)));
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
        //var base64 = e.target.options[e.target.options.selectedIndex].getAttribute("data-account");
        //var json = atob(base64);
        //console.log(json)
        //var account = JSON.parse(json);
        //console.log(account);

        if (Number(id) > 0) {
            SendIPC("account_balances",id,function(channel,event,json){
                var data = JSON.parse(json);
                console.log(data);
                document.getElementById("accounting-starting-balances-01").value = data[0].Bal01;
                document.getElementById("accounting-starting-balances-02").value = data[0].Bal02;
                document.getElementById("accounting-starting-balances-03").value = data[0].Bal03;
                document.getElementById("accounting-starting-balances-04").value = data[0].Bal04;
                document.getElementById("accounting-starting-balances-05").value = data[0].Bal05;
                document.getElementById("accounting-starting-balances-06").value = data[0].Bal06;
                document.getElementById("accounting-starting-balances-07").value = data[0].Bal07;
                document.getElementById("accounting-starting-balances-08").value = data[0].Bal08;
                document.getElementById("accounting-starting-balances-09").value = data[0].Bal09;
                document.getElementById("accounting-starting-balances-10").value = data[0].Bal10;
                document.getElementById("accounting-starting-balances-11").value = data[0].Bal11;
                document.getElementById("accounting-starting-balances-12").value = data[0].Bal12;
                document.getElementById("accounting-starting-balances-13").value = data[0].Bal13;
                document.getElementById("accounting-starting-balances-14").value = data[0].Bal14;
                document.getElementById("accounting-starting-balances-15").value = data[0].Bal15;
                document.getElementById("accounting-starting-balances-16").value = data[0].Bal16;
                document.getElementById("accounting-starting-balances-17").value = data[0].Bal17;
                document.getElementById("accounting-starting-balances-18").value = data[0].Bal18;
                document.getElementById("accounting-starting-balances-19").value = data[0].Bal19;
                document.getElementById("accounting-starting-balances-20").value = data[0].Bal20;
                document.getElementById("accounting-starting-balances-21").value = data[0].Bal21;
                document.getElementById("accounting-starting-balances-22").value = data[0].Bal22;
                document.getElementById("accounting-starting-balances-23").value = data[0].Bal23;
                document.getElementById("accounting-starting-balances-24").value = data[0].Bal24;

                document.getElementById("accounting-starting-balances-save").removeAttribute("disabled");
            })
        } else {
            document.getElementById("accounting-starting-balances-01").value = "0.00";
            document.getElementById("accounting-starting-balances-02").value = "0.00";
            document.getElementById("accounting-starting-balances-03").value = "0.00";
            document.getElementById("accounting-starting-balances-04").value = "0.00";
            document.getElementById("accounting-starting-balances-05").value = "0.00";
            document.getElementById("accounting-starting-balances-06").value = "0.00";
            document.getElementById("accounting-starting-balances-07").value = "0.00";
            document.getElementById("accounting-starting-balances-08").value = "0.00";
            document.getElementById("accounting-starting-balances-09").value = "0.00";
            document.getElementById("accounting-starting-balances-10").value = "0.00";
            document.getElementById("accounting-starting-balances-11").value = "0.00";
            document.getElementById("accounting-starting-balances-12").value = "0.00";
            document.getElementById("accounting-starting-balances-13").value = "0.00";
            document.getElementById("accounting-starting-balances-14").value = "0.00";
            document.getElementById("accounting-starting-balances-15").value = "0.00";
            document.getElementById("accounting-starting-balances-16").value = "0.00";
            document.getElementById("accounting-starting-balances-17").value = "0.00";
            document.getElementById("accounting-starting-balances-18").value = "0.00";
            document.getElementById("accounting-starting-balances-19").value = "0.00";
            document.getElementById("accounting-starting-balances-20").value = "0.00";
            document.getElementById("accounting-starting-balances-21").value = "0.00";
            document.getElementById("accounting-starting-balances-22").value = "0.00";
            document.getElementById("accounting-starting-balances-23").value = "0.00";
            document.getElementById("accounting-starting-balances-24").value = "0.00";
        
            document.getElementById("accounting-starting-balances-save").setAttribute("disabled","disabled");
        }
    });   
    document.getElementById("accounting-starting-balances-save").addEventListener("click",function(e){
        e.preventDefault();
        var params = {
            company: Number(company.id),
            account: Number(document.getElementById("accounting-starting-balances-account").value),
            balance_01: Number(document.getElementById("accounting-starting-balances-01").value),
            balance_02: Number(document.getElementById("accounting-starting-balances-02").value),
            balance_03: Number(document.getElementById("accounting-starting-balances-03").value),
            balance_04: Number(document.getElementById("accounting-starting-balances-04").value),
            balance_05: Number(document.getElementById("accounting-starting-balances-05").value),
            balance_06: Number(document.getElementById("accounting-starting-balances-06").value),
            balance_07: Number(document.getElementById("accounting-starting-balances-07").value),
            balance_08: Number(document.getElementById("accounting-starting-balances-08").value),
            balance_09: Number(document.getElementById("accounting-starting-balances-09").value),
            balance_10: Number(document.getElementById("accounting-starting-balances-10").value),
            balance_11: Number(document.getElementById("accounting-starting-balances-11").value),
            balance_12: Number(document.getElementById("accounting-starting-balances-12").value),
            balance_13: Number(document.getElementById("accounting-starting-balances-13").value),
            balance_14: Number(document.getElementById("accounting-starting-balances-14").value),
            balance_15: Number(document.getElementById("accounting-starting-balances-15").value),
            balance_16: Number(document.getElementById("accounting-starting-balances-16").value),
            balance_17: Number(document.getElementById("accounting-starting-balances-17").value),
            balance_18: Number(document.getElementById("accounting-starting-balances-18").value),
            balance_19: Number(document.getElementById("accounting-starting-balances-19").value),
            balance_20: Number(document.getElementById("accounting-starting-balances-20").value),
            balance_21: Number(document.getElementById("accounting-starting-balances-21").value),
            balance_22: Number(document.getElementById("accounting-starting-balances-22").value),
            balance_23: Number(document.getElementById("accounting-starting-balances-23").value),
            balance_24: Number(document.getElementById("accounting-starting-balances-24").value)
        };
        SendIPC("accounting_balance",JSON.stringify(params),function(channel,event,data){
            console.log(data);
            showAlert("success","Starting Balance Status","Starting Balances have been updated successfully!");
        });
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
            window.location.reload();
        });
    });
    document.getElementById("add_transaction").addEventListener("click", function(e){
        e.preventDefault();
        getAccounts(function(results){
            console.log(results);
            var accounts = JSON.parse(results);
            document.getElementById("account_name").innerHTML = '';
            accounts.forEach(function(account){
                var option = document.createElement("option");
                option.value = account.name;
                option.innerText = account.name;
                option.setAttribute('data-type',account.type);
                document.getElementById("account_name").appendChild(option);
            });
            var accountTypes = Object.keys(JSON.parse(localStorage.getItem("accountTypes")));
            document.getElementById("account_type").innerHTML = '';
            accountTypes.forEach(function(accountType){
                var option = document.createElement("option");
                option.value = accountType;
                option.innerText = accountType;
                document.getElementById("account_type").appendChild(option); 
            });
            document.getElementById("add_transaction_action").value = "Add";
            document.getElementById("account_date").value = "";
            document.getElementById("account_time").value = "";
            document.getElementById("account_description").value = "";
            document.getElementById("account_reference").value = "";
            document.getElementById("account_debit").value = "0.00";
            document.getElementById("account_credit").value = "0.00";
            document.getElementById("account_id").value = "0";
            document.getElementById("account_name").value = "";
            document.getElementById("add-transaction-dialog-title").innerHTML = "Add Transaction";
            document.getElementById('add-transaction-dialog').style.display='block';
        });
    });
    document.getElementById("add_transaction_action").addEventListener("click", function(e){
        e.preventDefault();
        var data = {
            id: document.getElementById("account_id").value,
            name: document.getElementById("account_name").value,
            type: document.getElementById("account_type").value,
            date: document.getElementById("account_date").value,
            time: document.getElementById("account_time").value,
            description: document.getElementById("account_description").value,
            ref: document.getElementById("account_reference").value,
            debit: document.getElementById("account_debit").value,
            credit: document.getElementById("account_credit").value,
            company: company.id
        };
        console.log(data);
        SendIPC("add_transaction",JSON.stringify(data),function(channel,event,result){
            window.location.reload();
        });
    });
    document.getElementById("add_journal_transaction_action").addEventListener("click", function(e){
        e.preventDefault();
        var data = {
            id: document.getElementById("journal_account_id").value,
            name: document.getElementById("journal_account_name").value,
            date: document.getElementById("journal_account_date").value,
            time: document.getElementById("journal_account_time").value,
            ref: document.getElementById("journal_account_reference").value,
            debit: document.getElementById("journal_account_debit").value,
            credit: document.getElementById("journal_account_credit").value,
            company: company.id,
            office: 0
        };
        SendIPC("add_journal_transaction",JSON.stringify(data),function(channel,event,result){
            window.location.reload();
        });

    });
    document.getElementById("add_account").addEventListener("click",function(e){
        e.preventDefault();
        var account_types = Object.keys(JSON.parse(localStorage.getItem("accountTypes"),true));
        console.log(account_types);
        document.getElementById("addnew-type").innerHTML = '';
        account_types.forEach(function(account_type){
            var option = document.createElement('option');
            option.value = account_type;
            option.innerHTML = account_type;
            document.getElementById("addnew-type").appendChild(option);
        });
        document.getElementById('accounting-chartofaccounts-addnew').style.display='block';
    });
    document.getElementById("transaction-startdate").addEventListener("change",function(e){
        e.preventDefault();
        localStorage.setItem("pagination-startdate",this.value);
    });
    document.getElementById("transaction-enddate").addEventListener("change",function(e){
        e.preventDefault();
        localStorage.setItem("pagination-enddate",this.value);
    });
}
function getAccounts(callback) {
    SendIPC("get_accounts_by_company",company.id,function(channel,event,results){
        callback(results);
    });
}
function getTransactions(callback) {
    var params = {
        company: company.id,
        start: localStorage.getItem('pagination-start'),
        limit: localStorage.getItem('pagination-limit'),
        start_date: localStorage.getItem('pagination-startdate'),
        end_date: localStorage.getItem('pagination-enddate')
    }
    SendIPC("get_transactions",JSON.stringify(params),function(channel,event,results){
        var data = JSON.parse(results);
        let total = data[0].total;
        localStorage.setItem("pagination-total",total);

        let pageCount = Math.ceil(total / localStorage.getItem("pagination-limit")).toFixed(0);
        let currentPage;

        const paginationNumbers = document.getElementById("transactions-pagination-numbers");
        //const paginatedList = document.getElementById("paginated-list");
        //const listItems = paginatedList.querySelectorAll("li");
        const nextButton = document.getElementById("transactions-next-button");
        const prevButton = document.getElementById("transactions-prev-button")
    

        const appendPageNumber = (index) => {
            const pageNumber = document.createElement("button");
            pageNumber.className = "pagination-number";
            pageNumber.innerHTML = index;
            pageNumber.setAttribute("onclick",`selectPage(${index})`);
            pageNumber.setAttribute("page-index", index);
            pageNumber.setAttribute("aria-label", "Page " + index);
            paginationNumbers.appendChild(pageNumber);
        };

        const getPaginationNumbers = () => {
            let startPage = localStorage.getItem("pagination-start");
            let _pageCount = pageCount;
            console.log(_pageCount)
            let limit = localStorage.getItem("pagination-limit");
            let start = localStorage.getItem("pagination-start");
            if (pageCount > (limit * start)) {
                _pageCount = limit * start;
            }
            paginationNumbers.innerHTML = '';
            for (let i = startPage; i <= _pageCount; i++) {
                appendPageNumber(i);
            }
        };

        getPaginationNumbers();

        callback(data);
    })
}
function selectPage(index) {
    let limit = localStorage.getItem("pagination-limit");
    localStorage.setItem("pagination-start",index * limit);
    getTransactions(function(transactions){
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
            console.log(transaction);
            var base64 = btoa(JSON.stringify(unescape(encodeURIComponent(transaction))))
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
    });
}
function getJournalTransactions(callback) {
    SendIPC("get_journal_transactions",company.id,function(channel,event,results){
        callback(JSON.parse(results));
    })
}
function deleteAccount(obj) {
    var name = obj.getAttribute("data-name");
    SendIPC("delete_account",name,function(channel,event,data){
        window.location.reload();
    })
}
function updateTransaction(obj) {
    let id = obj.getAttribute("data-id");
    var transaction = JSON.parse(atob(obj.getAttribute("data-trans")));
    var action = obj.value;
    console.log([id,transaction,action]);
    switch(action) {
        case 'delete':
            var message = '';
            if (transaction.ref > 0) {
                message = "<br/><i>Don't forget to delete the related reference transaction?</i>";
            }
            showConfirm("Delete Transaction?",`Delete the transaction:<br/>${transaction.date} for ${transaction.note}? ${message}`,function(v){
                SendIPC("delete_transaction",id,function(channel,event,json){
                    window.location.reload();
                });
            });
            break;
        case 'edit':
            {
                getAccounts(function(results){
                    console.log(results);
                    var accounts = JSON.parse(results);
                    document.getElementById("account_name").innerHTML = '<option value="">Select</option>';
                    accounts.forEach(function(account){
                        var option = document.createElement("option");
                        option.value = account.name;
                        option.innerText = account.name;
                        option.setAttribute('data-type',account.type);
                        document.getElementById("account_name").appendChild(option);
                    });
                    var accountTypes = Object.keys(JSON.parse(localStorage.getItem("accountTypes")));
                    document.getElementById("account_type").innerHTML = '';
                    accountTypes.forEach(function(accountType){
                        var option = document.createElement("option");
                        option.value = accountType;
                        option.innerText = accountType;
                        document.getElementById("account_type").appendChild(option); 
                    });        
                    document.getElementById("add_transaction_action").value = "Save";
                    var date = new Date(transaction.date);
                    document.getElementById("account_date").value = date.toISOString().split('T')[0];
                    document.getElementById("account_time").value = date.toTimeString().substr(0,8);
                    document.getElementById("account_description").value = transaction.note;
                    document.getElementById("account_reference").value = transaction.ref;
                    document.getElementById("account_debit").value = transaction.debit;
                    document.getElementById("account_credit").value = transaction.credit;
                    document.getElementById("account_id").value = transaction.id;
                    document.getElementById("account_name").value = transaction.name;

                    var account_name = document.getElementById("account_name");
                    console.log(account_name.options[account_name.options.selectedIndex].getAttribute("data-type"));
                    document.getElementById("account_type").value = account_name.options[account_name.options.selectedIndex].getAttribute("data-type");
                    document.getElementById("add-transaction-dialog-title").innerHTML = "Edit Transaction";
                    document.getElementById("add-transaction-dialog").style.display = 'block';
                });
            }
            break;
    }
    obj.value = "";
}
function updateJournalTransaction(obj) {
    let id = obj.getAttribute("data-id");
    var transaction = JSON.parse(atob(obj.getAttribute("data-trans")));
    var action = obj.value;
    console.log([id,transaction,action]);
    switch(action) {
        case 'delete':
            var message = '';
            if (transaction.ref > 0) {
                message = "<br/><i>Don't forget to delete the related reference transaction?</i>";
            }
            showConfirm("Delete Journal Transaction?",`Delete the journal transaction:<br/>${transaction.txdate} for ${transaction.account}? ${message}`,function(v){
                SendIPC("delete_journal_transaction",id,function(channel,event,json){
                    window.location.reload();
                });
            });
            break;
        case 'edit':
            {
                getAccounts(function(results){
                    console.log(results);
                    var accounts = JSON.parse(results);
                    document.getElementById("journal_account_name").innerHTML = '<option value="">Select</option>';
                    accounts.forEach(function(account){
                        var option = document.createElement("option");
                        option.value = account.name;
                        option.innerText = account.name;
                        option.setAttribute('data-type',account.type);
                        document.getElementById("journal_account_name").appendChild(option);
                    });
                    document.getElementById("add_journal_transaction_action").value = "Save";
                    var date = new Date(transaction.txdate);
                    document.getElementById("journal_account_date").value = date.toISOString().split('T')[0];
                    document.getElementById("journal_account_time").value = date.toTimeString().substr(0,8);
                    document.getElementById("journal_account_reference").value = transaction.ref;
                    document.getElementById("journal_account_debit").value = transaction.debit;
                    document.getElementById("journal_account_credit").value = transaction.credit;
                    document.getElementById("journal_account_id").value = transaction.id;
                    document.getElementById("journal_account_name").value = transaction.account;
                    document.getElementById("add-journal-transaction-dialog-title").innerHTML = 'Edit Journal Transaction';
                    document.getElementById("add-journal-transaction-dialog").style.display = 'block';
                });        
            }
            break;
    }
    obj.value = "";
}