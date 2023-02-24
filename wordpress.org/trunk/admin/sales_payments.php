<?php
require 'inc/SalesPayments_List_Table.inc.php';

function bestbooks_dashboard_sales_payments() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Payments</h2>
		<?php
		$sales_payments_list_table = new SalesPayments_List_Table();
		$sales_payments_list_table->prepare_items();
		$sales_payments_list_table->display();
		?>
	</div>
	<?php	
}
?>