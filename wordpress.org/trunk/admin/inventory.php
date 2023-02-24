<?php
require('inventory_sales_products.php');
require('inventory_sales_services.php');
require('inventory_purchase_products.php');
require('inventory_purchase_services.php');
require('inventory_capital_assets.php');

function bestbooks_dashboard_inventory() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - Inventory</h2>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_inventory_sales_products'); ?>">Sales Products</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_inventory_sales_services'); ?>">Sales Services</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_inventory_purchase_products'); ?>">Purchase Products</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_inventory_purchase_services'); ?>">Purchase Services</a><br>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_inventory_capital_assets'); ?>">Capital Assets</a><br>
	</div>
	<?php	
}
?>