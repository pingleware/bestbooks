<?php
require 'inc/SalesInvoicePaymentTerms_List_Table.inc.php';

function bestbooks_dashboard_sales_invoicepaymentterms() {
    $timezone = get_option("bestbooks_timezone");
	date_default_timezone_set($timezone);
    ?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Invoice Payment Terms&nbsp;
			<a href="<?php echo admin_url('edit-tags.php?taxonomy=bestbooks_payment_term'); ?>" type="button" class="w3-button w3-blue" id="add_invoice_payment_term">Add New Payment Term</a>&nbsp;
			<a href="<?php echo admin_url('edit-tags.php?taxonomy=bestbooks_payment_method'); ?>" type="button" class="w3-button w3-purple" id="add_invoice_payment_method">Add New Payment Method</a>&nbsp;
			<a href="<?php echo admin_url('edit-tags.php?taxonomy=bestbooks_payment_form'); ?>" type="button" class="w3-button w3-green" id="add_invoice_payment_form">Add New Payment Form</a>&nbsp;
		</h2>
		<fieldset>
			<legend>Payment Terms</legend>
			<?php
			$salesinvoicepaymentterms_list_table = new SalesInvoicePaymentTerms_List_Table();
			$salesinvoicepaymentterms_list_table->prepare_items(); 
			$salesinvoicepaymentterms_list_table->display();
			?>
		</fieldset>
		<fieldset>
			<legend>Payment Methods</legend>
			<?php
			$salesinvoicepaymentmethods_list_table = new SalesInvoicePaymentMethods_List_Table();
			$salesinvoicepaymentmethods_list_table->prepare_items(); 
			$salesinvoicepaymentmethods_list_table->display();
			?>
		</fieldset>
		<fieldset>
			<legend>Payment Forms</legend>
			<?php
			$salesinvoicepaymentforms_list_table = new SalesInvoicePaymentForms_List_Table();
			$salesinvoicepaymentforms_list_table->prepare_items(); 
			$salesinvoicepaymentforms_list_table->display();
			?>
		</fieldset>
	</div>
	<!-- JavaScript -->
	<script type="text/javascript">
		function tableAction(obj) {
			var action = obj.value;

			switch(action) {
				case 'viewedit':
				case 'delete':
					var term_id = obj.getAttribute('data-id');
					var taxonomy = obj.getAttribute('data-taxonomy');
					window.location.href = "<?php echo admin_url('term.php?taxonomy='); ?>" + taxonomy + "<?php echo '&tag_ID='; ?>" + term_id + "<?php echo '&post_type=post'; ?>";
					break;
			}
		}
	</script>
    <?php
}
?>