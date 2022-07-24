<?php
function bestbooks_dashboard_purchases() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - Purchases</h2>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_bills'); ?>">Bills</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_receipts'); ?>">Receipts</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_vendors'); ?>">Vendors</a><br/>
		<a class="primary_button button w3-button w3-block w3-blue" href="<?php echo admin_url('admin.php?page=bestbooks_purchases_productsnservices'); ?>">Product &amp; Services</a><br/>
	</div>
	<?php	
}

function bestbooks_dashboard_purchases_bills() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Bills</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_purchases_receipts() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Receipts</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_purchases_vendors() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Vendors</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}

function bestbooks_dashboard_purchases_productsnservices() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Products &amp; Services</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php	
}
?>