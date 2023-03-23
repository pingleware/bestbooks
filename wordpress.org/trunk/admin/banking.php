<?php
require 'inc/Banking_List_Table.inc.php';

function bestbooks_dashboard_banking() {
	if (isset($_POST['add_bank_action'])) {
		$bankname = $_POST['add-bank-dialog-name'];
		$date = $_POST['add-bank-dialog-opening-date'];
		$description = 'Opening Deposit';
		$amount = floatval($_POST['add-bank-dialog-deposit']);
		$origination = $_POST['add-bank-dialog-origination'];

		bestbooks_bank($bankname, $date, $description, $amount, $origination);

		$args = array(
			'post_type' => 'bestbooks_bank',
			'post_status' => 'publish',
			'post_title' => $bankname
		);
		$post_id = wp_insert_post($args);
		if (is_wp_error($post_id)) {
			echo $post_id->get_error_message();
		} else {
			update_post_meta($post_id,'account_number',$_POST['add-bank-dialog-account']);
			update_post_meta($post_id,'opening_date',$date);
			update_post_meta($post_id,'url',$_POST['add-bank-dialog-url']);
			update_post_meta($post_id,'opening_deposit',$_POST['add-bank-dialog-deposit']);
			update_post_meta($post_id,'origination', $origination);

            $active_company = get_option('bestbooks_active_company');
            if (isset($active_company) === false) {
                $active_company = 0;
            }
            update_post_meta($post_id, 'company', $active_company);
		}
	} elseif (isset($_POST['bankingchoiceform'])) {
		switch($_POST['action']) {
			case 'delete':
				{
					$post_id = $_POST['post_id'];
					wp_delete_post($post_id, true);			
				}
				break;
		}
    }
	$banking_list_table = new Banking_List_Table();

	$coa = get_coa_instance();
	$asset_accounts = array();
	foreach($coa->account as $name => $type) {
		if ($type === 'Asset') {
			array_push($asset_accounts, $name);
		}
	}
    ?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - Banking 
			<button class="w3-button w3-blue" id="add_bank">Add New Bank</button>&nbsp;
		</h2>
		<?php
			$banking_list_table->prepare_items(); 
			$banking_list_table->display(); 		
		?>
	</div>
	<div id="add-bank-dialog" title="Add New Bank" style="display:none;">
		<form method="post" id="addbankform">
			<label for="add-bank-dialog-name">Bank Name</label>
			<input type="text" class="w3-input w3-block" name="add-bank-dialog-name" id="add-bank-dialog-name" value="" />
			<label for="add-bank-dialog-account">Bank Account #</label>
			<input type="text" class="w3-input w3-block" name="add-bank-dialog-account" id="add-bank-dialog-account" value="" />
			<label for="add-bank-dialog-opening-date">Bank Account Opening Date</label>
			<input type="date" class="w3-input w3-block" name="add-bank-dialog-opening-date" id="add-bank-dialog-opening-date" value="" />
			<label for="add-bank-dialog-url">Bank URL</label>
			<input type="url" class="w3-input w3-block" name="add-bank-dialog-url" id="add-bank-dialog-url" value="" />
			<label for="add-bank-dialog-deposit">Opening Deposit</label>
			<input type="number" class="w3-input w3-block" name="add-bank-dialog-deposit" id="add-bank-dialog-deposit" value="" />
			<label for="add-bank-dialog-origination">Origination of Deposit</label>
			<input type="text" class="w3-input w3-block" name="add-bank-dialog-origination" id="add-bank-dialog-origination" value="" list="add-asset-account-list" />
			<datalist id="add-asset-account-list">
				<?php
				foreach($asset_accounts as $account) {
					echo '<option value="'.$account.'">';
				}
				?>
			</datalist>
			<br/>
			<input type="submit" id="add_bank_action" name="add_bank_action" class="w3-button w3-black w3-block" value="Add" />
			<br/>
		</form>
	</div>
	<div id="edit-bank-dialog" title="Update an existing Bank" style="display:none;">
		<form method="post" id="editbankform">
			<input type="hidden" name="edit-bank-dialog-id" id="edit-bank-dialog-id" value="0" />
			<label for="edit-bank-dialog-name">Bank Name</label>
			<input type="text" class="w3-input w3-block w3-light-grey" name="edit-bank-dialog-name" id="edit-bank-dialog-name" value="" readonly />
			<label for="edit-bank-dialog-account">Bank Account #</label>
			<input type="text" class="w3-input w3-block" name="edit-bank-dialog-account" id="edit-bank-dialog-account" value="" />
			<label for="edit-bank-dialog-opening-date">Bank Account Opening Date</label>
			<input type="date" class="w3-input w3-block" name="edit-bank-dialog-opening-date" id="edit-bank-dialog-opening-date" value="" />
			<label for="edit-bank-dialog-url">Bank URL</label>
			<input type="url" class="w3-input w3-block" name="edit-bank-dialog-url" id="edit-bank-dialog-url" value="" />
			<label for="edit-bank-dialog-deposit">Opening Deposit</label>
			<input type="number" class="w3-input w3-block" name="edit-bank-dialog-deposit" id="edit-bank-dialog-deposit" value="" />
			<label for="edit-bank-dialog-origination">Origination of Deposit</label>
			<input type="text" class="w3-input w3-block" name="edit-bank-dialog-origination" id="edit-bank-dialog-origination" value="" list="edit-asset-account-list" />
			<datalist id="edit-asset-account-list">
				<?php
				foreach($asset_accounts as $account) {
					echo '<option value="'.$account.'">';
				}
				?>
			</datalist>
			<br/>
			<input type="submit" id="edit_bank_action" name="edit_bank_action" class="w3-button w3-black w3-block" value="Save" />
			<br/>
		</form>
	</div>
	<div id="reconcile-bank-dialog" title="Reconcile Bank" style="display:none;">
		<form method="post" name="reconcilebankaccount" id="reconcilebankaccount">
			About the <a href="https://www.accountingtools.com/articles/what-is-the-bank-reconciliation-process.html" target="_blank">Bank Reconcilation Process</a>
			<br/>
			<input type="hidden" name="reconcile-bank-dialog-id" id="reconcile-bank-dialog-count" value="0" />
			<input type="hidden" name="reconcile-bank-dialog-id" id="reconcile-bank-dialog-data" value="" />
			<input type="hidden" name="reconcile-bank-dialog-id" id="reconcile-bank-dialog-id" value="0" />
			<input type="hidden" name="reconcile-bank-dialog-type" id="reconcile-bank-dialog-type" value="Bank" />
			<label for="reconcile-bank-dialog-name">Bank Name</label>
			<input type="text" class="w3-input w3-block w3-light-grey" name="reconcile-bank-dialog-name" id="reconcile-bank-dialog-name" value="" readonly />
			<label for="reconcile-bank-dialog-beginning-date">Beginning Date</label>
			<input type="date" class="w3-input w3-block" id="reconcile-bank-dialog-beginning-date" name="reconcile-bank-dialog-beginning-date" value="" />
			<label for="reconcile-bank-dialog-ending-date">Ending Date</label>
			<input type="date" class="w3-input w3-block" id="reconcile-bank-dialog-ending-date" name="reconcile-bank-dialog-ending-date" value="" />
			<br/>
			<button class="w3-button w3-block w3-black" id="reconcile-bank-dialog-load-transactions">Load Transactions</button>
			<br/>
			<table class="w3-table w3-block" id="reconcile-bank-dialog-statement-entries" name="reconcile-bank-dialog-statement-entries">
				<tr><th colspan="7">Statement Entries</th></tr>
				<tr>
					<th>Date</th>
					<th>Description</th>
					<th>Cleared</th>
					<th>Debit</th>
					<th>Credit</th>
					<th>Adjusting Entry</th>
				</tr>
			</table>
			<label for="reconcile-bank-dialog-period-bank-balance">Ending Statement Bank Balance</label>
			<input type="number" class="w3-input w3-block" id="reconcile-bank-dialog-period-bank-balance" name="reconcile-bank-dialog-period-bank-balance" value="0.00" />
			<br/>
			<input type="submit" class="w3-button w3-block w3-black" id="reconcile_bank_action" name="reconcile_bank_action" value="Reconcile" disabled />
			<br/>
		</form>
	</div>
	<form id="bankingchoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="bankingchoiceform-action" value="" />
		<input type="hidden" name="post_id" id="bankingchoiceform-post_id" value="" />
		<input type="hidden" name="taxonomy" id="prodservchoiceform-taxonomy" value="" />
		<input type="hidden" name="bankingchoiceform" value="bankingchoiceform" />
	</form>
    <script type="text/javascript">
		jQuery(document).ready(function($){
			$("#add-bank-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: "auto", height: "auto"
  			});
		  	$("#edit-bank-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: "auto", height: "auto"
  			});
		  	$("#reconcile-bank-dialog").dialog({
				autoOpen : false, modal : true, show : "blind", hide : "blind", autoResize: "auto", width: "auto", height: "auto"
			});  
			$('#add_bank').bind('click', function(){
				$("#add-bank-dialog").dialog("open");
				return false;
			});
			$('#edit_bank_action').bind('click', function(){
				window.location.reload();
				return false;
			});
			showBankEditDialog = function() {
				$("#edit-bank-dialog").dialog("open");
				return false;
			}
			showBankReconcileDialog = function() {
				$('#reconcile_bank_action').attr('disabled','disabled');
				$("#reconcile-bank-dialog").dialog("open");
				return false;
			}
			$('#reconcile-bank-dialog-load-transactions').on('click', function(e){
				e.preventDefault();
				var account = $('#reconcile-bank-dialog-name').val();
				var account_type = $('#reconcile-bank-dialog-type').val();
				var beginning_date = $('#reconcile-bank-dialog-beginning-date').val();
				var ending_date = $('#reconcile-bank-dialog-ending-date').val();

				if (beginning_date.length == 0 || ending_date.length == 0) {
					alert("Missing start and/or end dates for reconciliation?");
					return false;
				}

				$.ajax({
         			type : "post",
         			dataType : "json",
         			url : "<?php echo admin_url('admin-ajax.php'); ?>",
         			data : {
						action: "bestbooks_get_transactions", 
						account: account,
						type: account_type,
						start: beginning_date,
						end: ending_date 
					},
         			success: function(response) {
						console.log(response);
						if (typeof response.status !== "undefined") {
							alert(response.message);
						} else {
							$('#reconcile-bank-dialog-statement-entries').html('<tr><th colspan="7">Statement Entries</th></tr><tr><th>Date</th><th>Description</th><th>Cleared</th><th>Debit</th><th>Credit</th><th>Adjusting Entry</th></tr>');
							$('#reconcile-bank-dialog-count').val(response.length);
							$('#reconcile-bank-dialog-data').val(btoa(JSON.stringify(response)));
							response.forEach(function(item){
								console.log(item);
								var html = $('#reconcile-bank-dialog-statement-entries').html() + '<tr><td>' + item.txdate + '</td><td>' + item.note + '</td><td><input type="checkbox" name="item_' + item.id + '" id="item_' + item.id + '" value="' + item.id + '" /></td><td>' + item.debit + '</td><td>' + item.credit + '</td><td><input type="number" class="w3-input" name="adjusting_entries_' + item.id + '" id="adjusting_entries_' + item.id + '" value=""/></td></tr>';
								$('#reconcile-bank-dialog-statement-entries').html(html);
							});
							//jQuery("#like_counter").html(response.like_count);
							console.log([account,account_type,beginning_date,ending_date]);
							$('#reconcile_bank_action').removeAttr('disabled');

						}
         			}
      			});				
			});
			$('#reconcile_bank_action').on('click', function(e){
				var base64 = $('#reconcile-bank-dialog-data').val();
				var json = atob(base64);
				var data = JSON.parse(json);

				var updates = [];
				data.forEach(function(item){
					var element_id = "item_" + item.id;
					var adjusting_entries_element_id = "adjusting_entries_" + item.id;

					var cleared = document.getElementById(element_id).checked;
					var adjustment = 0.00;
					var note = item.note;
					if (Number(document.getElementById(adjusting_entries_element_id).value) > 0 ) {
						adjustment = Number(document.getElementById(adjusting_entries_element_id).value);
						note = "ADJUSTMENT: " + note
					}
					updates.push({
						id: Number(item.id),
						cleared: cleared,
						adjustment: adjustment,
						date: item.txdate,
						note: note,
						debit: Number(item.debit),
						credit: Number(item.credit)
					});

				});
				console.log(updates);
				
				$.ajax({
         			type : "post",
         			dataType : "json",
         			url : "<?php echo admin_url('admin-ajax.php'); ?>",
         			data : {
						action: "bestbooks_reconcile",
						name: $('#reconcile-bank-dialog-name').val(),
						start: $('#reconcile-bank-dialog-beginning-date').val(),
						end: $('#reconcile-bank-dialog-ending-date').val(),
						updates: updates,
						end_balance: $('#reconcile-bank-dialog-period-bank-balance').val()
					},
         			success: function(response) {
						 console.log(response);
						 alert(response.message);
						 $('#reconcile-bank-dialog').dialog('close');
					}
      			});
			  	return false;
			});
		});
		function bankAction(obj) {
			var choice = obj.value;
			var bank_name = obj.getAttribute('data-name');
			if (choice == "delete") {
				if (confirm("Delete this bank?")) {
					document.getElementById("bankingchoiceform-action").value = choice;
					document.getElementById("bankingchoiceform-post_id").value = obj.getAttribute('data-id');
					document.getElementById("bankingchoiceform").submit();
				}
			} else if(choice == "view") {
				var redirect_url = "<?php echo admin_url('admin.php?page=bestbooks_banking_transactions&bank='); ?>" + bank_name;
				window.location.href = redirect_url;
			} else if (choice == "reconcile") {
				alert("This feature is not implemented!");
				//var bank = JSON.parse(atob(obj.getAttribute('data-bank')));
				//document.getElementById("reconcile-bank-dialog-id").value = bank.id;
				//document.getElementById("reconcile-bank-dialog-name").value = bank.name;
				//showBankReconcileDialog();
			} else if (choice == "edit") {
				alert("This feature is not implemented!");
				//var bank = JSON.parse(atob(obj.getAttribute('data-bank')));
				//console.log(bank);
				//document.getElementById("edit-bank-dialog-id").value = bank.id;
				//document.getElementById("edit-bank-dialog-name").value = bank.name;
				//document.getElementById("edit-bank-dialog-account").value = bank.account_number;
				//var opening_date = bank.opening_date;
				//if (opening_date.length == 8) {
				//	opening_date = bank.opening_date[0] + bank.opening_date[1] + bank.opening_date[2] + bank.opening_date[3] + "-" + bank.opening_date[4] + bank.opening_date[5] + "-" + bank.opening_date[6] + bank.opening_date[7];
				//} 
				//document.getElementById("edit-bank-dialog-opening-date").value = opening_date;
				//document.getElementById("edit-bank-dialog-url").value = bank.url;
				//document.getElementById("edit-bank-dialog-deposit").value = bank.opening_deposit;
				//document.getElementById("edit-bank-dialog-origination").value = bank.origination;
				//showBankEditDialog();
			}
			obj.value = "";
		}
    </script>
    <?php
}
?>