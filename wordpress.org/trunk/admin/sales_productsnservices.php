<?php
require 'inc/InventorySalesProducts_List_Table.inc.php';
require 'inc/InventorySalesServices_List_Table.inc.php';

function bestbooks_dashboard_sales_productsnservices() {
	if (isset($_POST['prodserv_choice'])) {
		$choice = $_POST['prodserv_choice'];
		$name = $_POST['prodserv_name'];
		$desc = $_POST['prodserv_desc'];

		$taxonomy = 'bestbooks_sales_' . $choice;

		$term = wp_insert_term($name, $taxonomy, array('description' => $desc));
		if (is_wp_error($term)) {
			$error_string = $term->get_error_message();
			echo '<div id="message" class="error"><p>' . $error_string . '</p></div>';
		}
	} elseif (isset($_POST['prodservchoiceform'])) {
		switch ($_POST['action']) {
			case 'delete':
				wp_delete_term($_POST['post_id'], $_POST['taxonomy']);
				break;
		}
	}
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Products &amp; Services
		&nbsp;<a href="<?php echo admin_url('admin.php?page=bestbooks_inventory_sales_products'); ?>" class="w3-button w3-green">Add Resale Products</a>
		&nbsp;<a href="<?php echo admin_url('admin.php?page=bestbooks_inventory_sales_services'); ?>" class="w3-button w3-purple">Add Resale Services</a>
		</h2>
		<p>Use <a href="<?php echo admin_url('admin.php?page=bestbooks_inventory'); ?>">Inventory</a> to make changes to the products and services?</p>
		<fieldset>
			<legend>Product</legend>
			<?php
			$sales_products_list_table = new InventorySalesProducts_List_Table();
			$sales_products_list_table->prepare_items();
			$sales_products_list_table->display();
			?>
		</fieldset>
		<br/>
		<fieldset>
			<legend>Service</legend>
			<?php
			$sales_services_list_table = new InventorySalesServices_List_Table();
			$sales_services_list_table->prepare_items();
			$sales_services_list_table->display();
			?>
		</fieldset>
	</div>
	<form id="prodservchoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="prodservchoiceform-action" value="" />
		<input type="hidden" name="post_id" id="prodservchoiceform-post_id" value="" />
		<input type="hidden" name="taxonomy" id="prodservchoiceform-taxonomy" value="" />
		<input type="hidden" name="prodservchoiceform" value="prodservchoiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-prodserv-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('.delete-button').bind('click', function(){
				if (confirm("Delete account " + $(this).data('id'))) {
					// submit form
				}
			});
		});
		function prodservAction(obj) {
			var choice = obj.value; //estimateAction.options[estimateAction.selectedIndex].value;
			var post_id = obj.getAttribute("data-id");
			var taxonomy = obj.getAttribute('data-tax');
			if (choice == "delete") {
				if (confirm("Delete this invoice?")) {
					document.getElementById("prodservchoiceform-action").value = choice;
					document.getElementById("prodservchoiceform-post_id").value = post_id;
					document.getElementById("prodservchoiceform-taxonomy").value = taxonomy;
					document.getElementById("prodservchoiceform").submit();
				}
			}			
		}
	</script>
	<?php	
}
?>