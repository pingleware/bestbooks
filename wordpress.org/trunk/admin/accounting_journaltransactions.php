<?php
require 'inc/JournalTransactions_List_Table.inc.php';

function bestbooks_dashboard_accounting_journaltransactions() {
	if (isset($_POST['journaltransactionschoiceform'])) {
		$choice = $_POST['action'];
		$id = $_POST['post_id'];

		switch($choice) {
			case 'delete':
				{
					$active_company = get_option('bestbooks_active_company');
					if (isset($active_company) === false) {
						$active_company = 0;
					}
					Journal::remove($id,$active_company);
				}
				break;
		}
	}
	$journal_transactions = new JournalTransactions_List_Table();
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_accounting'); ?>">Accounting</a> - Journal Transactions&nbsp;
			<input type="button" id="add_transaction" value="Add transaction" class="w3-button w3-blue" />&nbsp;
		</h2>
		<?php
		$journal_transactions->prepare_items(); 
		$journal_transactions->display(); 		
		?>
	</div>
	<div id="add-transaction-dialog" title="Add New Transaction" style="display:none;">
		<?php
		$coa = get_coa_instance();
		$results = array();
		$journals = Journal::listJournals();
		?>
		<label for="account_journal">Journal</label>
		<select id="account_journal" class="w3-input w3-block" name="account_journal">
			<option value="">Select</option>
			<?php
			foreach($journals as $index => $journal) {
				$selected = '';
				if (isset($_GET['journal'])) {
					if ($journal === $_GET['journal']) {
						$selected = 'selected';
					}
				}

				echo '<option value="'.$journal.'" '.$selected.'>'.$journal.'</option>';
			}
			?>
		</select>
		<br/>
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
		<label for="account_date">Date</label>
		<input type="date" class="w3-input w3-block" name="account_date" id="account_date" value="" />
		<br/>
		<label for="account_reference">Reference</label>
		<input type="number" class="w3-input w3-block" name="account_reference" id="account_reference" value="" />
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
	<!-- Edit Journal Transaction -->	
	<div id="edit-transaction-dialog" title="Edit Journal Transaction" style="display:none;">
	<?php
		$coa = get_coa_instance();
		$results = array();
		$journals = Journal::listJournals();
		?>
		<input type="hidden" name="edit_account_id" id="edit_account_id" value="0" />
		<label for="edit_account_journal">Journal</label>
		<select id="edit_account_journal" class="w3-input w3-block" name="edit_account_journal">
			<option value="">Select</option>
			<?php
			foreach($journals as $index => $journal) {
				$selected = '';
				if (isset($_GET['journal'])) {
					if ($journal === $_GET['journal']) {
						$selected = 'selected';
					}
				}

				echo '<option value="'.$journal.'" '.$selected.'>'.$journal.'</option>';
			}
			?>
		</select>
		<br/>
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
		<label for="edit_account_reference">Reference</label>
		<input type="number" class="w3-input w3-block" name="edit_account_reference" id="edit_account_reference" value="" />
		<br/>
		<label for="edit_account_debit">Debit</label>
		<input type="number" class="w3-input w3-block" name="edit_account_debit" id="edit_account_debit" value="0.00" />
		<br/>
		<label for="edit_account_credit">Credit</label>
		<input type="number" class="w3-input w3-block" name="edit_account_credit" id="edit_account_credit" value="0.00" />
		<br/>
		<input type="button" class="w3-button w3-block w3-black" id="update_transaction_action" name="update_transaction_action" value="Update" />
	</div>
	<form id="journaltransactionschoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="journaltransactionschoiceform-action" value="" />
		<input type="hidden" name="post_id" id="journaltransactionschoiceform-id" value="" />
		<input type="hidden" name="journaltransactionschoiceform" value="journaltransactionschoiceform" />
	</form>
	<script type="text/javascript">
		jQuery(document).ready(function($){
			$("#add-transaction-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
			});
			$("#edit-transaction-dialog").dialog({
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
						action: "bestbooks_add_journal_transaction",
						name: $('#account_journal').val(),
						account: $('#account_name').val(),
						date: $('#account_date').val(),
						ref: $('#account_reference').val(),
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
			$('#update_transaction_action').bind('click', function(){
				$.ajax({
					url: "<?php echo admin_url('admin-ajax.php'); ?>",
					type: "post",
					data: {
						action: "bestbooks_edit_journal_transaction",
						id: $('#edit_account_id').val(),
						account: $('#edit_account_name').val(),
						name: $('#edit_account_journal').val(), 
						date: $('#edit_account_date').val(),
						ref: $('#edit_account_reference').val(),
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
			showEditTransactionDialog = function() {
				$("#edit-transaction-dialog").dialog("open");
				return false;
			}
		});
		function journalAction(obj) {
			var choice = obj.value;
			var id = obj.getAttribute('data-id');
			switch(choice) {
				case 'edit':
					{
						var transaction = JSON.parse(atob(obj.getAttribute('data-transaction')));
						console.log(transaction);
						document.getElementById('edit_account_id').value = id;
						document.getElementById('edit_account_journal').value = transaction.name;
						document.getElementById('edit_account_name').value = transaction.account;
						document.getElementById('edit_account_date').value = transaction.txdate;
						document.getElementById('edit_account_reference').value = transaction.ref;
						document.getElementById('edit_account_debit').value = transaction.debit;
						document.getElementById('edit_account_credit').value = transaction.credit;

						showEditTransactionDialog();
					}
					break;
				case 'delete':
					{
						if (confirm("Delete this invoice?")) {
							document.getElementById("journaltransactionschoiceform-action").value = choice;
							document.getElementById("journaltransactionschoiceform-id").value = id;
							document.getElementById("journaltransactionschoiceform").submit();
						}
					}
					break;
			}
		}
	</script>
	<?php	
}
?>