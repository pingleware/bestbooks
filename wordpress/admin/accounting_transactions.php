<?php
require 'inc/Transactions_List_Table.inc.php';

function bestbooks_dashboard_accounting_transactions() {
	if (isset($_POST['transactionschoiceform'])) {
		$choice = $_POST['action'];
		$id = $_POST['post_id'];

		switch($choice) {
			case 'delete':
				{
					Ledger::remove($id);
				}
				break;
		}
	} elseif (isset($_REQUEST['bulk_action'])) {
		$transactions = $_REQUEST['transactions'];
		if (is_array($transactions)) {
			foreach($transactions as $transaction) {
				Ledger::remove($transaction);
			}
		}
	}

	$transactions_list_table = new Transactions_List_Table();


	$results = Ledger::getAll();
	$total = $results['total'];
	$transactions = $results['transactions'];
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_accounting'); ?>">Accounting</a> - Transactions&nbsp;
			<input type="button" id="add_transaction" value="Add Transaction" class="w3-button w3-blue" />
		</h2>
		<?php
		$transactions_list_table->prepare_items(); 
		$transactions_list_table->display();
		?>
	</div>
	<div id="add-transaction-dialog" title="Add New Transaction" style="display:none;">
		<?php
		$coa = get_coa_instance();
		$results = array();
		?>
		<label for="account_name">Account</label>
		<select id="account_name" class="w3-input w3-block" name="account_name">
			<option value="">Select</option>
			<?php foreach ($coa->account as $name => $type) : ?>
				<?php if (!empty($name)) : ?>
				<option value="<?php echo $name; ?>" data-type="<?php echo $type; ?>"><?php echo $name; ?></option>
				<?php endif; ?>
			<?php endforeach; ?>
		</select>
		<br/>
		<label for="account_type">Type</label>
		<select id="account_type" class="w3-input w3-block" name="account_type">
			<?php
			$results = AccountTypes::getConstList();
			?>
			<option value="">Select</option>
			<?php foreach ($results as $type => $name) : ?>
				<option value="<?php echo $type; ?>"><?php echo $name; ?></option>
			<?php endforeach; ?>
		</select>
		<br/>
		<label for="account_date">Date</label>
		<input type="date" class="w3-input w3-block" name="account_date" id="account_date" value="" />
		<br/>
		<label for="account_description">Description</label>
		<input type="text" class="w3-input w3-block" name="account_description" id="account_description" value="" />
		<br/>
		<label for="account_debit">Debit</label>
		<input type="number" class="w3-input w3-block" name="account_debit" id="account_debit" value="0.00" />
		<br/>
		<label for="account_credit">Credit</label>
		<input type="number" class="w3-input w3-block" name="account_credit" id="account_credit" value="0.00" />
		<br/>
		<input type="button" class="w3-button w3-block w3-black" id="add_transaction_action" name="add_transaction_action" value="Add" />
	</div>	
	<div id="edit-transaction-dialog" title="Editing a Transaction" style="display:none;">
	<?php
		$coa = get_coa_instance();
		$results = array();
		?>
		<input type="hidden" name="edit_account_id" id="edit_account_id" value="0" />
		<input type="hidden" name="edit_account_type" id="edit_account_type" value="0" />
		<label for="edit_account_name">Account</label>
		<select id="edit_account_name" class="w3-input w3-block" name="edit_account_name">
			<option value="">Select</option>
			<?php foreach ($coa->account as $name => $type) : ?>
				<?php if (!empty($name)) : ?>
				<option value="<?php echo $name; ?>" data-type="<?php echo $type; ?>"><?php echo $name; ?></option>
				<?php endif; ?>
			<?php endforeach; ?>
		</select>
		<br/>
		<label for="edit_account_date">Date</label>
		<input type="date" class="w3-input w3-block" name="edit_account_date" id="edit_account_date" value="" />
		<br/>
		<label for="edit_account_description">Description</label>
		<input type="text" class="w3-input w3-block" name="edit_account_description" id="edit_account_description" value="" />
		<br/>
		<label for="edit_account_debit">Debit</label>
		<input type="number" class="w3-input w3-block" name="edit_account_debit" id="edit_account_debit" value="0.00" />
		<br/>
		<label for="edit_account_credit">Credit</label>
		<input type="number" class="w3-input w3-block" name="edit_account_credit" id="edit_account_credit" value="0.00" />
		<br/>
		<input type="button" class="w3-button w3-block w3-black" id="update_transaction_action" name="update_transaction_action" value="Update" />
	</div>
	<form id="transactionschoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="transactionschoiceform-action" value="" />
		<input type="hidden" name="post_id" id="transactionschoiceform-id" value="" />
		<input type="hidden" name="transactionschoiceform" value="transactionschoiceform" />
	</form>
	<script type="text/javascript">
		jQuery(document).ready(function($){
			$("#add-transaction-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
			});
			$('#edit-transaction-dialog').dialog({
				autoOpen : false, modal : true, show : "blind", hide : "blind"
			});
			$('#add_transaction').bind('click', function(){
				$("#add-transaction-dialog").dialog("open");
				return false;
			});
			$('#add_transaction_action').bind('click', function(){
				$.ajax({
					url: "<?php echo admin_url('admin-ajax.php'); ?>",
					type: "post",
					data: {
						action: "bestbooks_add_transaction",
						type: $('#account_type').val(),
						account: $('#account_name').val(),
						date: $('#account_date').val(),
						description: $('#account_description').val(),
						debit: $('#account_debit').val(),
						credit: $('#account_credit').val()
					},
					success: function(results) {
						alert(results);
						$("#add-transaction-dialog").dialog("close");
						location.reload();
					}
				});
			});
			showEditDialog = function() {
				$("#edit-transaction-dialog").dialog("open");
				return false;
			}
			$('#update_transaction_action').bind('click', function(){
				var opt = document.getElementById('edit_account_name').options[document.getElementById('edit_account_name').selectedIndex];
				var type = opt.getAttribute('data-type');

				$.ajax({
					url: "<?php echo admin_url('admin-ajax.php'); ?>",
					type: "post",
					data: {
						action: "bestbooks_edit_transaction",
						id: $('#edit_account_id').val(),
						type: type,
						account: $('#edit_account_name').val(), 
						date: $('#edit_account_date').val(),
						description: $('#edit_account_description').val(),
						debit: $('#edit_account_debit').val(),
						credit: $('#edit_account_credit').val()
					},
					success: function(results) {
						//alert(results);
						$("#edit-transaction-dialog").dialog("close");
						location.reload();
					}
				});
			});
		});
		function transactionAction(obj) {
			var choice = obj.value;
			var id = obj.getAttribute('data-id');

			switch(choice) {
				case 'delete':
					{
						if (confirm("Delete this invoice?")) {
							document.getElementById("transactionschoiceform-action").value = choice;
							document.getElementById("transactionschoiceform-id").value = id;
							document.getElementById("transactionschoiceform").submit();
						}
					}
					break;
				case 'edit':
					{
						var transaction = JSON.parse(atob(obj.getAttribute('data-transaction')));
						document.getElementById('edit_account_id').value = transaction.id;
						document.getElementById('edit_account_name').value = transaction.name;
						//document.getElementById('edit_account_type').value = type;
						document.getElementById('edit_account_date').value = transaction.txdate;
						document.getElementById('edit_account_description').value = transaction.note;
						document.getElementById('edit_account_debit').value = transaction.debit;
						document.getElementById('edit_account_credit').value = transaction.credit;
						console.log(transaction);
						showEditDialog();
					}
					break;
			}
		}
	</script>
	<?php	
}
?>