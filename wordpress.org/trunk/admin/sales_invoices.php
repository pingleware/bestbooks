<?php
require 'inc/SalesInvoices_List_Table.inc.php';

function bestbooks_dashboard_sales_invoices() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Invoices&nbsp;
			<input type="button" class="w3-button w3-blue" id="add-invoice" value="Create an Invoice" />
		</h2>
		<?php
		$sales_invoices_list_table = new SalesInvoices_List_Table();
		$sales_invoices_list_table->prepare_items();
		$sales_invoices_list_table->display();
		?>
	</div>
	<?php	
}
?>