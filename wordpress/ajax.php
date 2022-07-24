<?php
// ajax.php

add_action( 'wp_ajax_bestbooks_add_chartofaccount', 'bestbooks_add_chartofaccount' );
add_action( 'wp_ajax_nopriv_bestbooks_add_chartofaccount', 'bestbooks_add_chartofaccount' );

function bestbooks_add_chartofaccount() {
	//require_once dirname(__FILE__).'/vendor/autoload.php';

	$name = $_POST['aname'];
	$type = $_POST['atype'];

	$coa = new ChartOfAccounts();
	$coa->add($name, $type);
	echo "Account $name of $type added successfully!";
	exit;
}

add_action( 'wp_ajax_bestbooks_delete_chartofaccount', 'bestbooks_delete_chartofaccount' );
add_action( 'wp_ajax_nopriv_bestbooks_delete_chartofaccount', 'bestbooks_delete_chartofaccount' );

function bestbooks_delete_chartofaccount() {
	$name = $_POST['aname'];
	$coa = new ChartOfAccounts();
	echo $coa->remove($name);
	exit;
}


add_action('wp_ajax_bestbooks_add_transaction','bestbooks_ajax_bestbooks_add_transaction');
add_action('wp_ajax_nopriv_bestbooks_add_transaction','bestbooks_ajax_bestbooks_add_transaction');
/**
 * {"action":"bestbooks_add_transaction","type":"Revenue","account":"Income Receivable","date":"2015-02-22","description":"Google Play Apps","amount":"1.99"}
 */
function bestbooks_ajax_bestbooks_add_transaction() {
	$type = $_POST['type'];
	$account = $_POST['account'];
	$date = $_POST['date'];
	$description = $_POST['description'];
	$debit = $_POST['debit'];
	$credit = $_POST['credit'];
	bestbooks_add_transaction($type,$account,$date,$description,$debit,$credit);
	echo json_encode('New transaction added successfully!');
	exit;
}

add_action('wp_ajax_bestbooks_edit_transaction','bestbooks_ajax_bestbooks_edit_transaction');
add_action('wp_ajax_nopriv_bestbooks_edit_transaction','bestbooks_ajax_bestbooks_edit_transaction');

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

add_action('wp_ajax_bestbooks_add_journal_transaction','bestbooks_ajax_bestbooks_add_journal_transaction');
add_action('wp_ajax_nopriv_bestbooks_add_journal_transaction','bestbooks_ajax_bestbooks_add_journal_transaction');

function bestbooks_ajax_bestbooks_add_journal_transaction() {
	$account = $_POST['account'];
	$date = $_POST['date'];
	$reference = $_POST['ref'];
	$description = $_POST['description'];
	$debit = $_POST['debit'];
	$credit = $_POST['credit'];

	$message = bestbooks_add_journal_transaction($account, $date, $reference, $debit, $credit);
	echo json_encode($message);
	exit;
}

add_action('wp_ajax_bestbooks_edit_journal_transaction','bestbooks_ajax_bestbooks_edit_journal_transaction');
add_action('wp_ajax_nopriv_bestbooks_edit_journal_transaction','bestbooks_ajax_bestbooks_edit_journal_transaction');

function bestbooks_ajax_bestbooks_edit_journal_transaction() {
	$id = $_POST['id'];
	$account = $_POST['account'];
	$date = $_POST['date'];
	$reference = $_POST['ref'];
	$debit = $_POST['debit'];
	$credit = $_POST['credit'];

	$message = bestbooks_edit_journal_transaction($id, $account, $date, $reference, $debit, $credit);
	echo json_encode($message);
	exit;
}
?>