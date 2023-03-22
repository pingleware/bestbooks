<?php
function bestbooks_dashboard_sales() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - Sales</h2>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_estimates'); ?>">Estimates</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_invoices'); ?>">Invoices</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_recurringinvoices'); ?>">Recurring Invoices</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_payments'); ?>">Payments</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_customerstatements'); ?>">Customer Statements</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_customers'); ?>">Customers</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_sales_productsnservices'); ?>">Products &amp; Services</a><br/>
	</div>
	<?php	
}

function bestbooks_dashboard_sales_estimates() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>
			BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Estimates&nbsp;
			<input type="button" class="w3-button w3-blue" name="add-estimate" id="add-estimate" value="Create an Estimate" />
		</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
		<!--
		<table>
			<th>Status</th>
			<th>Date</th>
			<th>Number</th>
			<th>Customer</th>
			<th>Amount</th>
			<tr>
				<td></td><td></td><td></td><td></td><td></td>
			</tr>
		</table>
		-->
	</div>
	<?php	
}

function bestbooks_dashboard_sales_invoices() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Invoices&nbsp;
			<input type="button" class="w3-button w3-blue" id="add-invoice" value="Create an Invoice" />
		</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_sales_recurringinvoices() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Recurring Invoices&nbsp;
			<input type="button" class="w3-button w3-blue" id="add-recurring-invoice" value="Create an Recurring Invoice" />
		</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_sales_payments() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Payments</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_sales_customerstatements() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Customer Statements</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_sales_customers() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Customers&nbsp;
			<input type="button" class="w3-button w3-blue" id="add-customer" value="Add a Customer" />
		</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_sales_productsnservices() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Products &amp; Services&nbsp;
			<input type="button" class="w3-button w3-blue" id="add-product-service" value="Add a product or service" />
		</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

?>