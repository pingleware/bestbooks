<?php
function bestbooks_dashboard_reports() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - Reports</h2>
		<fieldset>
			<legend>Financial Statements</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_balancesheet'); ?>" class="primary_button button w3-button w3-block w3-blue">Balance Sheet</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_incomestatement'); ?>" class="primary_button button w3-button w3-block w3-blue">Income Statement</a>
		</fieldset>
		<fieldset>
			<legend>Taxes</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_salestaxreport'); ?>" class="primary_button button w3-button w3-block w3-blue">Sales Tax Report</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_payrollwagetaxreport'); ?>" class="primary_button button w3-button w3-block w3-blue">Payroll Wage &amp; Tax Report</a>
		</fieldset>
		<fieldset>
			<legend>Customers</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_incomebycustomer'); ?>" class="primary_button button w3-button w3-block w3-blue">Income by Customer</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_agedreceivables'); ?>" class="primary_button button w3-button w3-block w3-blue">Aged Receivables</a>
		</fieldset>
		<fieldset>
			<legend>Vendors</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_expensebyvendor'); ?>" class="primary_button button w3-button w3-block w3-blue">Expense by Vendor</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_agedpayables'); ?>" class="primary_button button w3-button w3-block w3-blue">Aged Payables</a>
		</fieldset>
		<fieldset>
			<legend>Other</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_general_ledger'); ?>" class="primary_button button w3-button w3-block w3-blue">General Ledger</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_account_transactions'); ?>" class="primary_button button w3-button w3-block w3-blue">Account Transactions</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_trialbalance'); ?>" class="primary_button button w3-button w3-block w3-blue">Trial Balance</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_gainlossonforeigncurrencyexchange'); ?>" class="primary_button button w3-button w3-block w3-blue">Gain/Loss on Foreign Currency Exchange</a>
		</fieldset>
	</div>
	<?php	
}

function bestbooks_dashboard_reports_balancesheet() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Balance Sheet</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_incomestatement() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Income Statement</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_salestaxreport() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Sales Tax Report</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_payrollwagetaxreport() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Payroll Wage &amp; Tax Report</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_incomebycustomer() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Income by Customer</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_agedreceivables() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Aged Receivables</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_expensebyvendor() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Expense by Vendor</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_agedpayables() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Aged Payables</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_general_ledger() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - General Ledger</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_account_transactions() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Account Transactions</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_trialbalance() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Trial Balance</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_gainlossonforeigncurrencyexchange() {
	?>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Gain/Loss on Foreign Currency Exchange</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}
?>