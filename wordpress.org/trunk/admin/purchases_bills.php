<?php
require 'inc/PurchaseBills_List_Table.inc.php';

function bestbooks_dashboard_purchases_bills() {
	if (isset($_POST['add_bill_action'])) {
		$txdate = $_POST['bill_date'];
		$description = $_POST['bill_description'];
		$amount = $_POST['bill_amount'];
		$expense = $_POST['bill_account'];
		$bill_purchase_order = $_POST['bill_purchase_order'];

		$args = array(
			'post_type' => 'bestbooks_purchase',
			'post_title' => $description,
			'post_content' => json_encode($_POST),
			'post_date' => $txdate,
			'post_status' => 'publish'
		);

		$post_id = wp_insert_post($args);
		if (is_wp_error($post_id)) {
			echo '<script>alert("'.$post_id->get_error_message().'");</script>';
		} else {
			update_post_meta($post_id,'bill_type','purchase_bill');
			update_post_meta($post_id,'account',$expense);
			update_post_meta($post_id,'amount',$amount);
			update_post_meta($post_id,'status','posted');

			if ($bill_purchase_order > 0) {
				update_post_meta($post_id,'purchase_order',$bill_purchase_order);
				update_post_meta($bill_purchase_order,'assigned_to_bill',$post_id);
				update_post_meta($bill_purchase_order,'status','assigned to bill #'.$post_id);
			}

            $active_company = get_option('bestbooks_active_company');
            if (isset($active_company) === false) {
                $active_company = 0;
            }
            update_post_meta($post_id, 'company', $active_company);

			bestbooks_expense($txdate, $description, $amount, $expense);
		}
	} elseif (isset($_POST['choiceform'])) {
		$post_id = $_POST['post_id'];
		wp_delete_post($post_id, true);
	} elseif (isset($_POST['pay-bill-now'])) {
		try {
			//echo '<pre>'; print_r($_POST); echo '</pre>';
			$post_id = $_POST['pay-bill-post-id'];
			$bank = 0;
			if (isset($_POST['pay-bill-bank'])) {
				$bank = $_POST['pay-bill-bank'];
			}
			$txdate = $_POST['pay-bill-date'];
			$description = $_POST['pay-bill-description'];
			$amount = $_POST['pay-bill-amount'];
			$payment_method = $_POST['pay-bill-payment-method'];

			$purchase_order_id = get_post_meta($post_id,'purchase_order',true);
			if (isset($purchase_order_id) && $purchase_order_id > 0) {
				$purchase_order = get_post($purchase_order_id);
				$content = json_decode($purchase_order->post_content, true);
				$content['payment']['amount'] = $amount;
				$content['payment']['method'] = strtoupper($_POST['pay-bill-payment-method']);
				$content['payment']['confirmation'] =$_POST['pay-bill-confirmation'];
				//echo '<pre>'; print_r($content); echo '</pre>';
				$purchase_order->post_content = json_encode($content);
				$result = wp_update_post($purchase_order);
				if (is_wp_error($result)) {

				} else {
					update_post_meta($post_id, 'payment_amount', $amount);
					update_post_meta($post_id, 'payment_method', 'PAID BY '.strtoupper($_POST['pay-bill-payment-method']));
					update_post_meta($post_id, 'payment_confirmation', $_POST['pay-bill-confirmation']);
				}
			}

			$action_hook = $_POST['pay-bill-payment-action'];
			if (!empty($action_hook)) {
				$account = get_post_meta($post_id,'account',true);
				if (stripos($payment_method,'bank') !== false || stripos($payment_method,'check') !== false) {
					// paying by bank or check
					if (!empty($bank)) {
						call_user_func($action_hook,$txdate, $description, $amount, $account, $bank);
						update_post_meta($post_id,'status','paid');
					} else {
						// bank NOT selected, don't update status to PAID?
					}
				} else {
					// not paying by bank nor check
					call_user_func($action_hook,$txdate, $description, $amount, $account);
					update_post_meta($post_id,'status','paid');
				}	
			} else {
				if (!empty($bank)) {
					bestbooks_pay_expense($txdate, $description, $amount, $bank);
					update_post_meta($post_id,'status','paid');
				} else {
					// bank NOT selected, do not record payment nor update status to PAID?
				}
			}	
		} catch(Exception $ex) {
			// fall through
		}
	}
	$coa = get_coa_instance();
	$expense_accounts = array();
	foreach($coa->account as $name => $type) {
		if ($type === 'Expense') {
			array_push($expense_accounts, $name);
		}
	}
	$active_company = bestbooks_get_active_company();
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Bills
			<input type="button" class="w3-button w3-blue" id="add_bill" value="Add a Bill" />
		</h2>
		<?php
		$purchasebills_list_table = new PurchaseBills_List_Table();
		$purchasebills_list_table->prepare_items();
		$purchasebills_list_table->display();
		?>
	</div>
	<div id="add-bill-dialog" title="Add New Bill" style="display:none;">
		<form method="post" id="addbillform">
			<label for="bill_purchase_order">Purchase Order</label>
			<select class="w3-input w3-block" id="bill_purchase_order" name="bill_purchase_order" onchange="updateBillFields(this)">
				<option value="0">Select</option>
				<?php
				$args = array(
					'post_type' => 'bestbooks_purchase',
					'post_status' => 'publish',
					'numberposts' => -1,
					'orderby' => 'post_date',
					'order' => 'DESC',
					'meta_key' => 'bill_type',
					'meta_value' => 'purchase_order',
					'meta_compare' => '='
				);
				if ($active_company > 1) {
					$args = array(
						'post_type' => 'bestbooks_purchase',
						'post_status' => 'publish',
						'numberposts' => -1,
						'orderby' => 'post_date',
						'order' => 'DESC',
						'meta_query' => array(
							'relation' => 'AND',
							array(
								'key' => 'bill_type',
								'value' => 'purchase_order',
								'compare' => '='        
							),
							array(
								'key' => 'company',
								'value' => $active_company,
								'compare' => '='        
							)
						)
					);	
				}
				$purchase_orders = get_posts($args);
				foreach($purchase_orders as $purchase_order) {
					$assigned_to_bill = get_post_meta($purchase_order->ID,'assigned_to_bill',true);
					$assigned = 'false';
					if (isset($assigned_to_bill) && $assigned_to_bill > 0) $assigned = 'true';
					if ($assigned === "false") {
						$purchase_order->metadata = get_post_meta($purchase_order->ID);
						echo '<option value="'.$purchase_order->ID.'" data-po="'.base64_encode(json_encode($purchase_order)).'">'.$purchase_order->post_title.'</option>';	
					}
				}
				?>
			</select>
			<label for="bill_date">Date</label>
			<input class="w3-input" type="date" id="bill_date" name="bill_date" value="" required />
			<label for="bill_description">Description</label>
			<input class="w3-input" type="text" id="bill_description" name="bill_description" value="" required />
			<label for="bill_amount">Amount</label>
			<input class="w3-input" type="number" step="any" id="bill_amount" name="bill_amount" value="" required />
			<label for="bill_account">Expense Account</label>
			<input type="text" class="w3-input w3-block" id="bill_account" name="bill_account" list="expense-account-list">
			<datalist id="expense-account-list">
				<?php
				foreach($expense_accounts as $account) {
					echo '<option value="'.$account.'">';
				}
				?>
			</datalist>
			<br/>
			<input class="w3-button w3-block w3-black" type="submit" id="add_bill_action" name="add_bill_action" value="Add" />
		</form>
	</div>
	<div class="w3-modal" id="pay-bill-dialog">
		<div class="w3-modal-content">
			<div class="w3-container">
				<form method="post">
					<h2 class="w3-green">Pay Bill</h2>
					<p class="w3-container">You are recording a bill payment and NOT submitting a payment to the vendor.</p>
					<p class="w3-container">Payment submissions is perform separately for whatever method you currently use to make a payment to this vendor?</p>
					<input type="hidden" name="pay-bill-post-id" id="pay-bill-post-id" value="" />
					<input type="hidden" name="pay-bill-payment-action" id="pay-bill-payment-action" value="" />
					<select class="w3-input w3-block" id="pay-bill-payment-method" name="pay-bill-payment-method" onchange="changePaymentMethod(this)">
						<?php
						$payment_methods = get_terms(
							array(
								'taxonomy' => 'bestbooks_payment_method',
								'hide_empty'=>false
							)
						);
						foreach($payment_methods as $payment_method) {
							$action_hook = get_term_meta( $payment_method->term_id, 'bestbooks-action-hook', true );
							echo '<option value="'.strtolower($payment_method->name).'" data-hook="'.$action_hook.'" data-id="'.$payment_method->term_id.'">'.$payment_method->name.'</option>';
						}
						?>
					</select>
					<label for="pay-bill-bank">Bank (<a href="<?php echo admin_url('admin.php?page=bestbooks_banking'); ?>">Click to manage bank accounts</a>)</label>
					<?php
					$args =  array(
						'post_type'=>'bestbooks_bank',
						'post_status'=>'publish',
						'meta_key' => 'company',
						'meta_value' => $active_company,
						'meta_compare' => '='
					);

					$banks = get_posts($args); 
					?>
					<select class="w3-input w3-block" id="pay-bill-bank" name="pay-bill-bank">
						<option value="">Select</option>
						<?php
						foreach($banks as $bank) {
							echo '<option value="'.$bank->post_title.'">'.$bank->post_title.'</option>';
						}
						?>
					</select>
					<label for="pay-bill-date">Date</label>
					<input type="date" class="w3-input w3-block" id="pay-bill-date" name="pay-bill-date" value="" required />
					<label for="pay-bill-description">Description</label>
					<input type="text" class="w3-input w3-block" id="pay-bill-description" name="pay-bill-description" value="" required />
					<label for="pay-bill-amount">Amount</label>
					<input type="number" step="any" class="w3-input w3-block" id="pay-bill-amount" name="pay-bill-amount" value="" required />
					<label for="pay-bill-confirmation">Confirmation</label>
					<input type="text" class="w3-input w3-block" id="pay-bill-confirmation" name="pay-bill-confirmation" value="" placeholder="Optional, confirmation from vendor?" />
					<br/>
					<input type="submit" class="w3-button w3-block w3-black" name="pay-bill-now" id="pay-bill-now" value="Pay Now" />
					<br/>
					<button class="w3-button w3-block w3-orange" onclick="document.getElementById('pay-bill-dialog').style.display='none';return false;">Cancel</button>
					<br/>
				</form>
			</div>
		</div>
	</div>
	<form id="choiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="choiceform-action" value="" />
		<input type="hidden" name="post_id" id="choiceform-post_id" value="" />
		<input type="hidden" name="choiceform" value="choiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-bill-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('#add_bill').bind('click', function(){
				$("#add-bill-dialog").dialog("open");
				return false;
			});
		});
		function billAction(obj) {
			switch(obj.value) {
				case 'pay':
					var status = obj.getAttribute('data-status');
					if (status == "uploaded") {
						alert("You must post your bill before you can pay the bill?");
						return false;
					} else if (status == "paid") {
						alert("You have already paid this bill?");
						return false;
					}
					var base64 = obj.getAttribute("data-bank");
					var json = atob(base64);
					var bank = JSON.parse(json);

					document.getElementById('pay-bill-post-id').value = bank.ID;
					document.getElementById("pay-bill-description").value = bank.metadata.bill_description + " - PAYMENT";
					document.getElementById("pay-bill-amount").value = bank.metadata.bill_amount;
					document.getElementById("pay-bill-dialog").style.display = "block";
					break;
				case 'delete':
					{
						if (confirm("Delete this bill?")) {
							document.getElementById('choiceform-action').value = 'delete';
							document.getElementById('choiceform-post_id').value = obj.getAttribute('data-id');
							document.getElementById('choiceform').submit();
						}
					}
					break;
			}
			obj.value="";
			return false;
		}
		function updateBillFields(obj) {
			if (obj.selectedIndex > 0) {
				var opt = obj.options[obj.selectedIndex];
				var base64 = opt.getAttribute('data-po');
				var json = atob(base64);
				var po = JSON.parse(json);
				var content = JSON.parse(po.post_content);

				document.getElementById('bill_description').value = "Bill for Purchase Order No. " + po.post_title;
				document.getElementById('bill_amount').value = content.prices.total;
			} else {
				document.getElementById('bill_description').value = "";
				document.getElementById('bill_amount').value = "0.00";
			}
		}
		function changePaymentMethod(obj) {
			var sel = document.getElementById('pay-bill-payment-method');
			var opt = sel.options[sel.selectedIndex];
			var action = opt.getAttribute('data-hook');
			document.getElementById('pay-bill-payment-action').value = action;
		}
	</script>
	<?php	
}
?>