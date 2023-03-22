<?php
require ('accounting_transactions.php');
require ('accounting_reconciliation.php');
require ('accounting_chartofaccounts.php');
require ('accounting_journaltransactions.php');
require ('accounting_startingbalances.php');

function bestbooks_dashboard_accounting() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__); ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - Accounting</h2>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_accounting_transactions'); ?>">Transactions</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_accounting_chartofaccounts'); ?>">Chart of Accounts</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_accounting_journaltransactions'); ?>">Journal Transactions</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="https://www.fiverr.com/search/gigs?query=bookkeeper" target="_blank">Hire a Bookkeeper</a><br>
	</div>
	<?php	
}
?>