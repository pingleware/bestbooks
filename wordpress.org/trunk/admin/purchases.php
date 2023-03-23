<?php
require ('purchases_order.php');
require ('purchases_bills.php');
require ('purchases_receipts.php');
require ('purchases_vendors.php');
require ('purchases_productsnservices.php');
require ('purchases_paymentterms.php');

function bestbooks_dashboard_purchases() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - Purchases</h2>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_order'); ?>">Purchase Order</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_bills'); ?>">Bills</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_receipts'); ?>">Receipts</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_vendors'); ?>">Vendors</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_productsnservices'); ?>">Product &amp; Services</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_paymentterms'); ?>">Payment Terms, Methods and Forms</a><br/>
	</div>
	<?php	
}
?>