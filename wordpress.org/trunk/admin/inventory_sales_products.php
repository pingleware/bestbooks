<?php
require 'inc/InventorySalesProducts_List_Table.inc.php';

function bestbooks_inventory_sales_products() {
    if (isset($_POST['add_product_action'])) {
        $args = array(
            'post_type' => 'bestbooks_inventory',
            'post_title' => $_POST['product_name'],
            'post_status' => 'publish',
            'post_content' => $_POST['product_desc']
        );

        $post_id = wp_insert_post($args);

        if (!is_wp_error($post_id)) {
			$term  = get_term_by( 'slug', 'sales-product', 'inventory_type');
            wp_set_object_terms( $post_id, $term->term_id, 'inventory_type', false );
            update_post_meta($post_id, 'name', $_POST['product_name']);
            update_post_meta($post_id, 'quantity', $_POST['product_quantity']);
            update_post_meta($post_id, 'unit_type', $_POST['product_unit_type']);
            update_post_meta($post_id, 'cost', $_POST['product_cost']);
            update_post_meta($post_id, 'price', $_POST['product_price']);

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
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
        <h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_inventory'); ?>">Inventory</a> - Products for Resale
            &nbsp;<button class="w3-button w3-blue" id="inventory-add-resale-product">Add Product</button>
        </h2>
        <p>See more at <i><a href="https://www.accountingtools.com/articles/accounting-for-inventory.html" target="_blank" style="text-decoration:none;">Accounting for Inventory</a></i></p>
        <h3>BestBooks inventory uses the <a href="https://www.principlesofaccounting.com/chapter-8/perpetual-inventory-systems/" target="_blank">perpetural system</a></h3>
        <?php
        $inventory_sales_products_list_table = new InventorySalesProducts_List_Table();
        $inventory_sales_products_list_table->prepare_items();
        $inventory_sales_products_list_table->display();
        ?>
    </div>
    <!-- ADD NEW PURCHASE SERVICE DIALOG -->
	<div id="add-product-dialog" title="Add New Product for Resale" style="display:none;">
		<form method="post" id="addproductform" name="addproductform">
            <label for="product_name">Name</label>
            <input type="text" id="product_name" name="product_name" class="w3-input" value="" required />
            <label for="product_desc">Description</label>
            <input type="text" id="product_desc" name="product_desc" class="w3-input" value="" required />
            <label for="product_quantity">Unit Quantity</label>
            <input type="number" class="w3-input w3-block" name="product_quantity" id="product_quantity" value="" required />
            <label for="product_unit_type">Unit Type</label>
            <input type="text" class="w3-input w3-block" name="product_unit_type" id="product_unit_type" value="" required />
            <label for="product_cost">Cost</label>
            <input type="number" class="w3-input w3-block" name="product_cost" id="product_cost" value="" required />
            <label for="product_price">Price</label>
            <input type="number" class="w3-input w3-block" name="product_price" id="product_price" value="" required />
            <br/>
            <input type="submit" id="add_product_action" name="add_product_action" class="w3-button w3-black w3-block" value="Add" />
            <br/>
		</form>
	</div>
	<form id="servicechoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="prodservchoiceform-action" name="prodservchoiceform-action" value="" />
		<input type="hidden" name="post_id" id="prodservchoiceform-post_id" name="prodservchoiceform-post_id" value="" />
		<input type="hidden" name="taxonomy" id="prodservchoiceform-taxonomy" name="prodservchoiceform-taxonomy" value="" />
		<input type="hidden" name="prodservchoiceform" id="prodservchoiceform" value="prodservchoiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-product-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('#inventory-add-resale-product').bind('click', function(){
				$('#product_name').val("");
				$('#product_desc').val("");
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
				if (confirm("Delete this item?")) {
					document.getElementById("prodservchoiceform-action").value = choice;
					document.getElementById("prodservchoiceform-post_id").value = post_id;
					document.getElementById("prodservchoiceform-taxonomy").value = taxonomy;
					document.getElementById("servicechoiceform").submit();
				}
			}			
		}
	</script>
    <?php
}
?>