<?php
require 'inc/InventorySalesServices_List_Table.inc.php';

function bestbooks_inventory_sales_services() {
    if (isset($_POST['add_service_action'])) {
        $args = array(
            'post_type' => 'bestbooks_inventory',
            'post_title' => $_POST['service_name'],
            'post_status' => 'publish',
            'post_content' => $_POST['service_desc']
        );

        $post_id = wp_insert_post($args);

        if (!is_wp_error($post_id)) {
			$term  = get_term_by( 'slug', 'sales-service', 'inventory_type');
            wp_set_object_terms( $post_id, $term->term_id, 'inventory_type', false );
            update_post_meta($post_id, 'name', $_POST['service_name']);
            update_post_meta($post_id, 'quantity', $_POST['service_quantity']);
            update_post_meta($post_id, 'unit_type', $_POST['service_unit_type']);
            update_post_meta($post_id, 'cost', $_POST['service_cost']);
            update_post_meta($post_id, 'price', $_POST['service_price']);

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
        <h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_inventory'); ?>">Inventory</a> - Services for Resale
            &nbsp;<button class="w3-button w3-blue" id="inventory-add-resale-product">Add Service</button>
        </h2>
        <?php
        $inventory_sales_services_list_table = new InventorySalesServices_List_Table();
        $inventory_sales_services_list_table->prepare_items();
        $inventory_sales_services_list_table->display();
        ?>
    </div>
    <!-- ADD NEW PURCHASE SERVICE DIALOG -->
	<div id="add-service-dialog" title="Add New Service for Resale" style="display:none;">
		<form method="post" id="addserviceform" name="addserviceform">
            <label for="service_name">Name</label>
            <input type="text" id="service_name" name="service_name" class="w3-input" value="" required />
            <label for="service_desc">Description</label>
            <input type="text" id="service_desc" name="service_desc" class="w3-input" value="" required />
            <label for="service_quantity">Quantity</label>
            <input type="number" class="w3-input w3-block" name="service_quantity" id="service_quantity" value="" required />
            <label for="service_unit_type">Unit Type</label>
            <input type="text" class="w3-input w3-block" name="service_unit_type" id="service_unit_type" value="" required />
            <label for="service_cost">Cost</label>
            <input type="number" class="w3-input w3-block" name="service_cost" id="service_cost" value="" required />
            <label for="service_price">Price</label>
            <input type="number" class="w3-input w3-block" name="service_price" id="service_price" value="" required />
            <br/>
            <input type="submit" id="add_service_action" name="add_service_action" class="w3-button w3-black w3-block" value="Add" />
            <br/>
		</form>
	</div>
	<form id="servicechoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="prodservchoiceform-action" value="" />
		<input type="hidden" name="post_id" id="prodservchoiceform-post_id" value="" />
		<input type="hidden" name="taxonomy" id="prodservchoiceform-taxonomy" value="" />
		<input type="hidden" name="prodservchoiceform" value="prodservchoiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-service-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('#inventory-add-resale-product').bind('click', function(){
				$('#service_name').val("");
				$('#service_desc').val("");
				$("#add-service-dialog").dialog("open");
				return false;
			});
			//$('#add_service_action').bind('click', function(){
			//	// submit form
			//	document.getElementById("addserviceform").submit();
			//});
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
					document.getElementById("servicechoiceform").submit();
				}
			}			
		}
	</script>
    <?php
}

?>