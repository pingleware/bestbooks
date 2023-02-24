<?php
require 'inc/SalesCustomers_List_Table.inc.php';


function bestbooks_dashboard_sales_customers() {
	$timezone = get_option("bestbooks_timezone");
	date_default_timezone_set($timezone);

	$bestbooks_customer = get_option("bestbooks_customer");
    if (isset($bestbooks_customer) === false) {
        $bestbooks_customer = "bestbooks_customer";
	}
	
	if (is_multisite()) {
		$blog_id = get_current_blog_id();
	}
	
	if (isset($_POST['customer_email'])) {
		$customer_name = $_POST['customer_name'];
		$customer_email = $_POST['customer_email'];
		$customer_billing_address = $_POST['customer_billing_address'];
		$customer_billing_address_2 = $_POST['customer_billing_address_2'];
		$customer_billing_city = $_POST['customer_billing_city'];
		$customer_billing_state = $_POST['customer_billing_state'];
		$customer_billing_zip = $_POST['customer_billing_zip'];
		$customer_shipping_address = $_POST['customer_shipping_address'];
		$customer_shipping_address_2 = $_POST['customer_shipping_address_2'];
		$customer_shipping_city = $_POST['customer_shipping_city'];
		$customer_shipping_state = $_POST['customer_shipping_state'];
		$customer_shipping_zip = $_POST['customer_shipping_zip'];
		$customer_phone = $_POST['customer_phone'];
		$customer_fax = $_POST['customer_fax'];


		if (($user_id = username_exists($customer_email)) || email_exists($customer_email)) {
			$user = get_user_by('id', $user_id);
			$user->display_name = $customer_name;
			wp_update_user($user);
			$user->add_role($bestbooks_customer, 'BestBooks Customer');
			if (is_multisite()) {
				add_user_to_blog($blog_id, $user_id, $bestbooks_customer);
			}
			update_user_meta($user_id, 'billing_address', $customer_billing_address);
			update_user_meta($user_id, 'billing_address_2', $customer_billing_address_2);
			update_user_meta($user_id, 'billing_city', $customer_billing_city);
			update_user_meta($user_id, 'billing_state', $customer_billing_state);
			update_user_meta($user_id, 'billing_zip', $customer_billing_zip);
			update_user_meta($user_id, 'shipping_address', $customer_shipping_address);
			update_user_meta($user_id, 'shipping_address_2', $customer_shipping_address_2);
			update_user_meta($user_id, 'shipping_city', $customer_shipping_city);
			update_user_meta($user_id, 'shipping_state', $customer_shipping_state);
			update_user_meta($user_id, 'shipping_zip', $customer_shipping_zip);
			update_user_meta($user_id, 'phone', $customer_phone);
			update_user_meta($user_id, 'fax', $customer_fax);
		} else {
			$random_password = wp_generate_password(12, false);
			$user_id = wp_create_user($customer_email, $random_password, $customer_email);
			if (is_wp_error($user_id)) {
				$error_string = $user_id->get_error_message();
   				echo '<div id="message" class="error"><p>' . $error_string . '</p></div>';
			} else {
				$user = get_user_by('id', $user_id);
				$user->display_name = $customer_name;
				$user->add_role($bestbooks_customer, 'BestBooks Customer');
				wp_update_user($user);
				if (is_multisite()) {
					add_user_to_blog($blog_id, $user_id, $bestbooks_customer);
				}
				update_user_meta($user_id, 'billing_address', $customer_billing_address);
				update_user_meta($user_id, 'billing_address_2', $customer_billing_address_2);
				update_user_meta($user_id, 'billing_city', $customer_billing_city);
				update_user_meta($user_id, 'billing_state', $customer_billing_state);
				update_user_meta($user_id, 'billing_zip', $customer_billing_zip);
				update_user_meta($user_id, 'shipping_address', $customer_shipping_address);
				update_user_meta($user_id, 'shipping_address_2', $customer_shipping_address_2);
				update_user_meta($user_id, 'shipping_city', $customer_shipping_city);
				update_user_meta($user_id, 'shipping_state', $customer_shipping_state);
				update_user_meta($user_id, 'shipping_zip', $customer_shipping_zip);
				update_user_meta($user_id, 'phone', $customer_phone);
				update_user_meta($user_id, 'fax', $customer_fax);
			}
		}
	} elseif (isset($_POST['choiceform'])) {
		global $wpdb;

		$user_id = $_POST['user_id'];
		$prefix = $wpdb->prefix;
		if (function_exists("is_plugin_active_for_network")) {
            if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
                $prefix = $wpdb->base_prefix;
            }
		}
		$wpdb->get_results("DELETE FROM {$prefix}users WHERE id={$user_id};");
		$wpdb->get_results("DELETE FROM {$prefix}usermeta WHERE user_id={$user_id};");
	}
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Customers&nbsp;
			<button id="add_customer" class="w3-button w3-blue">Add a Customer</button>
		</h2>
		<?php
		$salescustomer_list_table = new SalesCustomers_List_Table();
		$salescustomer_list_table->prepare_items(); 
		$salescustomer_list_table->display();
		?>
	</div>
	<?php	
	$customers = get_users(array('role__in'=>array($bestbooks_customer)));
	?>
	<div id="add-customer-dialog" title="Add/Update New Customer" style="display:none;">
		<form method="post" id="addcustomerform">
		<label for="customer_name">Name</label>
		<input class="w3-input" type="text" id="customer_name" name="customer_name" value="" required />
		<label for="customer_email">EMail</label>
		<input class="w3-input" type="email" id="customer_email" name="customer_email" value="" required />
		<table class="w3-table">
			<tr>
				<td>
					<fieldset>
						<legend>Billing Address</legend>
						<label for="customer_billing_address">Address</label>
						<input class="w3-input" type="text" id="customer_billing_address" name="customer_billing_address" value="" required />
						<label for="customer_billing_address_2">Address 2</label>
						<input class="w3-input" type="text" id="customer_billing_address_2" name="customer_billing_address_2" value="" required />
						<label for="customer_billing_city">City</label>
						<input class="w3-input" type="text" id="customer_billing_city" name="customer_billing_city" value="" required />
						<label for="customer_billing_state">State</label>
						<input class="w3-input" type="text" id="customer_billing_state" name="customer_billing_state" value="" required />
						<label for="customer_billing_zip">Zip</label>
						<input class="w3-input" type="text" id="customer_billing_zip" name="customer_billing_zip" value="" required />
					</fieldset>
				</td>
				<td>
					<fieldset>
						<legend>Shippping Address</legend>
						<label for="customer_shipping_address">Address</label>
						<input class="w3-input" type="text" id="customer_shipping_address" name="customer_shipping_address" value="" required />
						<label for="customer_shipping_address_2">Address 2</label>
						<input class="w3-input" type="text" id="customer_shipping_address_2" name="customer_shipping_address_2" value="" required />
						<label for="customer_shipping_city">City</label>
						<input class="w3-input" type="text" id="customer_shipping_city" name="customer_shipping_city" value="" required />
						<label for="customer_shipping_state">State</label>
						<input class="w3-input" type="text" id="customer_shipping_state" name="customer_shipping_state" value="" required />
						<label for="customer_shipping_zip">Zip</label>
						<input class="w3-input" type="text" id="customer_shipping_zip" name="customer_shipping_zip" value="" required />
					</fieldset>
				</td>
			</tr>
		</table>
		<label for="customer_phone">Phone</label>
		<input class="w3-input" type="text" id="customer_phone" name="customer_phone" value="" required />
		<label for="customer_fax">FAX</label>
		<input class="w3-input" type="text" id="customer_fax" name="customer_fax" value="" required />
		<br/>
		<input class="w3-button w3-block w3-black" type="button" id="add_customer_action" name="add_customer_action" value="Add" />
		<br/>
		</form>
	</div>
	<form id="choiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="choiceform-action" value="" />
		<input type="hidden" name="user_id" id="choiceform-id" value="" />
		<input type="hidden" name="choiceform" value="choiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-customer-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind", width: "auto", height: "auto"
  			});
			$('#add_customer').bind('click', function(){
				$('#customer_email').val("");
				$('#customer_name').val("");
				$('#customer_billing_address').val("");
				$('#customer_billing_address_2').val("");
				$('#customer_billing_city').val("");
				$('#customer_billing_state').val("");
				$('#customer_billing_zip').val("");
				$('#customer_shipping_address').val("");
				$('#customer_shipping_address_2').val("");
				$('#customer_shipping_city').val("");
				$('#customer_shipping_state').val("");
				$('#customer_shipping_zip').val("");
				$('#customer_phone').val("");
				$('#customer_fax').val("");

				$('#add_customer_action').val("Add");
				$("#add-customer-dialog").dialog("open");
				return false;
			});
			$('#add_customer_action').bind('click', function(){
				if ($('#customer_email').val() == "") {
					alert("Missing Customer Email!");
					return false;
				}
				if ($('#customer_name').val() == "") {
					alert("Missing Customer name");
					return false;
				}
				// submit form
				document.getElementById("addcustomerform").submit();
			});
			$('.delete-button').bind('click', function(){
				if (confirm("Delete account " + $(this)('id'))) {
					// submit form
				}
			});
			showCustomerDialog = function() {
				$("#add-customer-dialog").dialog("open");
				return false;
			}
		});
		function customerAction(obj) {
			var customer_id = obj.getAttribute('data-id');
			switch(obj.value) {
				case 'edit':
					{
						var base64 = obj.getAttribute('data-customer');
						var json = atob(base64);
						var data = JSON.parse(json);
						var customer = data.data;
						console.log(customer);

						document.getElementById('customer_name').value = customer.display_name;
						document.getElementById('customer_email').value = customer.user_email;
						document.getElementById('customer_billing_address').value = customer.metadata.billing_address;
						document.getElementById('customer_billing_address_2').value = customer.metadata.billing_address_2;
						document.getElementById('customer_billing_city').value = customer.metadata.billing_city;
						document.getElementById('customer_billing_state').value = customer.metadata.billing_state;
						document.getElementById('customer_billing_zip').value = customer.metadata.billing_zip;
						document.getElementById('customer_shipping_address').value = customer.metadata.shipping_address;
						document.getElementById('customer_shipping_address_2').value = customer.metadata.shipping_address_2;
						document.getElementById('customer_shipping_city').value = customer.metadata.shipping_city;
						document.getElementById('customer_shipping_state').value = customer.metadata.shipping_state;
						document.getElementById('customer_shipping_zip').value = customer.metadata.shipping_zip;
						document.getElementById('customer_phone').value = customer.metadata.phone;
						document.getElementById('customer_fax').value = customer.metadata.fax;

						document.getElementById('add_customer_action').value = "Update";

						showCustomerDialog();
					}
					break;
				case 'delete':
					{
						if (confirm("Delete this bill?")) {
							document.getElementById('choiceform-action').value = 'delete';
							document.getElementById('choiceform-id').value = obj.getAttribute('data-id');
							document.getElementById('choiceform').submit();
						}
					}
					break;
			}
			obj.value = "";
			return false;
		}
	</script>
	<?php	
}
?>