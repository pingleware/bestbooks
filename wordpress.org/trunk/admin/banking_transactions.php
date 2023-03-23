<?php
require 'inc/BankTransaction_List_Table.inc.php';

function bestbooks_dashboard_banking_transactions() {
	$coa = get_coa_instance();

	if (isset($_POST['add_transaction_action'])) {
		/**
		 * bank: Bank name
		 * add-transaction-dialog-date: 2021-09-20
		 * add-transaction-dialog-description: Deposit
		 * add-transaction-dialog-debit: 380.00
		 * add-transaction-dialog-credit: 0.00
		 * add-transaction-dialog-account: Cash
		 * add_transaction_action: Add
		 */
		$bankname = $_POST['bank'];
		$debit = $_POST['add-transaction-dialog-debit'];
		$credit = $_POST['add-transaction-dialog-credit'];
		$account = $_POST['add-transaction-dialog-account'];

		$date = $_POST['add-transaction-dialog-date'];
		$description = $_POST['add-transaction-dialog-description'];

		$amount = $debit;
		if ($credit > 0) {
			$amount = $credit * -1;
		}

		// Adds entry into the Ledger
		bestbooks_bank($bankname, $date, $description, $amount, $account);

		// Adds entry into the Journal
		//$journal = new Journal($bankname);
		//$journal->add($date,0,$account,$debit,$credit);
		//$journal->add($date,0,$bankname,$debit,$credit);
	} elseif (isset($_POST['bankingchoiceform'])) {
		switch($_POST['action']) {
			case 'delete':
				{
					$id = $_POST['post_id'];
					$account = $_POST['account'];
					$journal = new Journal($account);
					$journal->remove($id);
				}
				break;
		}
	} elseif (isset($_POST['update_transaction_action'])) {
		$account = $_POST['edit-transaction-dialog-bank'];
		$id = $_POST['edit-transaction-dialog-id'];
		$date = $_POST['edit-transaction-dialog-date'];
		$ref = $_POST['edit-transaction-dialog-reference'];
		$debit = $_POST['edit-transaction-dialog-debit'];
		$credit = $_POST['edit-transaction-dialog-credit'];

		$journal = new Journal($account);
		$journal->update($id,$date,$account,$debit,$credit,$ref);
	} elseif (isset($_REQUEST['bulk_action'])) {
		if (isset($_REQUEST['transactions'])) {
			$transactions = $_REQUEST['transactions'];
			if (is_array($transactions)) {
				foreach($transactions as $transaction) {
					$account = $_REQUEST['bank'];
					$journal = new Journal($account);
					$journal->remove($transaction);
				}
			}
		}
	}
	$banktransaction_list_table = new BankTransaction_List_Table();
	$bankname = $_GET['bank'];
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_banking'); ?>">Banking</a> - <?php echo $bankname; ?>
		<button class="w3-button w3-blue" id="add_transaction">Add New Transaction</button>
		</h2>
		<?php
			$banktransaction_list_table->prepare_items();
			$banktransaction_list_table->display();
		?>
	</div>
	<!-- ADD TRANSACTION DIALOG -->
	<div id="add-transaction-dialog" title="Add New Transaction" style="display:none;">
		<form method="post" id="addtransactionform">
			<br/>
			<input type="hidden" name="bank" value="<?php echo $bankname; ?>" />
			<label for="add-transaction-dialog-date">Date</label>
			<input type="date" class="w3-input w3-block" name="add-transaction-dialog-date" id="add-transaction-dialog-date" value="" />
			<label for="add-transaction-dialog-description">Description</label>
			<input type="text" class="w3-input w3-block" name="add-transaction-dialog-description" id="add-transaction-dialog-description" value="" />
			<label for="add-transaction-dialog-debit">Debit</label>
			<input type="text" class="w3-input w3-block" name="add-transaction-dialog-debit" id="add-transaction-dialog-debit" value="0.00" />
			<label for="add-transaction-dialog-credit">Credit</label>
			<input type="text" class="w3-input w3-block" name="add-transaction-dialog-credit" id="add-transaction-dialog-credit" value="0.00" />
			<label for="add-transaction-dialog-account">Account</label>
			<select class="w3-input w3-block" name="add-transaction-dialog-account" id="add-transaction-dialog-account">
				<option value="">Select</option>
				<?php foreach ($coa->account as $name => $type) : ?>
					<?php if (!empty($name) && $type !== 'Bank') : ?>
					<option value="<?php echo $name; ?>" data-type="<?php echo $type; ?>"><?php echo $name; ?></option>
					<?php endif; ?>
				<?php endforeach; ?>
			</select>
			<br/>
			<input type="submit" id="add_transaction_action" name="add_transaction_action" class="w3-button w3-black w3-block" value="Add" />
			<br/>
		</form>
	</div>
	<!-- EDIT TRANSACTION DIALOG -->
	<div id="edit-transaction-dialog" title="Edit Transaction" style="display:none;">
	<form method="post" id="edittransactionform">
			<br/>
			<input type="hidden" name="edit-transaction-dialog-id" id="edit-transaction-dialog-id" value="0" />
			<input type="hidden" name="edit-transaction-dialog-bank" id="edit-transaction-dialog-bank" value="" />
			<label for="edit-transaction-dialog-date">Date</label>
			<input type="date" class="w3-input w3-block" name="edit-transaction-dialog-date" id="edit-transaction-dialog-date" value="" />
			<label for="edit-transaction-dialog-reference">Reference</label>
			<input type="text" class="w3-input w3-block" name="edit-transaction-dialog-reference" id="edit-transaction-dialog-reference" value="" />
			<label for="edit-transaction-dialog-debit">Debit</label>
			<input type="text" class="w3-input w3-block" name="edit-transaction-dialog-debit" id="edit-transaction-dialog-debit" value="" />
			<label for="edit-transaction-dialog-credit">Credit</label>
			<input type="text" class="w3-input w3-block" name="edit-transaction-dialog-credit" id="edit-transaction-dialog-credit" value="" />
			<br/>
			<input type="submit" id="update_transaction_action" name="update_transaction_action" class="w3-button w3-black w3-block" value="Update" />
			<br/>
		</form>
	</div>
	<form id="bankingchoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="bankingchoiceform-action" value="" />
		<input type="hidden" name="account" id="bankingchoiceform-account" value="" />
		<input type="hidden" name="post_id" id="bankingchoiceform-post_id" value="" />
		<input type="hidden" name="bankingchoiceform" value="bankingchoiceform" />
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
			showEditDialog = function(transaction) {
				$("#edit-transaction-dialog-id").val(transaction.id);
				$("#edit-transaction-dialog-date").val(transaction.txdate);
				$("#edit-transaction-dialog-bank").val(transaction.account);
				$("#edit-transaction-dialog-reference").val(transaction.ref);
				$("#edit-transaction-dialog-debit").val(transaction.debit);
				$("#edit-transaction-dialog-credit").val(transaction.credit);
				$('#edit-transaction-dialog-account').val(transaction.account);
				$("#edit-transaction-dialog").dialog("open");
				return false;
			}
		});
		function bankTransactionAction(obj) {
			var choice = obj.value;
			var transaction = JSON.parse(atob(obj.getAttribute('data-transaction')));
			console.log([choice, transaction]);
			if (choice == "delete") {
				if (confirm("Delete this transaction?")) {
					document.getElementById("bankingchoiceform-action").value = choice;
					document.getElementById("bankingchoiceform-post_id").value = transaction.id;
					document.getElementById("bankingchoiceform-account").value = transaction.account;
					document.getElementById("bankingchoiceform").submit();
				}
			} else if(choice == "edit") {
				showEditDialog(transaction);
			}
		}
	</script>
	<?php	
}

?>
