<?php
require 'inc/PurchaseOrder_List_Table.inc.php';


function bestbooks_dashboard_purchases_order() {
	if (isset($_POST['create_po_action'])) {

		$vendor = get_user_by('id',$_POST['vendor']);
		$vendor->metadata = get_user_meta($vendor->ID);
		//echo '<pre>'; print_r($_POST); echo '</pre>';

		$vendor_csz = $vendor->metadata['csv'][0];
		$vendor_city = explode(",",$vendor_csz)[0];
		$vendor_state = explode(" ",explode(",",$vendor_csz)[1])[0];
		$vendor_zip = explode(" ",explode(",",$vendor_csz)[1])[1];

		/**
		 *     <lineitems>
		 *         <lineitem>
		 *             <productid>1234</productid>
		 *             <description>str1234</description>
		 *             <quantity>1</quantity>
		 *             <unitprice>123.45</unitprice>
		 *             <amount>123.45</amount>
		 *         </lineitem>
		 *     </lineitems>
		 * 
		 */
		$total_rows = $_POST['total_rows'];
		$lineitems = array();
		//$lineitems_xml = "<lineitems>";
		for($i=1;$i<=$total_rows;$i++) {
			array_push(
				$lineitems, 
				array(
					'quantity' => $_POST['qty_'.$i],
					'description' => $_POST['item_'.$i],
					'unitprice' => $_POST['cost_'.$i],
					'amount' => $_POST['total_'.$i]
				)
			);
		}
		//$lineitems_xml .= "</lineitems>";
		$active_company = get_option('bestbooks_active_company');
		if (isset($active_company) === false || $active_company == 0) {
			$active_company = 1;
		}

		$company = get_user_by('id', $active_company);

		$ponumber = array(
			'number' => $_POST['po_number'],
			'date' => $_POST['bill_date'],
			'company' => array(
				'name' => $company->display_name,
				'contact' => get_user_meta($company->ID,'first_name',true) . ' ' . get_user_meta($company->ID,'last_name',true), 
				'email' => $company->user_email, 
				'phone' => get_user_meta($company->ID,'phone',true), 
				'website' => $company->user_url, 
				'billing' => array( 
					'address1' => get_user_meta($company->ID,'address_1',true), 
					'address2' => get_user_meta($company->ID,'address_2',true), 
					'city' => get_user_meta($company->ID,'city',true), 
					'state' => get_user_meta($company->ID,'state',true), 
					'zipcode' => get_user_meta($company->ID,'zip_code',true), 
					'phone' => get_user_meta($company->ID,'phone',true), 
					'fax' => get_user_meta($company->ID,'fax',true)
				), 
				'shipping' => array(
					'contact' => get_user_meta($company->ID,'first_name',true) . ' ' . get_user_meta($company->ID,'last_name',true), 
					'address1' => get_user_meta($company->ID,'address_1',true), 
					'address2' => get_user_meta($company->ID,'address_2',true), 
					'city' => get_user_meta($company->ID,'city',true), 
					'state' => get_user_meta($company->ID,'state',true), 
					'zipcode' => get_user_meta($company->ID,'zip_code',true), 
					'phone' => get_user_meta($company->ID,'phone',true), 
					'fax' => get_user_meta($company->ID,'fax',true)
				) 
			), 
			'vendor' => array(
				'id' => $vendor->ID,
				'name' => $vendor->display_name,
				'email' => $vendor->user_email,
				'contact' => get_user_meta($vendor->ID,'first_name',true) . ' ' . get_user_meta($vendor->ID,'last_name',true), 
				'address1' => get_user_meta($vendor->ID,'address_1',true), 
				'address2' => get_user_meta($vendor->ID,'address_2',true), 
				'city' => get_user_meta($vendor->ID,'city',true), 
				'state' => get_user_meta($vendor->ID,'state',true), 
				'zipcode' => get_user_meta($vendor->ID,'zip_code',true), 
				'phone' => get_user_meta($vendor->ID,'phone',true), 
				'fax' => get_user_meta($vendor->ID,'fax',true)
			), 
			'shipping' => array(
				'service' => $_POST['shipping_service'], 
				'method' => $_POST['ship_via'], 
				'deliverydate' => $_POST['delivery_date']
			),
			"lineitems" => $lineitems, 
			"comments" => 'Contact before shipping', 
			'prices' => array(
				'subtotal' => $_POST['sub_total'], 
				'tax' => $_POST['tax'], 
				'shipping' => $_POST['shipping'], 
				'other' => $_POST['other'], 
				'total' => $_POST['grand_total']
			),
			'payment' => array(
				'amount' => 0.00,
				'method' => 'NOT PAID',
				'confirmation' => 'None'
			)
		);

		try {
			$post_id = $_POST['po_post_id'];
			$args = array(
				'ID' => $post_id,
				'post_type' => 'bestbooks_purchase',
				'post_status' => 'publish',
				'post_content' => json_encode($ponumber),
				'post_title' => $_POST['po_number']
			);
			if ($post_id == 0) {
				$post_id = wp_insert_post($args);
			} else {
				$post_id = wp_update_post($args);
			}
			if (is_wp_error($post_id)) {
				echo '<pre>'; print_r($post_id); echo '</pre>';
			} else {
				update_post_meta($post_id,'bill_type','purchase_order');
				update_post_meta($post_id,'status','created');
				update_post_meta($post_id,'amount',$_POST['grand_total']);
				update_post_meta($post_id, 'company', $active_company);
				update_post_meta($post_id, 'payment_amount', $_POST['payment_amount']);
				update_post_meta($post_id, 'payment_method', $_POST['payment_method']);
				update_post_meta($post_id, 'payment_confirmation', $_POST['payment_confirmation']);
			}
		} catch(Exception $ex) {
			error_log($ex->get_error_message());
		}
	} elseif (isset($_POST['choiceform'])) {
		switch($_POST['action']) {
			case 'edit':
				break;
			case 'delete':
				$post_id = $_POST['post_id'];
				wp_delete_post($post_id, true);
				break;
			case 'send':
				$post_id = $_POST['post_id'];
				$post = $_POST['post'];
				$json = base64_decode($post);
				$po = json_decode($json, true);
				$vendor_email = $po['metadata']['vendor']['email'];
				if (empty($vendor_email)) {
					update_post_meta($post_id,'status','cannot send - NOEMAIL');
				} else {
					//echo '<pre>'; print_r($po); echo '</pre>';
					
					$vendor_email = 'patrick.ingle@gmail.com';
					$content = json_decode($po['post_content'],true);
					$xml_content = bestbooks_prepare_xml_purchase_order($content);
					$html = bestbooks_transform_xml_xslt($xml_content->saveXML(), file_get_contents(dirname(__FILE__)."/../templates/purchaseOrder.xslt"));
					$subject = "Purchase Order #".$po['post_title'];
					$message = "Dear ".$po['metadata']['vendor']['name'].":<br/><br/>Purchase Order #".$po['post_title']."<br/><br/>$html";
					$headers = array('X-Generated-By: BestBooks for WordPress v2.5.5 (https://wordpress.org/plugins/bestbooks)');
					wp_mail( $vendor_email, $subject, $message, array('Content-Type: text/html; charset=UTF-8'),$headers);
				}
				break;
		}
	}

	$args = array(
		'post_type' => 'bestbooks_inventory',
		'post_status' => 'publish'
	);
	$_productsservices = get_posts($args);
	$productsservices = array();
	foreach($_productsservices as $item) {
		$item->metadata = get_post_meta($item->ID);
		array_push($productsservices, $item);
	}
	$coa = get_coa_instance();
	$expense_accounts = array();
	foreach($coa->account as $name => $type) {
		if ($type === 'Expense') {
			array_push($expense_accounts, $name);
		}
	}
	$company = get_option('bestbooks_active_company');
	//echo '<pre>'; print_r($productsservices); echo '</pre>';
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Purchase Order(s)&nbsp;
			<input type="button" class="w3-button w3-blue" id="create_po" value="Create a Purchase Order" />
		</h2>
		<?php
		$purchaseorder_list_table = new PurchaseOrder_List_Table();
		$purchaseorder_list_table->prepare_items();
		$purchaseorder_list_table->display();
		?>
	</div>
	<div id="create-po-dialog" title="Create/Update a Purchase Order" style="display:none;">
		<form method="post" id="createpurchaseorderform">
            <label for="bill_date">Date</label>
            <input class="w3-input" type="date" id="bill_date" name="bill_date" value="" required />
			<label for="ponumber">P.O. Number</label>
			<input type="hidden" name="po_post_id" id="po_post_id" value="0" />
			<input type="hidden" name="payment_amount" id="payment_amount" value="0.00" />
			<input type="hidden" name="payment_method" id="payment_method" value="NOT PAID" />
			<input type="hidden" name="payment_confirmation" id="payment_confirmation" value="None" />
			<input type="hidden" name="po_number" id="po_number" value="<?php echo PurchaseOrder_List_Table::$po_num; ?>" />
			<input type="text" id="ponumber" name="ponumber" class="w3-input w3-light-grey" value="<?php echo PurchaseOrder_List_Table::$po_num; ?>" disabled />
			<label for="vendor">Vendor</label>
            <select class="w3-input w3-block" id="vendor" name="vendor" value="" required >
				<option value="">Select</option>
				<?php
				$bestbooks_vendor = get_option("bestbooks_vendor");
				if (isset($bestbooks_customer) === false) {
					$bestbooks_vendor = "bestbooks_vendor";
				}

				$vendors = get_users(array('role__in'=>array($bestbooks_vendor)));
				foreach($vendors as $vendor) {
					echo '<option value="'.$vendor->ID.'">'.$vendor->display_name . '[' . $vendor->user_email . ']'.'</option>';
				}
				?>
            </select>
			<table class="w3-table w3-block" width="100%">
				<tr>
					<td>Shipping Service:</td>
					<td><input type="text" class="w3-input" name="shipping_service" id="shipping_service" value="" placeholder="USPS, UPS, FEDEX, etc" required /></td>
					<td>Ship Via</td>
					<td><input type="text" class="w3-input" name="ship_via" id="ship_via" value="" placeholder="Overnight, Two Day, Parcel Post, etc." required /></td>
					<td>Delivery Date</td>
					<td><input type="date" class="w3-input" name="delivery_date" id="delivery_date" value="" required /></td>
				</tr>
			</table>
			<button class="w3-button w3-block w3-green" id="create-po-dialog-addrow">Add</button>
			<input type="hidden" name="total_rows" id="total_rows" value="1" />
			<table class="w3-table w3-block" id="po-table" width="100%">
				<tr>
					<th>Quantity</th>
					<th>Description</th>
					<th>Cost</th>
					<th>Total</th>
				</tr>
				<tr>
					<td><input type="number" step="any" name="qty_1" id="qty_1" value="0" onchange="updatePriceOnQty(this,1)" /></td>
					<td><input type="text" name="item_1" id="item_1" value="" onchange="updateColumns(this,1)" list="inventory" /></td>
					<td><input type="number" step="any" name="cost_1" id="cost_1" value="0" onchange="updatePriceOnQty(this,1)" /></td>
					<td><input type="number" step="any" name="total_1" id="total_1" value="0" readonly /></td>
				</tr>
			</table>
			<datalist id="inventory">
				<?php
				foreach($productsservices as $item) {
					echo '<option value="'.$item->post_title.'" data-id="'.$item->ID.'" data-item="'.base64_encode(json_encode($item)).'" />';
				}
				?>
			</datalist>
            <br/>
		    <input class="w3-button w3-block w3-black" type="submit" id="create_po_action" name="create_po_action" value="Create" />
			<br/>
			<table class="w3-table">
				<tr>
					<td></td>
					<td></td>
					<td style="text-align: right;">Sub-Total: </td>
					<td><input type="number" id="subtotal"  step="any" class="w3-input w3-light-grey" value="" disabled /><input type="hidden" name="sub_total" id="sub_total" value="" /></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td style="text-align: right;">Tax: </td>
					<td><input type="number" step="any" class="w3-input" name="tax" id="tax" onchange="updateTotals()" value="0.00" /></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td style="text-align: right;">Shipping: </td>
					<td><input type="number" step="any" class="w3-input" name="shipping" id="shipping" onchange="updateTotals()" value="0.00" /></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td style="text-align: right;">Other: </td>
					<td><input type="number" step="any" class="w3-input" name="other" id="other" onchange="updateTotals()" value="0.00" /></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td colspan="2"><hr/></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td style="text-align: right;">Total: </td>
					<td><input type="number" class="w3-input w3-light-grey" id="total" value="" disabled /><input type="hidden" id="grand_total" name="grand_total" value="" /></td>
				</tr>
			</table>
			<br/>
		</form>
	</div>
	<div id="purchase-order-dialog" class="w3-modal">
		<div class="w3-modal-content">
			<div class="w3-container">
				<h2 class="w3-green">Purchase Order</h2>
				<?php if (isset($newdom)) : ?>
					<?php echo $newdom->saveXML(); ?>
				<?php endif; ?>
				<br/>
				<button class="w3-button w3-block w3-black" onclick="document.getElementById('purchase-order-dialog').style.display='none'">OK</button>
				<br/>
			</div>
		</div>
	</div>
	<form id="choiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="choiceform-action" value="" />
		<input type="hidden" name="post_id" id="choiceform-post_id" value="" />
		<input type="hidden" name="post" id="choiceform-post" value="" />
		<input type="hidden" name="choiceform" value="choiceform" />
	</form>
	<script>
		var subtotal = Number(0);

		<?php if (isset($newdom)) : ?>
			window.onload = function() {
				document.getElementById('purchase-order-dialog').style.display = "block";
			}
		<?php endif; ?>

		jQuery(document).ready(function($){
  		    $("#create-po-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: 1000, height: 600
  			});
			$('#create_po').bind('click', function(){
				$('#po_post_id').val("0");
				$('#bill_date').val("");
				$('#po_number').val("<?php echo PurchaseOrder_List_Table::$po_num; ?>");
				$('#ponumber').val("<?php echo PurchaseOrder_List_Table::$po_num; ?>");
				$('#shipping_service').val("");
				$('#ship_via').val("");
				$('#delivery_date').val("");
				$('#vendor').val("");
				$('#subtotal').val("");
				$('#tax').val("");
				$('#shipping').val("");
				$('#other').val("");
				$('#total').val("");

				$('#item_1').val("");
				$('#qty_1').val("");
				$('#cost_1').val("");
				$('#total_1').val("");

				$('#total_rows').val("0.00");
				$('#payment_amount').val("0.00");
				$('#payment_method').val("NOT PAID");
				$('#payment_confirmation').val("None");

				$('#create_po_action').val('Create');

				document.getElementById('po-table').innerHTML = `<tr>
					<th>Quantity</th>
					<th>Description</th>
					<th>Cost</th>
					<th>Total</th>
				</tr>
				<tr>
					<td><input type="number" step="any" name="qty_1" id="qty_1" value="0" onchange="updatePriceOnQty(this,1)" /></td>
					<td><input type="text" name="item_1" id="item_1" value="" onchange="updateColumns(this,1)" list="inventory" /></td>
					<td><input type="number" step="any" name="cost_1" id="cost_1" value="0" onchange="updatePriceOnQty(this,1)" /></td>
					<td><input type="number" step="any" name="total_1" id="total_1" value="0" readonly /></td>
				</tr>`;

				$('#create-po-dialog').dialog('open');
				return false;
			});
			$('#create-po-dialog-addrow').bind('click', function(){
				var count = document.getElementById('total_rows').value
				count++;
				document.getElementById('total_rows').value = count;

				document.getElementById('po-table').innerHTML += `<tr>
					<td><input type="number" step="any" name="qty_${count}" id="qty_${count}" value="0" onchange="updatePriceOnQty(this,${count})" /></td>
					<td><input type="text" name="item_${count}" id="item_${count}" value="" onchange="updateColumns(this,${count})" list="inventory"/></td>
					<td><input type="number" step="any" name="cost_${count}" id="cost_${count}" value="0" onchange="updatePriceOnQty(this,${count})" /></td>
					<td><input type="number" step="any" name="total_${count}" id="total_${count}" value="0" readonly /></td>
				</tr>`;
				return false;
			});
			openCreatePODialog = function() {
				$('#create-po-dialog').dialog('open');
				return false;
			}
		});
		function updateColumns(obj,pos) {
			var value = obj.value;
			var inventory = document.getElementById("inventory");
			//var base64 = obj.getAttribute('data-item');
			//
			//
			//console.log(inventory.options[value]);
			for (i = 0; i < inventory.options.length; i++) {
				if (inventory.options[i].value == value) {
					var base64 = inventory.options[i].getAttribute('data-item');
					var json = atob(base64);
					var item = JSON.parse(json);
					console.log(item);

					var qty = Number(document.getElementById('qty_'+pos).value);
					var cost = Number(item.metadata.cost);
					console.log(qty,cost);
					document.getElementById('cost_'+pos).value = cost;
					document.getElementById('total_'+pos).value = qty * cost;
				}
			}
			updateSubtotal();
		}
		function updatePriceOnQty(obj,pos) {
			console.log(obj);
			console.log(pos);

			var _total = Number(document.getElementById('qty_'+pos).value) * Number(document.getElementById('cost_'+pos).value);
			document.getElementById('total_'+pos).value = _total;

			updateSubtotal();
		}
		function updateSubtotal() {
			var _subtotal = 0;
			var total_rows = document.getElementById('total_rows').value;
			for(var i=1; i<=total_rows; i++) {
				var st = Number(document.getElementById('total_'+i).value);
				console.log(st);
				_subtotal += st;
			}
			document.getElementById('subtotal').value = _subtotal;
			document.getElementById('sub_total').value = _subtotal;
			updateTotals();
		}
		function updateTotals() {
			var _subtotal = document.getElementById('subtotal').value;
			var tax = document.getElementById('tax').value;
			var shipping = document.getElementById('shipping').value;
			var other = document.getElementById('other').value;
			var total = Number(_subtotal) + Number(tax) + Number(shipping) + Number(other);
			document.getElementById('total').value = total;
			document.getElementById('grand_total').value = total;
		}
		function poAction(obj) {
			switch(obj.value) {
				case 'edit':
					{
						var base64 = obj.getAttribute('data-po');
						var json = atob(base64);
						var po = JSON.parse(json);
						var status = obj.getAttribute('data-status');

						if (status.includes("assigned")) {
							alert("Purchase Order has been assigned to a Bill. Editing is prohibited!");
							return false;
						}
						console.log(po);
						var content = JSON.parse(po.post_content);
						console.log(content);

						var item_count = content.lineitems.length;

						document.getElementById('po_post_id').value = po.ID;
						
						document.getElementById('bill_date').value = content.date;
						document.getElementById('po_number').value = content.number;
						document.getElementById('ponumber').value = content.number;
						document.getElementById('shipping_service').value = content.shipping.service;
						document.getElementById('ship_via').value = content.shipping.method;
						document.getElementById('delivery_date').value = content.shipping.deliverydate;
						document.getElementById('vendor').value = content.vendor.id;
						document.getElementById('subtotal').value = content.prices.subtotal;
						document.getElementById('tax').value = content.prices.tax;
						document.getElementById('shipping').value = content.prices.shipping;
						document.getElementById('other').value = content.prices.other;
						document.getElementById('total').value = content.prices.total;

						document.getElementById('item_1').value = content.lineitems[0].description;
						document.getElementById('qty_1').value = content.lineitems[0].quantity;
						document.getElementById('cost_1').value = content.lineitems[0].unitprice;
						document.getElementById('total_1').value = content.lineitems[0].amount;

						console.log(item_count);
						document.getElementById('total_rows').value = item_count;
						if (item_count > 1) {
							document.getElementById('po-table').innerHTML = `<tr><th>Quantity</th><th>Description</th><th>Cost</th><th>Total</th></tr>`;
							for(var count=0; count<item_count; count++) {
								console.log(count);
								document.getElementById('po-table').innerHTML += `<tr>
									<td><input type="number" step="any" name="qty_${Number(count + 1)}" id="qty_${Number(count + 1)}" value="${content.lineitems[count].quantity}" onchange="updatePriceOnQty(this,${Number(count + 1)})" /></td>
									<td><input type="text" name="item_${Number(count + 1)}" id="item_${Number(count + 1)}" value="${content.lineitems[count].description}" onchange="updateColumns(this,${Number(count + 1)})" list="inventory"/></td>
									<td><input type="number" step="any" name="cost_${Number(count + 1)}" id="cost_${Number(count + 1)}" value="${content.lineitems[count].unitprice}" onchange="updatePriceOnQty(this,${Number(count + 1)})" /></td>
									<td><input type="number" step="any" name="total_${Number(count + 1)}" id="total_${Number(count + 1)}" value="${content.lineitems[count].amount}" readonly /></td>
								</tr>`;
							}
						}

						document.getElementById('payment_amount').value = content.payment.amount;
						document.getElementById('payment_method').value = content.payment.method;
						document.getElementById('payment_confirmation').value = content.payment.confirmation;

						document.getElementById('create_po_action').value = 'Update';

						updateSubtotal();

						openCreatePODialog();
					}
					break;
				case 'view':
					{
						var post_id = obj.getAttribute('data-id');
						let a= document.createElement('a');
						a.target= '_blank';
						a.href= "<?php echo home_url('vendor/purchase-order?id='); ?>" + post_id;
						a.click();
					}
					break;
				case 'delete':
					{
						var status = obj.getAttribute('data-status');
						
						if (status.includes("assigned")) {
							alert("Purchase Order has been assigned to a Bill. Deleting is prohibited!");
							return false;
						}

						if (confirm("Delete this bill?")) {
							document.getElementById('choiceform-action').value = 'delete';
							document.getElementById('choiceform-post_id').value = obj.getAttribute('data-id');
							document.getElementById('choiceform').submit();
						}
					}
					break;
				case 'send':
					{
						document.getElementById('choiceform-action').value = 'send';
						document.getElementById('choiceform-post_id').value = obj.getAttribute('data-id');
						document.getElementById('choiceform-post').value = obj.getAttribute('data-po');
						document.getElementById('choiceform').submit();
					}
					break;
			}
			obj.value="";
			return false;
		}
		function changePaymentMethod(obj) {
			var sel = document.getElementById('purchase-pay-method');
			var opt = sel.options[sel.selectedIndex];
			//var action = opt.getAttribute('data-hook');
			//document.getElementById('purchase-payment-action').value = action;
			var test = obj.value.toLowerCase();
			if (test.includes('bank') || test.includes('check')) {
				document.getElementById('purchase-pay-bank').removeAttribute('disabled');
			} else {
				document.getElementById('purchase-pay-bank').setAttribute('disabled','disabled');
			}
		}
	</script>
	<?php	
}
?>