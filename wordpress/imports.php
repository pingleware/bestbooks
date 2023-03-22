<?php
// File: imports.php 

function bestbooks_importer_init() {
    /**
     * WordPress Importer object for registering the import callback
     * @global WP_Import $wp_import
     */
    //$GLOBALS['wp_barnimport'] = new WP_BarnImport();
	register_importer( 'bestbooksimport', 'BestBooks Import', __('Import into BestBooks'), 'bestbooks_import_dispatch' );

}
add_action( 'admin_init', 'bestbooks_importer_init' );

function bestbooks_import_dispatch() {
    global $wpdb;
    
    $step = empty( $_GET['step'] ) ? 0 : (int) $_GET['step'];
    switch ( $step ) {
        case 0:
            {
				bestbooks_import_step_0();
            }
            break;
        case 1:
            {
				bestbooks_import_step_1();
            }
            break;
    }
}

function bestbooks_import_step_0() {
	?>
	<script type="text/javascript">
		jQuery(document).ready(function($){
			var action = $('#import-upload-form').attr('action');
			$('#bbimportfile').change(function(){
				var selected = $(this).val();
				if (selected != "") {
				   var new_action = action + '&type=' + selected;
				   $('#import-upload-form').attr('action',new_action);
				} else {
				   $('#import-upload-form').attr('action',action); 
				}
			});
		});
	</script>
	<?php
	echo '<div class="narrow">';
	echo '<h2>'.__( 'Import into BestBooks' ).'</h2>';
	echo '<label for="bbimportfile">File Type</label>';
	echo '<select name="bbimportfile" id="bbimportfile">';
	echo '<option value="">Select</option>';
	echo '<option value="transactions">Transactions</option>';
	echo '<option value="stripe">Stripe Transactions</option>';
	echo '</select><br/>';

	wp_import_upload_form( 'admin.php?import=bestbooksimport&amp;step=1' );
	echo '</div>';	
}

function bestbooks_import_step_1() {
	check_admin_referer( 'import-upload' );
	$file = wp_import_handle_upload();

				
	if ( isset( $file['error'] ) ) {
		echo '<p><strong>' . __( 'Sorry, there has been an error.') . '</strong><br />';
		echo esc_html( $file['error'] ) . '</p>';
		return false;
	} else if ( ! file_exists( $file['file'] ) ) {
		echo '<p><strong>' . __( 'Sorry, there has been an error.') . '</strong><br />';
		printf( __( 'The export file could not be found at <code>%s</code>. It is likely that this was caused by a permissions problem.', 'wordpress-importer' ), esc_html( $file['file'] ) );
		echo '</p>';
		return false;
	}

	$target_dir =  WP_CONTENT_DIR ."/uploads/";
	$target_file = $target_dir . basename($file['file']);
	
	$fp = fopen($file['file'],'r');
	ini_set('auto_detect_line_endings',TRUE);
	
	echo '<div><h2>Importing Results - <b>'.strtoupper($_GET['type']).'</b></h2>';
	
	while (($import_data = fgetcsv( $fp )) !== FALSE) {
		if (isset($_GET['type'])) {
			$filetype = $_GET['type'];
			switch ($filetype) {
				case 'transactions':
					{
						bestbooks_import_transactions($import_data);
					}
					break;
				case 'stripe':
					{
						bestbooks_import_stripe($import_data);
					}
					break;
			}
		}
	}
	echo '</div>';

	ini_set('auto_detect_line_endings',FALSE);
	
	fclose($fp);
	@unlink($file['file']);
}

function bestbooks_import_transactions($import_data) {
	$date = date('Y-m-d',strtotime($import_data[0]));
	$description = str_replace( "'", "", $import_data[1]);
	$description = str_replace( "\\", "", $description);
	$debit = str_replace( ',', '', $import_data[2]);
	$credit = str_replace( ',', '', $import_data[3]);
	$account = $import_data[4];
	$type = $import_data[5];

	bestbooks_add_transaction($type,$account,$date,$description,$debit,$credit);
}

function bestbooks_import_stripe($import_data) {
	$date = date('Y-m-d',strtotime($import_data[0]));
	$description = $import_data[1];
	$type = $import_data[2];
	$amount = $import_data[3];
	$fee = $import_data[4];
	try {
		if ($type === 'charge') {
			if ($fee != 0) {
				bestbooks_bankfee($date, "Fee", $fee);     		
			}
			if ($amount != 0) {
				bestbooks_sales_card($date, $description, $amount);
			}
		} elseif ($type === 'payout') {
			if ($amount != 0) {
				bestbooks_accountreceivable_payment($date, $description, $amount);
			}
		}
	} catch (Exception $ex) {
		echo $ex->getMessage().'<br/>';
	}
	echo $date.','.$description.','.$type.','.$amount.','.$fee.'<br/>';
}



?>