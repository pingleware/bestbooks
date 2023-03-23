<?php
require ('sales_estimates.php');
require ('sales_invoices.php');
require ('sales_recurring_invoices.php');
require ('sales_payments.php');
require ('sales_customer_statements.php');
require ('sales_customers.php');
require ('sales_productsnservices.php');
require ('sales_invoicepaymentterms.php');
require ('sales_taxjurisdictions.php');
require ('sales_functions.php');

function bestbooks_dashboard_sales() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - Sales</h2>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_estimates'); ?>">Estimates</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_invoices'); ?>">Invoices</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_recurringinvoices'); ?>">Recurring Invoices</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_payments'); ?>">Payments</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_customerstatements'); ?>">Customer Statements</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_customers'); ?>">Customers</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_productsnservices'); ?>">Products &amp; Services</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_invoiceterms'); ?>">Payment Terms, Methods and Forms</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_taxjurisdictions'); ?>">Sales Tax Jurisdictions</a><br/>
	</div>
	<?php	
}
?>