<?php
/**
 * Dashboard functions for handling Sales - Estimates
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc DBA PINGLEWARE
 */

require 'inc/SalesEstimates_List_Table.inc.php';
require 'inc/SalesEstimatesRejected_List_Table.inc.php';

function bestbooks_dashboard_sales_estimates() {
	$timezone = get_option("bestbooks_timezone");
	date_default_timezone_set($timezone);

	//echo '<pre>'; print_r($_POST); echo '</pre>'; exit;

	if (isset($_POST['estimate-customer'])) {
		if (empty($_POST['edit_post_id'])) {
			$post_id = wp_insert_post(
				array(
					'post_type' => 'bestbooks_invoice',
					'post_status' => 'draft',
					'post_title' => 'Customer #'.$_POST['estimate-customer'],
					'post_password' => $_POST['estimate-password'],
					'post_content' => json_encode($_POST)
				)
			);
			if (is_wp_error($post_id)) {

			} else {
				update_post_meta($post_id,'estimate-invnum',$_POST['estimate-invnum']);
				update_post_meta($post_id,'estimate-status','created');
				update_post_meta($post_id,'estimate-customer',$_POST['estimate-customer']);
			}
		} else {
			$post_id = wp_update_post(
				array(
					'ID' => $_POST['edit_post_id'],
					'post_type' => 'bestbooks_invoice',
					'post_status' => 'draft',
					'post_title' => 'Customer #'.$_POST['estimate-customer'],
					'post_password' => $_POST['estimate-password'],
					'post_content' => json_encode($_POST)
				)
			);
			if (is_wp_error($post_id)) {

			} else {
				update_post_meta($post_id,'estimate-invnum',$_POST['estimate-invnum']);
				update_post_meta($post_id,'estimate-status','created');
				update_post_meta($post_id,'estimate-customer',$_POST['estimate-customer']);
			}
		}
	} elseif (isset($_POST['estimatechoiceform'])) {
		switch ($_POST['action']) {
			case 'delete':
				wp_delete_post($_POST['post_id'], true);
				break;
			case 'invoice':
				$post = get_post($_POST['post_id']);
				$post->post_status = 'publish';
				$metadata = json_decode($post->post_content, true);
				$metadata['estimate-status'] = 'invoiced';
				$post->post_content = json_encode($metadata);
				wp_update_post($post);
				$customer = get_user_by('id', $metadata['estimate-customer']);
				$invnum = $metadata['estimate-invnum'];
				$items = $metadata['items'];
				$total = 0;
				for ($i=0; $i<$items; $i++) {
					$total += $metadata['item_total_'.($i+1)];
				}
				$txdate = $post->post_date;
				$description = "Invoice #$invnum for ".$customer->display_name;

				// Update accounting records for an account receivables on credit because an invoice was created,
				// the customer will have an option to pay the invoice
				// See https://www.accountingtools.com/articles/2017/5/17/accounts-receivable-accounting 
				do_action('bestbooks_sales_card',$txdate,$description,$total);
				break;
			case 'send':
				$post = get_post($_POST['post_id']);
				$password = $post->post_password;
				$metadata = json_decode($post->post_content, true);
				$invnum = $metadata['estimate-invnum'];
				$customer = get_user_by('id', $metadata['estimate-customer']);
				$url = home_url('customer/estimate/?num='.$invnum);
				$subject = 'Your estimate is available';
				$message = "Dear ".$customer->display_name.";<br/><br/>";
				$message .= "Your estimate is available at the following URL. Use the password (if provided) to view your estimate. You have the option to approve, reject or print your estimate?<br/><br/>";
				$message .= "URL: ".$url."<br/>";
				$message .= "Password: ".$password."<br/><br/>";
				$message .= "Regards,<br/>Billing Team<br/>";
				if (wp_mail($customer->user_email,$subject,$message,array('Content-Type: text/html; charset=UTF-8'))) {
					echo '<script type="text/javascript">alert("Invoice #'.$invnum.' sent successfully!");</script>';
				} else {
					echo '<script type="text/javascript">alert("Invoice #'.$invnum.' was not sent?");</script>';
				}
				break;
		}
	}

	if (is_multisite()) {
		$blog_id = get_current_blog_id();
	}

	$active_company = bestbooks_get_active_company();

	$bestbooks_customer = get_option("bestbooks_customer");
	if (isset($bestbooks_customer) === false) {
		$bestbooks_customer = "bestbooks_customer";
	}
	$customers = get_users(array('role__in'=>array($bestbooks_customer)));

	$term  = get_term_by( 'slug', 'sales-product', 'inventory_type');
	$_products = get_posts(
		array(
			'post_type' => 'bestbooks_inventory',
			'post_status' => 'publish',
			'tax_query' => array(
				array(
					'taxonomy' => 'inventory_type',
					'field'    => 'id',
					'terms'    => $term->term_id
				)
			),
			'meta_query' => array(
				'key' => 'company',
				'value' => $active_company,
				'compare' => '=' 
			)
		)
	);
	$products = array();
	foreach($_products as $product) {
		$product->metadata = get_post_meta($product->ID);
		array_push($products, $product);
	}
	$term  = get_term_by( 'slug', 'sales-service', 'inventory_type');
	$_services = get_posts(
		array(
			'post_type' => 'bestbooks_inventory',
			'post_status' => 'publish',
			'tax_query' => array(
				array(
					'taxonomy' => 'inventory_type',
					'field'    => 'id',
					'terms'    => $term->term_id
				)
			),
			'meta_query' => array(
				'key' => 'company',
				'value' => $active_company,
				'compare' => '=' 
			)
		)
	);
	$services = array();
	foreach($_services as $service) {
		$service->metadata = get_post_meta($service->ID);
		array_push($services, $service);
	}

	$terms = get_terms('bestbooks_taxjurisdiction', array('hide_empty' => false));
	$tax_jurisdictions = array();
	foreach($terms as $term) {
		$term->metadata = get_term_meta($term->term_id);
		array_push($tax_jurisdictions, $term);
	}
	$payment_terms = get_terms(
		array(
			'taxonomy' => 'bestbooks_payment_term',
			'hide_empty'=>false
		)
	);

	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>
			BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Estimates&nbsp;
			<input type="button" class="w3-button w3-blue" name="add-estimate" id="add-estimate" value="Create an Estimate" />
			&nbsp;<a href="<?php echo admin_url('admin.php?page=bestbooks_sales_taxjurisdictions'); ?>" class="w3-button w3-green">Add Tax Juirsdiction</a>
		</h2>
		<fieldset>
			<legend>Open Estimates</legend>
			<?php
			$salesestimates_list_table = new SalesEstimates_List_Table();
			$salesestimates_list_table->prepare_items(); 
			$salesestimates_list_table->display();
			?>
		</fieldset>
		<fieldset>
			<legend>Rejected Estimates</legend>
			<?php
			$salesrejectedestimates_list_table = new SalesEstimatesRejected_List_Table();
			$salesrejectedestimates_list_table->prepare_items(); 
			$salesrejectedestimates_list_table->display();
			?>
		</fieldset>
	</div>
	<!-- ADD ESTIMATE DIALOG -->
	<div id="add-estimate-dialog" title="Add New Estimate" style="display:none;">
		<form method="post" id="addestimateform">
			<input 
                type="hidden" 
                name="edit_post_id" 
                id="edit_post_id" 
                value="0" />
			<input 
				type="hidden" 
				name="estimate-status" 
				id="estimate-status" 
				value="created" 
				placeholder="Status: created|sent|invoiced"/>
			<label for="estimate-invnum">Invoice #</label>
			<input 
				type="text" 
				class="w3-input w3-block w3-grey" 
				name="estimate-invnum" 
				id="estimate-invnum" 
				value="<?php echo $salesestimates_list_table->estimate_num; ?>" readonly />
			<label for="estimate-password">Password</label>
			<input 
				type="text" 
				class="w3-input w3-block" 
				name="estimate-password" 
				id="estimate-password" 
				value="" 
				title="Add a password for customer to view this estimate the URL?" />
			<label for="estimate-public-url">URL</label>
			<input 
				type="text" 
				class="w3-input w3-block w3-grey" 
				name="estimate-public-url" 
				id="estimate-public-url" 
				value="<?php echo home_url('customer/estimate/?num='.$salesestimates_list_table->estimate_num); ?>" 
				readonly />
			<label for="estimate-customer">Customer</label>
			<select 
				id="estimate-customer" 
				name="estimate-customer" 
				class="w3-input w3-block"
				onchange="changeCustomer(this)">
				<option value="">Select</option>
				<?php foreach ($customers as $customer) : ?>
					<option value="<?php echo $customer->ID; ?>">
						<?php echo $customer->display_name . '[' . $customer->user_email . ']'; ?>
					</option>
				<?php endforeach; ?>
			</select>
            <label class="w3-block" for="tax_state">Tax Jurisdiction</label>
            <select 
                class="w3-input w3-block" 
                name="tax_jurisdiction" 
                id="tax_jurisdiction"
                onchange="changeState(this);">
                <option value="">Select</option>
                <?php foreach($tax_jurisdictions as $tax_jurisdiction) : ?>
					<?php $taxrate="0.00"; if (isset($tax_jurisdiction->metadata['bestbooks-state-taxrate'][0])) $taxrate = $tax_jurisdiction->metadata['bestbooks-state-taxrate'][0]; ?>
                    <option 
                        value="<?php echo $tax_jurisdiction->name; ?>" 
                        data-id="<?php echo $tax_jurisdiction->term_id; ?>"
                        data-taxrate="<?php echo $taxrate; ?>" title="<?php echo $tax_jurisdiction->description; ?>">
                        <?php echo $tax_jurisdiction->name; ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <label class="w3-block" for="net_terms">Terms</label>
            <select class="w3-input w3-block" id="net_terms" name="net_terms" required>
                <option value="">Select</option>
                <?php foreach($payment_terms as $payment_term) : ?>
                    <option value="<?php echo $payment_term->name; ?>" data-id="<?php echo $payment_term->term_id; ?>" title="<?php echo $payment_term->description; ?>"><?php echo $payment_term->name; ?></option>
                <?php endforeach; ?>
            </select>
            <label class="w3-block" for="due_date">Due Date</label>
            <input 
                type="date" 
                class="w3-input w3-block" 
                id="due_date" 
                name="due_date" 
                value="" 
                required />
            <label class="w3-block" for="tax_amount">Sales Tax Rate <small><i>(% - in percent)</i></small></label>
            <input 
                type="text" 
                name="tax_amount" 
                id="tax_amount" 
                value="0.00" 
                class="w3-input w3-block" />
			<table class="w3-table w3-block" id="estimate-itemizations">
				<tr>
					<th>Qty</th>
					<th>Item Description</th>
					<th>Unit Price</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Taxable?</th>
					<th>Item Total</th>
				</tr>
				<tr>
					<td><input type="text" class="w3-input" name="item_qty_1" id="item_qty_1" onchange="updateItem(1)" value="" /></td>
					<td>
						<input type="text" name="item_desc_1" id="item_desc_1" list="productservices-list" onchange="updateItemDescription(this,1)" value="" />
						<input type="hidden" name="items" id="items" value="1" />
					</td>
					<td>
						<input 
							type="text" 
							class="w3-input" 
							onchange="updateItem(1)" 
							name="item_price_1" 
							id="item_price_1" 
							value="" />
					</td>
                    <td>
                        <input 
                            type="text" 
                            class="w3-input" 
                            onchange="updateItem(1)" 
                            name="item_disc_1" 
                            id="item_disc_1" 
                            value="0.00" />
                    </td>
                    <td>
                        <input 
                            type="text" 
                            class="w3-input w3-grey" 
                            name="item_tax_1" 
                            id="item_tax_1" 
                            value="0.00" 
                            readonly />
                    </td>
                    <td>
                        <input 
                            type="checkbox" 
                            class="w3-input" 
                            onchange="updateItemTax(1)" 
                            name="item_taxable_1" 
                            id="item_taxable_1" 
                            value="YES" />
                    </td>
					<td>
						<input 
							type="text" 
							class="w3-input w3-grey" 
							name="item_total_1" 
							id="item_total_1" 
							value="" 
							readonly />
					</td>
				</tr>
			</table>
            <input type="hidden" name="items" id="items" value="1" />
			<datalist id="productservices-list">
				<?php foreach($products as $product) : ?>
				<option data-id="<?php echo $product->ID; ?>" data-price="<?php echo $product->metadata['price'][0]; ?>"><?php echo $product->post_content; ?> (Product)</option>
				<?php endforeach; ?>
				<?php foreach($services as $service) : ?>
				<option data-id="<?php echo $service->ID; ?>" data-price="<?php echo $service->metadata['price'][0]; ?>"><?php echo $service->post_content; ?> (Service)</option>
				<?php endforeach; ?>
			</datalist>

            <br/>
            <label class="w3-block" for="add_terms">Additional Terms</label>
            <textarea 
                class="w3-input w3-block" 
                id="add_terms" 
                name="add_terms" 
                placeholder="Specify additional terms, if any?">
            </textarea>
			<br/>
			<input class="w3-button w3-block w3-black" type="button" id="add_item_row" name="add_item_row" value="Add Item" />
			<br/>
			<input class="w3-button w3-block w3-black" type="button" id="add_estimate_action" name="add_estimate_action" value="Save" />
		</form>
	</div>
	<form id="estimatechoiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="estimatechoiceform-action" value="" />
		<input type="hidden" name="post_id" id="estimatechoiceform-post_id" value="" />
		<input type="hidden" name="estimatechoiceform" value="estimatechoiceform" />
	</form>
	<script type="text/javascript">
		var _item_no = 1;
		jQuery(document).ready(function($){
			$("#add-estimate-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: 800, height: 850
  			});
			$('#add-estimate').bind('click', function(){
				document.getElementById("addestimateform").reset();
				document.getElementById("item_taxable_1").checked = false;
				document.getElementById("item_price_1").value = "0.00";
				document.getElementById("item_tax_1").value = "0.00";
				document.getElementById("item_total_1").value = "0.00";
				document.getElementById("item_qty_1").value = "0";
				document.getElementById("add_estimate_action").removeAttribute('disabled');
				document.getElementById("add_estimate_action").value = "Save";

				showDialog("#add-estimate-dialog");
				//$("#add-estimate-dialog").dialog("open");
				return false;
			});
			$('#add_estimate_action').bind('click', function(){
				// submit form
				document.getElementById("addestimateform").submit();
			});
			$('#add_item_row').bind('click', function(){
				_item_no = Number(_item_no) + 1;
				$('#items').val(_item_no);
				var itemlist = '<tr>';
				itemlist += '<td><input type="text" class="w3-input" name="item_qty_'+_item_no+'" id="item_qty_'+_item_no+'" onchange="updateItem('+_item_no+')" value="0" /></td>';
				itemlist += '<td>';
				itemlist += '<input type="text" name="item_desc_'+_item_no+'" id="item_desc_'+_item_no+'" list="productservices-list"  onchange="updateItemDescription(this,'+_item_no+')" value="" />';
				itemlist += '</td>';
				itemlist += '<td><input type="text" class="w3-input" onchange="updateItem('+_item_no+')" name="item_price_'+_item_no+'" id="item_price_'+_item_no+'" value="0.00" /></td>';
				itemlist += '<td><input type="text" class="w3-input" onchange="updateItem('+_item_no+')" name="item_disc_'+_item_no+'" id="item_disc_'+_item_no+'" value="0.00" /></td>';
                itemlist += '<td><input type="text" class="w3-input w3-grey" name="item_tax_'+_item_no+'" id="item_tax_'+_item_no+'" value="0.00" readonly /></td>';
                itemlist += '<td><input type="checkbox" class="w3-input" onchange="updateItemTax('+_item_no+')" name="item_taxable_'+_item_no+'" id="item_taxable_'+_item_no+'" value="YES" /></td>';
				itemlist += '<td><input type="text" class="w3-input w3-grey" name="item_total_'+_item_no+'" id="item_total_'+_item_no+'" value="" readonly /></td>';
				itemlist += '</tr>';
				$('#estimate-itemizations tr:last').after(itemlist);
			});

            $('#doaction').bind("click", function(){
                var selector = $('#bulk-action-selector-top').val();
                console.log(selector);
                bulkSelector(selector);
            });

            $('#doaction2').bind("click", function(){
                var selector = $('#bulk-action-selector-bottom').val();
                console.log(selector);
                bulkSelector(selector);
            });

            function bulkSelector(selector) {
                var ids = [];
                $('input:checkbox:checked').each(function(){
                    if ($(this).val() != "on") {
                        ids.push($(this).val());
                    }
                });
                console.log(ids);
                $.each(ids, function(index, value){
                    console.log(value);
                    $.ajax({
                        url: '<?php echo admin_url('admin-ajax.php'); ?>',
                        type: 'post',
                        data: {
                            action: 'bestbooks_ajax_' + selector,
                            id: value
                        },
                        success: function(output){

                        }
                    });
                });
                location.reload();
            }

            getEstimate = function(id, callback) {
                $.ajax({
                    url: '<?php echo admin_url('admin-ajax.php'); ?>',
                    method: 'post',
                    data: {
                        action: 'bestbooks_get_invoice',
                        id: id
                    },
                    success: function(data) {
                        var estimate = JSON.parse(data);
                        callback(estimate);
                    }
                });
            }

			showDialog = function(element_id) {
				$(element_id).dialog("open");
				return false;
			}

            setElementOption = function(id, value) {
                $("#" + id).val(value);
            }

            appendToItemList = function(itemlist) {
                $('#estimate-itemizations tr:last').after(itemlist);
            }

            setSalesTaxState = function(state) {
                if (state != "No") {
                    $("#tax_state").val(state).change();
                }
            }
		});
        function changeCustomer(customer) {
            console.log(customer);
        }
        function changeState(state) {
            var taxrate = state.options[state.selectedIndex].getAttribute("data-taxrate");
            document.getElementById("tax_amount").value = taxrate;
        }
        function setProductType(item_no) {
            var item_desc = document.getElementById("item_desc_"+item_no);
            var selectedIndex = item_desc.selectedIndex;
            var item_type = item_desc.options[selectedIndex].getAttribute("data-type");
            var item_price = item_desc.options[selectedIndex].getAttribute("data-price");
            document.getElementById("item_type_"+item_no).value = item_type;
            document.getElementById("item_price_"+item_no).value = item_price;
            updateItem(item_no);
        }
		function updateItem(item_no) {
			var qty = document.getElementById("item_qty_" + item_no).value;
			var price = document.getElementById("item_price_" + item_no).value;
            var discount = document.getElementById("item_disc_" + item_no).value;
            var tax_value = document.getElementById("item_tax_" + item_no).value;
            var total = (+price * +qty) - +discount + +tax_value;
            document.getElementById("item_total_" + item_no).value = total;
		}
        function updateItemTax(item_no) {
            var tax_rate = document.getElementById("tax_amount").value;
            var qty = document.getElementById("item_qty_" + item_no).value;
            var price = document.getElementById("item_price_" + item_no).value;
            var discount = document.getElementById("item_disc_" + item_no).value;
            var tax_value = ((qty * price) - discount) * (tax_rate / 100);
            tax_value = parseFloat(Math.round(tax_value * 100) / 100).toFixed(2);
            var taxable = document.getElementById("item_taxable_" + item_no);
            if (taxable.checked) {
                document.getElementById("item_tax_" + item_no).value = tax_value;
            } else {
                document.getElementById("item_tax_" + item_no).value = "0.00";
            }
            updateItem(item_no);
        }
		function updateItemDescription(element, item_no) {
			var products_services_list = document.getElementById("productservices-list");

			for (var i=0;i<products_services_list.options.length;i++) {
				if (products_services_list.options[i].value == element.value) {
            		var price = products_services_list.options[i].getAttribute("data-price");
					document.getElementById('item_price_' + item_no).value = price;
					console.log(price);
					updateItem(item_no);
            		break;
        		}				
			}
		}
		function estimateAction(estimateAction) {
			var choice = estimateAction.value;
			estimateAction.value = "";

			var post_id = estimateAction.getAttribute("data-id");
			if (choice == "delete") {
				if (confirm("Delete this invoice?")) {
					document.getElementById("estimatechoiceform-action").value = choice;
					document.getElementById("estimatechoiceform-post_id").value = post_id;
					document.getElementById("estimatechoiceform").submit();
				}
            } else if (choice == "invoice") {
                document.getElementById("estimatechoiceform-action").value = choice;
                document.getElementById("estimatechoiceform-post_id").value = post_id;
                document.getElementById("estimatechoiceform").submit();
            } else if (choice == "send") {
                document.getElementById("estimatechoiceform-action").value = choice;
                document.getElementById("estimatechoiceform-post_id").value = post_id;
                document.getElementById("estimatechoiceform").submit();
			} else if (choice == "view") {
				var base64 = estimateAction.getAttribute("data-estimate");
				var json = atob(base64);
				var post = JSON.parse(json);
				var estimate = JSON.parse(post.post_content);
				window.open(estimate['estimate-public-url'],"_blank");
			} else if (choice == "edit") {
				var base64 = estimateAction.getAttribute("data-estimate");
				var json = atob(base64);
				var post = JSON.parse(json);
				var estimate = JSON.parse(post.post_content);
				document.getElementById("edit_post_id").value = post_id;
				estimate['edit_post_id'] = post_id;
				console.log(estimate);
				document.getElementById("estimate-customer").value = estimate["estimate-customer"];
				document.getElementById("estimate-invnum").value = estimate['estimate-invnum'];
				document.getElementById("estimate-password").value = estimate['estimate-password'];
				document.getElementById("estimate-public-url").value = estimate['estimate-public-url'];
				document.getElementById("estimate-status").value = estimate["estimate-status"];
				document.getElementById("tax_jurisdiction").value = estimate['tax_jurisdiction'];
				document.getElementById("tax_amount").value = estimate["tax_amount"];
				document.getElementById("net_terms").value = estimate["net_terms"]
				document.getElementById("due_date").value = estimate["due_date"];
				document.getElementById("add_terms").value = estimate["add_terms"];

				if (estimate['estimate-status'] == 'rejected') {
					document.getElementById("add_estimate_action").setAttribute('disabled','disabled');
					document.getElementById("add_estimate_action").value = "REJECTED!";
				} else {
					document.getElementById("add_estimate_action").removeAttribute('disabled');
					document.getElementById("add_estimate_action").value = "Save";
				}

				document.getElementById("estimate-itemizations").innerHTML = '<tr><th>Qty</th><th>Item Description</th><th>Unit Price</th><th>Discount</th><th>Tax</th><th>Taxable?</th><th>Item Total</th></tr>';

				var items = estimate['items'];
				document.getElementById("items").value = items;
				_item_no = items;

				for (var i=1; i <= items; i++) {
					var itemlist = '<tr>';
					itemlist += '<td><input type="text" class="w3-input" name="item_qty_'+ i +'" id="item_qty_'+ i +'" onchange="updateItem('+ i +')" value="'+estimate["item_qty_"+i]+'" /></td>';
					itemlist += '<td>';
					itemlist += '<input type="text" name="item_desc_'+ i +'" id="item_desc_'+ i +'" list="productservices-list" value="'+ estimate['item_desc_'+ i] +'"  onchange="updateItemDescription(this, '+ i +')" />';
					itemlist += '</td>';
					itemlist += '<input type="hidden" name="item_type_'+ i +'" id="item_type_'+ i +'" value="'+estimate['item_type_'+i]+'" />';
					itemlist += '<td><input type="text" class="w3-input" onchange="updateItem('+ i +')" name="item_price_'+ i +'" id="item_price_'+ i +'" value="'+estimate["item_price_"+i]+'" /></td>';
					itemlist += '<td><input type="text" class="w3-input" onchange="updateItem('+ i +')" name="item_disc_'+ i +'" id="item_disc_'+ i +'" value="'+estimate["item_disc_"+i]+'" /></td>';
					itemlist += '<td><input type="text" class="w3-input w3-grey" name="item_tax_'+ i +'" id="item_tax_'+ i +'" value="'+estimate["item_tax_"+i]+'" readonly /></td>';
					var checked = '';
					if (estimate["item_taxable_"+i] == 'YES') {
						checked = 'checked';
					}
					itemlist += '<td><input type="checkbox" class="w3-input" onchange="updateItemTax('+ i +')" name="item_taxable_'+ i +'" id="item_taxable_'+ i +'" value="YES" '+checked+'/></td>';
					itemlist += '<td><input type="text" class="w3-input w3-grey" name="item_total_'+ i +'" id="item_total_'+ i +'" value="'+estimate["item_total_"+i]+'" readonly /></td>';
					itemlist += '</tr>';
					appendToItemList(itemlist);
				}

				setSalesTaxState(estimate['tax_state']);

                showDialog("#add-estimate-dialog");
                return false;
				/*
                getEstimate(post_id, function(estimate){
                    console.log(estimate);
                    
				*/
			} else {
				document.getElementById("estimatechoiceform-action").value = choice;
				document.getElementById("estimatechoiceform-post_id").value = post_id;
				document.getElementById("estimatechoiceform").submit();
			}
		}
	</script>
	<?php	
}
?>