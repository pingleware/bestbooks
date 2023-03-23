<?php
require 'inc/InventoryPurchasesProducts_List_Table.inc.php';

function bestbooks_inventory_purchase_products() {
    if (isset($_POST['add_product_action'])) {
        $args = array(
            'post_type' => 'bestbooks_inventory',
            'post_title' => $_POST['product_name'],
            'post_status' => 'publish',
            'post_content' => $_POST['product_desc']
        );

        $post_id = wp_insert_post($args);

        if (!is_wp_error($post_id)) {
			$term  = get_term_by( 'slug', 'purchase-product', 'inventory_type');
            wp_set_object_terms( $post_id, $term->term_id, 'inventory_type', false );
            update_post_meta($post_id, 'name', $_POST['product_name']);
            update_post_meta($post_id, 'quantity', $_POST['product_quantity']);
            update_post_meta($post_id, 'purchase_date', $_POST['product_purchase_date']);
            update_post_meta($post_id, 'cost', $_POST['product_cost']);
            update_post_meta($post_id, 'vendor', $_POST['product_vendor']);

            $active_company = get_option('bestbooks_active_company');
            if (isset($active_company) === false) {
                $active_company = 0;
            }
            update_post_meta($post_id, 'company', $active_company);
        }
    } elseif (isset($_POST['prodservchoiceform'])) {
		$post_id = $_POST['post_id'];
		wp_delete_post($post_id,true);
	}
	$bestbooks_vendor = get_option("bestbooks_vendor");
	if (isset($bestbooks_vendor) === false) {
		$bestbooks_vendor = "bestbooks_vendor";
	}

	$vendors = get_users(array('role__in'=>array($bestbooks_vendor)));
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_inventory'); ?>">Inventory</a> - Products for Consumption
        &nbsp;<button class="w3-button w3-blue" id="inventory-add-consume-product">Add Product</button>
    </h2>
    <?php
    $inventory_purchases_products_list_table = new InventoryPurchasesProducts_List_Table();
    $inventory_purchases_products_list_table->prepare_items();
    $inventory_purchases_products_list_table->display();
    ?>
    </div>
    <!-- ADD NEW PURCHASE PRODUCT DIALOG -->
	<div id="add-product-dialog" title="Add New Product for Consumption" style="display:none;">
		<form method="post" id="addproductform" name="addproductform">
			<label for="prodserv_vendor">Vendor</label>
			<select class="w3-input" name="product_vendor" id="product_vendor">
				<option value="">Select</option>
			<?php
			foreach($vendors as $vendor) {
				echo '<option value="'.$vendor->ID.'">'.$vendor->display_name . '[' . $vendor->user_email . ']'.'</option>';
			}
			?>
			</select>
			<input type="hidden" name="product_choice" id="product_choice" value="product" />
			<label for="prodserv_name">Name</label>
			<input type="text" id="product_name" name="product_name" class="w3-input" value="" required />
			<label for="prodserv_desc">Description</label>
			<input type="text" id="product_desc" name="product_desc" class="w3-input" value="" required />
			<label for="product_quantity">Quantity</label>
			<input type="number" class="w3-input w3-block" name="product_quantity" id="product_quantity" value="" required />
			<label for="product_purchase_date">Purchase Date</label>
			<input type="date" class="w3-input w3-block" name="product_purchase_date" id="product_purchase_date" value="" required />
			<label for="product_cost">Cost</label>
			<input type="number" class="w3-input w3-block" name="product_cost" id="product_cost" value="" required />
			<br/>
			<input type="submit" id="add_product_action" name="add_product_action" class="w3-button w3-black w3-block" value="Add" />
			<br/>
		</form>
	</div>
	<form id="productchoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="prodservchoiceform-action" value="" />
		<input type="hidden" name="post_id" id="prodservchoiceform-post_id" value="" />
		<input type="hidden" name="taxonomy" id="prodservchoiceform-taxonomy" value="" />
		<input type="hidden" name="prodservchoiceform" id="prodservchoiceform" value="prodservchoiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-product-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('#inventory-add-consume-product').bind('click', function(){
				$('#prodserv_name').val("");
				$('#prodserv_desc').val("");
				$("#add-product-dialog").dialog("open");
				return false;
			});
			$('.delete-button').bind('click', function(){
				if (confirm("Delete account " + $(this).data('id'))) {
					// submit form
				}
			});
		});
		function inventoryAction(obj) {
			var choice = obj.value; //estimateAction.options[estimateAction.selectedIndex].value;
			var post_id = obj.getAttribute("data-id");
			var taxonomy = obj.getAttribute('data-tax');
			if (choice == "delete") {
				if (confirm("Delete this invoice?")) {
					document.getElementById("prodservchoiceform-action").value = choice;
					document.getElementById("prodservchoiceform-post_id").value = post_id;
					document.getElementById("prodservchoiceform-taxonomy").value = taxonomy;
					document.getElementById("productchoiceform").submit();
				}
			}			
		}
	</script>
    <?php
}
?>