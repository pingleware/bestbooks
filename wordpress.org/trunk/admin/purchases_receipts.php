<?php
require 'inc/Receipts_List_Table.inc.php';

function bestbooks_dashboard_purchases_receipts() {
	$text = '';
	if (isset($_POST['add_receipt'])) {
		// These files need to be included as dependencies when on the front end.
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );

		$timezone = get_option("bestbooks_timezone");
		date_default_timezone_set($timezone);

		$post_id = wp_insert_post(
			array(
				'post_type' => 'bestbooks_receipt',
				'post_title' => $_FILES['receipt']['name'],
				'post_content' => json_encode(array($_POST,$_FILES)),
				'post_status' => 'publish'
			)
		);

		if (is_wp_error($post_id)) {
			$error_string = $post_id->get_error_message();
			echo '<div id="message" class="error"><p>' . $error_string . '</p></div>';
		} else {
			$attachment_id = media_handle_upload('receipt', $post_id);
			if (is_wp_error($attachment_id)) {
				$error_string = $post_id->get_error_message();
				echo '<div id="message" class="error"><p>' . $error_string . '</p></div>';
			} else {
				// successful upload
				$attachment = get_post($attachment_id);

				//use Ddeboer\Tesseract\Tesseract;
				//$tesseract = new Ddeboer\Tesseract\Tesseract();
				$text = $attachment->guid;
				update_post_meta($post_id, 'bestbooks_status', 'uploaded');

				$active_company = get_option('bestbooks_active_company');
				if (isset($active_company) === false) {
					$active_company = 0;
				}
				update_post_meta($post_id, 'company', $active_company);	
			}
		}
	} elseif (isset($_POST['view-receipt-save'])) {
		$txdate = $_POST['view-receipt-txdate'];
		$description = $_POST['view-receipt-description'];
		$amount = $_POST['view-receipt-account-amount'];
		$account = $_POST['view-receipt-account'];
		$payment_method = $_POST['view-receipt-payment-method'];
		$action_hook = $_POST['view-receipt-payment-action'];
		$post_id = $_POST['view-receipt-payment-post-id'];
		update_post_meta($post_id,'total',$_POST['view-receipt-amount']);
		if (!empty($action_hook)) {
			if (stripos($payment_method,'bank') !== false || stripos($payment_method,'check') !== false) {
				// paying by bank or check
				$bank = $_POST['view-receipt-bank'];
				call_user_func($action_hook,$txdate, $description, $amount, $account, $bank);
				update_post_meta($post_id,'bestbooks_status','posted');
			} else {
				// not paying by bank nor check
				call_user_func($action_hook,$txdate, $description, $amount, $account);
				update_post_meta($post_id,'bestbooks_status','posted');
			}	
		} else {
			echo '<script>alert("No acction hook callback assigned to payment method of '.$payment_method.'");</script>';
		}
	}

	$coa = get_coa_instance();
	$expense_accounts = array();
	foreach($coa->account as $name => $type) {
		if ($type === 'Expense') {
			array_push($expense_accounts, $name);
		}
	}
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<style>
		img {
			height: auto;
			max-width: 100%;
		}
		img.expanded {
			max-width: none;
		}
		.center {
			display: block;
			margin-left: auto;
			margin-right: auto;
			width: 50%;
		}
	</style>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_purchases'); ?>">Purchases</a> - Receipts</h2>
		<form method="post" enctype="multipart/form-data">
			<label for="receipt">Receipt Filename</label>
			<input type="file" class="w3-input w3-block" name="receipt" id="receipt" />
			<?php wp_nonce_field('receipt_upload', 'receipt_upload_nonce'); ?>
			<input type="submit" class="w3-button w3-block w3-blue" id="add_receipt" name="add_receipt" value="Upload Receipt" />
		</form>
		<br/>
		<?php
		$receipt_list_table = new Receipts_List_Table();
		$receipt_list_table->prepare_items();
		$receipt_list_table->display();
		?>
	</div>
	<div class="w3-modal" id="view-receipt">
		<div class="w3-modal-content">
			<div class="w3-container">
				<form method="post">
					<h2 class="w3-green">Receipt View</h2>
					<input type="hidden" name="view-receipt-payment-post-id" id="view-receipt-payment-post-id" value="" />
					<image class="center w3-image w3-responsive" src="" width="auto" height="auto" id="view-receipt-image" />
					<label for="view-receipt-payment-method">Payment Method (<a href="<?php echo admin_url('edit-tags.php?taxonomy=bestbooks_payment_method'); ?>">Click to manage payment methods?</a>)</label>
					<input type="hidden" name="view-receipt-payment-action" id="view-receipt-payment-action" value="" />
					<select class="w3-input w3-block" id="view-receipt-payment-method" name="view-receipt-payment-method" onchange="changePaymentMethod(this)">
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
					<label for="view-receipt-bank">Bank (<a href="<?php echo admin_url('admin.php?page=bestbooks_banking'); ?>">Click to manage bank accounts</a>)</label>
					<?php $banks = get_posts(array('post_type'=>'bestbooks_bank','post_status'=>'publish','meta_key'=>'company','meta_value'=>$company,'meta_compare'=>'=')); ?>
					<select class="w3-input w3-block" id="view-receipt-bank" name="view-receipt-bank" disabled>
						<option value="">Select</option>
						<?php
						foreach($banks as $bank) {
							echo '<option value="'.$bank->post_title.'">'.$bank->post_title.'</option>';
						}
						?>
					</select>
					<label for="view-receipt-txdate">Transaction Date</label>
					<input type="date" class="w3-input w3-block" name="view-receipt-txdate" id="view-receipt-txdate" value="" placeholder="" />
					<label for="view-receipt-description">Description</label>
					<input type="text" class="w3-input w3-block" name="view-receipt-description" id="view-receipt-description" value="" placeholder="" />
					<label for="view-receipt-amount">Receipt Total</label>
					<input type="number" step="any" class="w3-input w3-block" name="view-receipt-amount" id="view-receipt-amount" value="" placeholder="" />
					<label for="view-receipt-account">Expense Account</label>
					<input type="text" class="w3-input w3-block" id="view-receipt-account" name="view-receipt-account" list="expense-account-list">
					<datalist id="expense-account-list">
						<?php
						foreach($expense_accounts as $account) {
							echo '<option value="'.$account.'">';
						}
						?>
					</datalist>
					<label for="view-receipt-account-amount">Expense Account Amount</label>
					<input type="number" step="any" class="w3-input w3-block" id="view-receipt-account-amount" name="view-receipt-account-amount">
					<br/>
					<input type="submit" class="w3-button w3-block w3-black" name="view-receipt-save" id="view-receipt-save" value="Save" />
					<br/>
					<button class="w3-button w3-block w3-orange" onclick="document.getElementById('view-receipt').style.display='none';return false;">Cancel</button>
					<br/>
				</form>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		function enlargeImage(obj) {
			console.log(obj);
			document.getElementById('view-receipt-amount').value = obj.getAttribute('data-total-amount');
			document.getElementById('view-receipt-payment-post-id').value = obj.getAttribute('data-id');
			document.getElementById('view-receipt-image').setAttribute('src', obj.getAttribute('src'));
			document.getElementById('view-receipt').style.display='block';
		}
		function estimateAction(obj) {
			switch(obj.value) {
				case 'delete':
					if (confirm("Delete this receipt?")) {
						console.log(obj);
					}
					break;
			}
			obj.value = "";
		}
		function changePaymentMethod(obj) {
			var sel = document.getElementById('view-receipt-payment-method');
			var opt = sel.options[sel.selectedIndex];
			var action = opt.getAttribute('data-hook');
			document.getElementById('view-receipt-payment-action').value = action;
			var test = obj.value.toLowerCase();
			if (test.includes('bank') || test.includes('check')) {
				document.getElementById('view-receipt-bank').removeAttribute('disabled');
			} else {
				document.getElementById('view-receipt-bank').setAttribute('disabled','disabled');
			}
		}
	</script>
	<?php	
}
?>