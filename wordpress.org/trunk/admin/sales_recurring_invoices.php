<?php
require 'inc/SalesRecurringInvoices_List_Table.inc.php';

function bestbooks_dashboard_sales_recurringinvoices() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Recurring Invoices&nbsp;
			<input type="button" class="w3-button w3-blue" id="add-recurring-invoice" value="Create an Recurring Invoice" />
		</h2>
		<?php
		$sales_recurringinvoices_list_table = new SalesRecurringInvoices_List_Table();
		$sales_recurringinvoices_list_table->prepare_items();
		$sales_recurringinvoices_list_table->display();
		?>
	</div>
	<?php	
}
?>