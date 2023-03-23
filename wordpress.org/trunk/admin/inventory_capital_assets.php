<?php
require 'inc/InventoryCapital_List_Table.inc.php';

function bestbooks_inventory_capital_assets() {
    if (isset($_POST['add-capitalasset-dialog-name'])) {
        $args = array(
            'ID' => $_POST['add-capitalasset-dialog-post-id'],
            'post_type' => 'bestbooks_inventory',
            'post_title' => $_POST['add-capitalasset-dialog-name'],
            'post_status' => 'publish',
            'post_content' => $_POST['add-capitalasset-dialog-description']
        );

        if (intval($_POST['add-capitalasset-dialog-post-id']) > 0) {
            $post_id = wp_update_post($args);
        } else {
            $post_id = wp_insert_post($args);
        }

        if (!is_wp_error($post_id)) {
            wp_set_object_terms( $post_id, 'capital-assets', 'inventory_type', false );
            update_post_meta($post_id, 'name', $_POST['add-capitalasset-dialog-name']);
            update_post_meta($post_id, 'quantity', $_POST['add-capitalasset-dialog-quantity']);
            update_post_meta($post_id, 'purchase_date', $_POST['add-capitalasset-dialog-purchasedate']);
            update_post_meta($post_id, 'acquisition_date', $_POST['add-capitalasset-dialog-acquisitiondate']);
            update_post_meta($post_id, 'disposal_date', $_POST['add-capitalasset-dialog-disposaldate']);
            update_post_meta($post_id, 'cost', $_POST['add-capitalasset-dialog-cost']);
            update_post_meta($post_id, 'value', $_POST['add-capitalasset-dialog-value']);
            update_post_meta($post_id, 'vendor', $_POST['add-capitalasset-dialog-vendor']);

            $active_company = get_option('bestbooks_active_company');
            if (isset($active_company) === false) {
                $active_company = 0;
            }
            update_post_meta($post_id, 'company', $active_company);
        }
    } elseif (isset($_POST['prodservchoiceform'])) {
        $post_id = $_POST['post_id'];
        wp_delete_post($post_id, true);
    }
	$bestbooks_vendor = get_option("bestbooks_vendor");
	if (isset($bestbooks_customer) === false) {
		$bestbooks_vendor = "bestbooks_vendor";
	}

	$vendors = get_users(array('role__in'=>array($bestbooks_vendor)));

    ?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
    <h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_inventory'); ?>">Inventory</a> - Capital Assets
        &nbsp;<button class="w3-button w3-blue" id="inventory-add-capital-asset">Add Capital Asset</button>
        &nbsp;<button class="w3-button w3-green w3-hide" id="inventory-new-allotment">New Allotment</button>
    </h2>
    <?php
    $inventory_capital_list_table = new InventoryCapital_List_Table();
    $inventory_capital_list_table->prepare_items();
    $inventory_capital_list_table->display();
    ?>
    <!-- ADD CAPITAL ASSET DIALOG -->
	<div id="add-capitalasset-dialog" title="Add New Capital Asset" style="display:none;">
        <form method="post" name="addcapitalassetform" id="addcapitalassetform">
            <input type="hidden" name="add-capitalasset-dialog-post-id" id="add-capitalasset-dialog-post-id" value="0" />
            <label for="add-capitalasset-dialog-vendor">Vendor</label>
            <select class="w3-input" name="add-capitalasset-dialog-vendor" id="add-capitalasset-dialog-vendor">
                <option value="">Select</option>
            <?php
            foreach($vendors as $vendor) {
                echo '<option value="'.$vendor->ID.'">'.$vendor->display_name . '[' . $vendor->user_email . ']'.'</option>';
            }
            ?>
            </select>
            <label for="add-capitalasset-dialog-name">Name</label>
            <input type="text" class="w3-input w3-block" name="add-capitalasset-dialog-name" id="add-capitalasset-dialog-name" value="" required />
            <label for="add-capitalasset-dialog-description">Description</label>
            <textarea class="w3-input w3-block" rows="5" name="add-capitalasset-dialog-description" id="add-capitalasset-dialog-description" required></textarea>
            <label for="add-capitalasset-dialog-quantity">Quantity</label>
            <input type="number" class="w3-input w3-block" name="add-capitalasset-dialog-quantity" id="add-capitalasset-dialog-quantity" value="" required />
            <label for="add-capitalasset-dialog-purchasedate">Purchase Date</label>
            <input type="date" class="w3-input w3-block" name="add-capitalasset-dialog-purchasedate" id="add-capitalasset-dialog-purchasedate" value="" required />
            <label for="add-capitalasset-dialog-acquisitiondate">Acquisition Date</label>
            <input type="date" class="w3-input w3-block" name="add-capitalasset-dialog-acquisitiondate" id="add-capitalasset-dialog-acquisitiondate" value="" required />
            <label for="add-capitalasset-dialog-disposaldate">Disposal Date</label>
            <input type="date" class="w3-input w3-block" name="add-capitalasset-dialog-disposaldate" id="add-capitalasset-dialog-disposaldate" value="" required />
            <label for="add-capitalasset-dialog-cost">Cost</label>
            <input type="number" class="w3-input w3-block" name="add-capitalasset-dialog-cost" id="add-capitalasset-dialog-cost" value="" required />
            <label for="add-capitalasset-dialog-value">Value</label>
            <input type="number" class="w3-input w3-block" name="add-capitalasset-dialog-value" id="add-capitalasset-dialog-value" value="" required />
		    <br/>
		    <input type="button" id="add_capitalasset_action" name="add_capitalasset_action" class="w3-button w3-black w3-block" value="Add" />
		    <br/>
		</form>
    </div>
    <!-- NEW ALLOTMENT DIALOG -->
	<div id="add-allotment-dialog" title="Add New Allotment" style="display:none;">
        <form method="post" name="addallotmentform" id="addallotmentform">
            <label for="add-allotment-category">Category</label>
            <select class="w3-input w3-block" name="add-allotment-category" id="add-allotment-category">
                <option value="">-</option>
            </select>
            <label for="add-allotment-item-name">Item Name</label>
            <select class="w3-input w3-block" name="add-allotment-item-name" id="add-allotment-item-name">
                <option value="">-</option>
            </select>
            <label for="add-allotment-item">Item</label>
            <select class="w3-input w3-block" name="add-allotment-item" id="add-allotment-item">
                <option value="">-</option>
            </select>
            <label for="add-allotment-allot-to">Allot To</label>
            <select class="w3-input w3-block" name="add-allotment-allot-to" id="add-allotment-allot-to">
                <option value="">-</option>
            </select>
            <label for="add-allotment-given-date">Given Date</label>
            <input type="date" class="w3-input w3-block" name="add-allotment-given-date" id="add-allotment-given-date" value="" placeholder="" />
            <label for="add-allotment-returnable">Returnable</label>
            <input type="checkbox" class="w3-input" name="add-allotment-returnable" id="add-allotment-returnable" value="yes">&nbsp;Is this item returnable?<br/>
            <label for="add-allotment-return-date">Return Date</label>
            <input type="date" class="w3-input w3-block" name="add-allotment-return-date" id="add-allotment-return-date" value="" placeholder="" />
		    <br/>
		    <input type="button" id="allot_not" name="allot_not" class="w3-button w3-black w3-block" value="Allot" />
		    <br/>
		</form>
        <form id="productchoiceform" method="post" style="display:none;">
		    <input type="hidden" name="action" id="prodservchoiceform-action" value="" />
		    <input type="hidden" name="post_id" id="prodservchoiceform-post_id" value="" />
		    <input type="hidden" name="taxonomy" id="prodservchoiceform-taxonomy" value="" />
		    <input type="hidden" name="prodservchoiceform" id="prodservchoiceform" value="prodservchoiceform" />
	    </form>
    </div>
    <script type="text/javascript">
		jQuery(document).ready(function($){
			$("#add-capitalasset-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: 500, height: 700
  			});
            $('#add-allotment-dialog').dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: 500, height: 500
  			});
			$('#inventory-add-capital-asset').bind('click', function(){
				$("#add-capitalasset-dialog").dialog("open");
				return false;
            });
			$('#add_capitalasset_action').bind('click', function(){
				$("#addcapitalassetform").submit();
				return false;
            });
            $('#inventory-new-allotment').bind('click', function(){
				$("#add-allotment-dialog").dialog("open");
				return false;
            });
            
            showCapitalAssetDialog = function(product) {
                $('#add-capitalasset-dialog-name').value = product.post_title;
                $('#add-capitalasset-dialog-description').value = product.post_content;
                $("#add-capitalasset-dialog").dialog("open");
            }
        });

        function inventoryAction(obj) {
            console.log(obj.value);
            var action = obj.value;
            switch(action) {
                case 'edit':
                    var base64 = obj.getAttribute('data-product');
                    console.log(base64);
                    var json = atob(base64);
                    console.log(json);
                    var product = JSON.parse(json);
                    console.log(product);
                    document.getElementById('add-capitalasset-dialog-post-id').value = product.ID;
                    document.getElementById('add-capitalasset-dialog-vendor').value = product.metadata.vendor[0];
                    document.getElementById('add-capitalasset-dialog-name').value = product.post_title;
                    document.getElementById('add-capitalasset-dialog-description').value = product.post_content;
                    document.getElementById('add-capitalasset-dialog-quantity').value = product.metadata.quantity[0];
                    document.getElementById('add-capitalasset-dialog-purchasedate').value = product.metadata.purchase_date[0];
                    document.getElementById('add-capitalasset-dialog-acquisitiondate').value = product.metadata.acquisition_date[0];
                    document.getElementById('add-capitalasset-dialog-disposaldate').value = product.metadata.disposal_date[0];
                    document.getElementById('add-capitalasset-dialog-cost').value = product.metadata.cost[0];
                    document.getElementById('add-capitalasset-dialog-value').value = product.metadata.quantity[0];

                    showCapitalAssetDialog(product);                    
                    break;
                case 'delete':
                    var post_id = obj.getAttribute("data-id");
			        var taxonomy = obj.getAttribute('data-tax');
                    if (confirm("Delete this invoice?")) {
					    document.getElementById("prodservchoiceform-action").value = action;
					    document.getElementById("prodservchoiceform-post_id").value = post_id;
					    document.getElementById("prodservchoiceform-taxonomy").value = taxonomy;
					    document.getElementById("productchoiceform").submit();
				    }
                    break;
            }
        }
    </script>
    </div>
    <?php
}
?>