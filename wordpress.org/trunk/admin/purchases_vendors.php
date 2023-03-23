<?php
require 'inc/Vendor_List_Table.inc.php';


function bestbooks_dashboard_purchases_vendors() {
    $bestbooks_vendor = get_option("bestbooks_vendor");
    if (isset($bestbooks_vendor) === false) {
        $bestbooks_vendor = "bestbooks_vendor";
	}
	
	if (is_multisite()) {
		$blog_id = get_current_blog_id();
	}

	if (isset($_POST['vendor_email'])) {
		$vendor_name = $_POST['vendor_name'];
		$vendor_email = $_POST['vendor_email'];
		$vendor_address = $_POST['vendor_address'];
		$vendor_address_1 = $_POST['vendor_address_1'];
		$vendor_csv = $_POST['vendor_csv'];
		$vendor_phone = $_POST['vendor_phone'];
		$vendor_fax = $_POST['vendor_fax'];
		$vendor_fein = $_POST['vendor_fein'];

		//$timezone = get_option("bestbooks_timezone");
		//$zones = timezone_identifiers_list();
		//date_default_timezone_set($zones[$timezone]);

		if (($user_id = username_exists($vendor_email)) || email_exists($vendor_email)) {
			$user = get_user_by('id', $user_id);
			$user->display_name = $vendor_name;
			wp_update_user($user);
			$user->add_role($bestbooks_vendor);
			//add_user_to_blog($blog_id, $user_id, $user->role);
			update_user_meta($user_id, 'address', $vendor_address);
			update_user_meta($user_id, 'address_1', $vendor_address_1);
			update_user_meta($user_id, 'csv', $vendor_csv);
			update_user_meta($user_id, 'phone', $vendor_phone);
			update_user_meta($user_id, 'fax', $vendor_fax);
			update_user_meta($user_id, 'fein', $vendor_fein);
		} else {
			$random_password = wp_generate_password(12, false);
			$user_id = wp_create_user($vendor_email, $random_password, $vendor_email);
			if (is_wp_error($user_id)) {
				$error_string = $user_id->get_error_message();
   				echo '<div id="message" class="error"><p>' . $error_string . '</p></div>';
			} else {
				$user = get_user_by('id', $user_id);
				$user->display_name = $vendor_name;
				wp_update_user($user);
				if (is_multisite()) {
					add_user_to_blog($blog_id, $user_id, $bestbooks_vendor);
				}
				update_user_meta($user_id, 'address', $vendor_address);
				update_user_meta($user_id, 'address_1', $vendor_address_1);
				update_user_meta($user_id, 'csv', $vendor_csv);
				update_user_meta($user_id, 'phone', $vendor_phone);
				update_user_meta($user_id, 'fax', $vendor_fax);
				update_user_meta($user_id, 'fein', $vendor_fein);
			}
		}
	} elseif (isset($_POST['send_vendor_1099'])) {
	} elseif (isset($_POST['choiceform'])) {
		$user_id = $_POST['post_id'];
		switch($_POST['action']) {
			case 'delete':
				wp_delete_user($user_id);
				break;
		}
	}
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Vendors
		<input type="button" class="w3-button w3-blue" id="add_vendor" value="Add a Vendor" />
		</h2>
		<?php
		$vendor_list_table = new Vendor_List_Table();
		$vendor_list_table->prepare_items();
		$vendor_list_table->display();
		?>
	</div>
	<!-- ADD NEW VENDOR DIALOG -->
	<div id="add-vendor-dialog" title="Add New|Edit Existing Vendor" style="display:none;">
		<form method="post" id="addvendorform">
		<label for="vendor_name">Name</label>
		<input class="w3-input" type="text" id="vendor_name" name="vendor_name" value="" required />
		<label for="vendor_fein">Federal Employer ID (FEIN)</label>
		<input class="w3-input" type="text" id="vendor_fein" name="vendor_fein" minlength="9" maxlength="9" value="" placeholder="without hyphens (#########)" required />
		<label for="vendor_email">EMail</label>
		<input class="w3-input" type="email" id="vendor_email" name="vendor_email" value="" required />
		<fieldset>
			<label for="vendor_address">Address</label>
			<input class="w3-input" type="text" id="vendor_address" name="vendor_address" value="" required />
			<input class="w3-input" type="email" id="vendor_address_1" name="vendor_address_1" value="" required />
			<label for="vendor_csv">City, State, Zip</label>
			<input class="w3-input" type="text" id="vendor_csv" name="vendor_csv" value="" required />
		</fieldset>
		<label for="vendor_phone">Phone</label>
		<input class="w3-input" type="text" id="vendor_phone" name="vendor_phone" value="" required />
		<label for="vendor_fax">FAX</label>
		<input class="w3-input" type="text" id="vendor_fax" name="vendor_fax" value="" required />
		<input class="w3-button w3-block w3-black" type="button" id="add_vendor_action" name="add_vendor_action" value="Add" />
		</form>
	</div>
	<!-- SEND 1099 FORM -->
	<div id="send-1099-dialog" title="Send 1099 Form" style="display:none;">
		<form method="post" id="sendvendor1099">
			<input type="hidden" name="send-1099-dialog-vendor-id" id="send-1099-dialog-vendor-id" value="0" />
			<label for="send-1099-dialog-name">Vendor Name</label>
			<input type="text" class="w3-input w3-block w3-light-grey" name="send-1099-dialog-name" id="send-1099-dialog-name" value="" disabled />
			<label for="send-1099-dialog-email">Vendor Email</label>
			<input type="text" class="w3-input w3-block w3-light-grey" name="send-1099-dialog-email" id="send-1099-dialog-email" value="" disabled />
			<label for="send-1099-dialog-taxyear">Tax Year</label>
			<select class="w3-input w3-block" name="send-1099-dialog-taxyear" id="send-1099-dialog-taxyear">
			<?php
				for ($year = date('Y') - 7; $year <= date('Y'); $year++) {
					if ($year == (date('Y') - 1)) {
						echo '<option value="'.$year.'" selected>'.$year.'</option>';
					} else {
						echo '<option value="'.$year.'">'.$year.'</option>';
					}
				}
			?>
			</select>
			<br/>
			<input class="w3-button w3-block w3-black" type="button" id="send_vendor_1099" name="send_vendor_1099" value="Send" />
			<br/>
			<a href="https://www.accountingtools.com/articles/what-is-a-1099-vendor.html" target="_blank" class="w3-button w3-block w3-green">1099 Vendor Definition</a>
		</form>
	</div>
	<form id="choiceform" method="post" style="display:none;">
		<input type="hidden" name="action" id="choiceform-action" value="" />
		<input type="hidden" name="post_id" id="choiceform-post_id" value="" />
		<input type="hidden" name="choiceform" value="choiceform" />
	</form>
	<script>
		jQuery(document).ready(function($){
			$("#add-vendor-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
		  	$("#send-1099-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('#add_vendor').bind('click', function(){
				$('#vendor_email').val("");
				$('#vendor_name').val("");
				$('#vendor_fein').val("");
				$('#vendor_address').val("");
				$('#vendor_address_1').val("");
				$('#vendor_csv').val("");
				$('#vendor_phone').val("");
				$('#vendor_fax').val("");
				$("#add_vendor_action").val("Add");
				$("#add-vendor-dialog").dialog("open");
				return false;
			});
			$('#add_vendor_action').bind('click', function(){
				if ($('#vendor_email').val() == "") {
					alert("Missing Vendor Email!");
					return false;
				}
				if ($('#vendor_name').val() == "") {
					alert("Missing Vendor name");
					return false;
				}
				// submit form
				document.getElementById("addvendorform").submit();
			});
			deleteVendor = function(obj) {
				console.log(obj);
				if (confirm("Delete account " + $(obj).data('name') + "?")) {
					// submit form
					$('#choiceform-action').val('delete');
					$('#choiceform-post_id').val($(obj).data('id'));
					$('#choiceform').submit();
				}
			}
			showSend1099Dialog = function() {
				$("#send-1099-dialog").dialog("open");
			}
			showAddVendorDialog = function(vendor) {
				$('#vendor_email').val(vendor.user_email);
				$('#vendor_name').val(vendor.display_name);
				$('#vendor_address').val(vendor.metadata.address);
				$('#vendor_address_1').val(vendor.metadata.address_1);
				$('#vendor_csv').val(vendor.metadata.csv);
				$('#vendor_phone').val(vendor.metadata.phone);

				if (vendor.metadata.fein) {
					$('#vendor_fein').val(vendor.metadata.fein);
				} else {
					$('#vendor_fein').val("");
				}

				$("#add_vendor_action").val("Edit");
				$("#add-vendor-dialog").dialog("open");
			}
		});
		function vendorAction(obj) {
			switch(obj.value) {
				case 'edit':
					{
						var base64 = obj.getAttribute('data-vendor');
						var json = atob(base64);
						var vendor = JSON.parse(json).data;
						console.log(vendor);
						//document.getElementById('add-vendor-dialog').setAttribute('title','Edit Existing Vendor');
						showAddVendorDialog(vendor);
					}
					break;
				case '1099':
					var vendor_id = obj.getAttribute('data-id');
					document.getElementById('send-1099-dialog-vendor-id').value = vendor_id;
					document.getElementById('send-1099-dialog-name').value = obj.getAttribute('data-name');
					document.getElementById('send-1099-dialog-email').value = obj.getAttribute('data-email');
					showSend1099Dialog();
					break;
				case 'delete':
					deleteVendor(obj);
					break;
			}
			obj.value = "";
		}
	</script>
	<?php	
}
?>