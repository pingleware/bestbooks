<?php
// ajax.php
if (!function_exists('bestbooks_add_chartofaccount')) {
	function bestbooks_add_chartofaccount() {
		try {
			$name = $_POST['aname'];
			$type = $_POST['atype'];
		
			$coa = new ChartOfAccounts();
			echo $coa->add($name, $type);
		} catch(Exception $ex) {
			echo $ex->getMessage();
		}
		exit;
	}
	
	add_action( 'wp_ajax_bestbooks_add_chartofaccount', 'bestbooks_add_chartofaccount' );
	add_action( 'wp_ajax_nopriv_bestbooks_add_chartofaccount', 'bestbooks_add_chartofaccount' );	
}


if (!function_exists('bestbooks_delete_chartofaccount')) {
	function bestbooks_delete_chartofaccount() {
		$name = $_POST['aname'];
		$coa = new ChartOfAccounts();
		$active_company = get_option('bestbooks_active_company');
		if (isset($active_company) === false) {
			$active_company = 0;
		}
		echo $coa->remove($name, $active_company);
		exit;
	}
	
	add_action( 'wp_ajax_bestbooks_delete_chartofaccount', 'bestbooks_delete_chartofaccount' );
	add_action( 'wp_ajax_nopriv_bestbooks_delete_chartofaccount', 'bestbooks_delete_chartofaccount' );	
}

if (!function_exists('bestbooks_ajax_bestbooks_add_transaction')) {
	/**
	 * {
	 * 		action: bestbooks_add_transaction
	 * 		type: Bank
	 * 		account: Banke Name
	 * 		date: 2021-09-20
	 * 		description: Deposit
	 * 		debit: 380.00
	 * 		credit: 0.00
	 * }
	 */
	function bestbooks_ajax_bestbooks_add_transaction() {
		$type = $_POST['type'];
		$account = $_POST['account'];
		$date = $_POST['date'];
		$description = $_POST['description'];
		$debit = $_POST['debit'];
		$credit = $_POST['credit'];

		$status = bestbooks_add_transaction($type,$account,$date,$description,$debit,$credit);
		echo json_encode($status);
		exit;
	}

	add_action('wp_ajax_bestbooks_add_transaction','bestbooks_ajax_bestbooks_add_transaction');
	add_action('wp_ajax_nopriv_bestbooks_add_transaction','bestbooks_ajax_bestbooks_add_transaction');
}

if (!function_exists('bestbooks_ajax_bestbooks_edit_transaction')) {
	function bestbooks_ajax_bestbooks_edit_transaction() {
		$id = $_POST['id'];
		$type = $_POST['type'];
		$account = $_POST['account'];
		$date = $_POST['date'];
		$description = $_POST['description'];
		$debit = $_POST['debit'];
		$credit = $_POST['credit'];
	
		$message = bestbooks_edit_transaction($id, $type, $account, $date, $description, $debit, $credit);
		echo json_encode($message);
		exit;
	}
	
	add_action('wp_ajax_bestbooks_edit_transaction','bestbooks_ajax_bestbooks_edit_transaction');
	add_action('wp_ajax_nopriv_bestbooks_edit_transaction','bestbooks_ajax_bestbooks_edit_transaction');
}


if (!function_exists('bestbooks_ajax_bestbooks_add_journal_transaction')) {
	function bestbooks_ajax_bestbooks_add_journal_transaction() {
		$name = $_POST['name'];
		$account = $_POST['account'];
		$date = $_POST['date'];
		$reference = $_POST['ref'];
		$description = $_POST['description'];
		$debit = $_POST['debit'];
		$credit = $_POST['credit'];
	
		$message = bestbooks_add_journal_transaction($name, $account, $date, $reference, $debit, $credit);
		echo json_encode($message);
		exit;
	}
		
	add_action('wp_ajax_bestbooks_add_journal_transaction','bestbooks_ajax_bestbooks_add_journal_transaction');
	add_action('wp_ajax_nopriv_bestbooks_add_journal_transaction','bestbooks_ajax_bestbooks_add_journal_transaction');
}

if (!function_exists('bestbooks_ajax_bestbooks_edit_journal_transaction')) {
	function bestbooks_ajax_bestbooks_edit_journal_transaction() {
		$id = $_POST['id'];
		$name = $_POST['name'];
		$account = $_POST['account'];
		$date = $_POST['date'];
		$reference = $_POST['ref'];
		$debit = $_POST['debit'];
		$credit = $_POST['credit'];
	
		$message = bestbooks_edit_journal_transaction($id, $name, $account, $date, $reference, $debit, $credit);
		echo json_encode($message);
		exit;
	}
	
	add_action('wp_ajax_bestbooks_edit_journal_transaction','bestbooks_ajax_bestbooks_edit_journal_transaction');
	add_action('wp_ajax_nopriv_bestbooks_edit_journal_transaction','bestbooks_ajax_bestbooks_edit_journal_transaction');
}
?>