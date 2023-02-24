<?php
/**
 * The hooks.php contains predefined action hooks and must be
 * invoked using the WordPress do_action() method.
 *
 * @category HOOKS
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PHK Corporation 
 */
// hooks.php
require dirname(__FILE__).'/hooks-profit.php';
require dirname(__FILE__).'/hooks-nonprofit.php';

if (!function_exists('bestbooks_create_account')) {
	add_action('bestbooks_create_account','bestbooks_create_account', 10, 2);

	/**
	 * Creates a new account within the chart of accounts, if
	 * the account does not exist?
	 * 
	 * @param string $name Account name
	 * @param AccountType $type Account type
	 * @return void
	 */
	function bestbooks_create_account($name, $type) {
	    $coa = new ChartOfAccounts();
	    $coa->add($name, $type);
	}
}

if (!function_exists('bestbooks_add_credit')) {
	add_action('bestbooks_add_credit', 'bestbooks_add_credit', 10, 4);

	/**
	 * Adds a credit entry to the account ledger
	 * 
	 * @param string $account Account name
	 * @param string $date Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return array $post_ids Ledger and Journal id's
	 */
	function bestbooks_add_credit($account, $date, $description, $amount) {
		return $account->addCredit($date, $description, $amount);
	}
}

if (!function_exists('bestbooks_add_debit')) {
	add_action('bestbooks_add_debit', 'bestbooks_add_debit', 10, 4);

	/**
	 * Adds a debit entry to the account ledger
	 * 
	 * @param string $account Account name
	 * @param string $date Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return array $post_id Ledger and Journal id's
	 */

	function bestbooks_add_debit($account, $date, $description, $amount) {
		return $account->addDebit($date, $description, $amount);
	}
}

/**
 * Debit Accounts: Assets & Expenses
 * From: https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
 * 
 * Because Asset and Expense accounts maintain positive balances, they are positive, or debit 
 * accounts. Accounting books will say “Accounts that normally have a positive balance are
 *  increased with a Debit and decreased with a Credit.” Of course they are! Look at the 
 * number line. If you add a positive number (debit) to a positive number, you get a bigger
 * positive number. But if you start with a positive number and add a negative number 
 * (credit), you get a smaller positive number (you move left on the number line). 
 * The asset account called Cash, or the checking account, is unique in that it routinely
 * receives debits and credits, but its goal is to maintain a positive balance!
 */

if (!function_exists('bestbooks_asset')) {
	add_action('bestbooks_asset', 'bestbooks_asset', 10, 4);

	/**
	 * Add an entry to specified asset account
	 * 
	 * @see https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
	 * 
	 * @param string $account Asset account name
	 * @param string $txdate Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return void
	 */
	function bestbooks_asset($account, $txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Asset");

		$asset = new Asset($account);

		if ($amount < 0) {
			$asset->decrease($txdate, $description, $amount);
		} else {
			$asset->increase($txdate, $description, $amount);
		}
	}
}

if (!function_exists('bestbooks_expense')) {
	add_action('bestbooks_expense', 'bestbooks_expense', 10, 4);

	/**
	 * Add an entry to specified expense account
	 * 
	 * @see https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
	 * 
	 * @param string $account Expense account name
	 * @param string $txdate Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return void
	 */
	function bestbooks_expense($account, $txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Asset");

		$expense = new Expense($account);

		if ($amount < 0) {
			$expense->decrease($txdate, $description, $amount);
		} else {
			$expense->increase($txdate, $description, $amount);
		}
	}
}

/**
 * Credit Accounts: Liabilities, Equity, & Revenue
 * From: https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
 *
 * Liability, Equity, and Revenue accounts usually receive credits, so they maintain negative 
 * balances. They are called credit accounts. Accounting books will say “Accounts that 
 * normally maintain a negative balance are increased with a Credit and decreased with a 
 * Debit.” Again, look at the number line. If you add a negative number (credit) to a 
 * negative number, you get a larger negative number! (moving left on the number line). But 
 * if you start with a negative number and add a positive number to it (debit), you get a 
 * smaller negative number because you move to the right on the number line.
 * 
 * We have not discussed crossing zero on the number line. If we have $100 in our checking
 * account and write a check for $150, the check will bounce and Cash will have a negative 
 * value - an undesirable event. A negative account might reach zero - such as a loan account 
 * when the final payment is posted. And many accounts, such as Expense accounts, are reset 
 * to zero at the beginning of the new fiscal year. But credit accounts rarely have a 
 * positive balance and debit accounts rarely have a negative balance at any time.
 * 
 * [Remember: A debit adds a positive number and a credit adds a negative number. But you 
 * NEVER put a minus sign on a number you enter into the accounting software.] 
 */

if (!function_exists('bestbooks_liability')) {
	add_action('bestbooks_liability', 'bestbooks_liability', 10, 4);

	/**
	 * Add an entry to specified liability account
	 * 
	 * @see https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
	 * 
	 * @param string $account Account name
	 * @param string $txdate Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return void
	 */
	function bestbooks_liability($account, $txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Liability");

		$liability = new Liability($account);
		if ($amount < 0) {
			$liability->decrease($txdate, $description, $amount);
		} else {
			$liability->increase($txdate, $description, $amount);
		}
	}
}

if (!function_exists('bestbooks_equity')) {
	add_action('bestbooks_equity', 'bestbooks_equity', 10, 4);

	/**
	 * Add an entry to specified equity account
	 * 
	 * @see https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml Accounting Basics for Debits & Credits
	 * 
	 * @param string $account Account name
	 * @param string $txdate Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return void
	 */
	function bestbooks_equity($account, $txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Equity");

		$equity = new Equity($account);
		if ($amount < 0) {
			$equity->increase($txdate, $description, $amount);
		} else {
			$equity->decrease($txdate, $description, $amount);
		}
	}
}

if (!function_exists('bestbooks_revenue')) {
	add_action('bestbooks_revenue', 'bestbooks_revenue', 10, 4);

	/**
	 * Add an entry to specified revenue account
	 * 
	 * @see https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml Accounting Basics for Debits & Credits
	 * 
	 * @param string $account Account name
	 * @param string $txdate Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return void
	 */
	function bestbooks_revenue($account, $txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Revenue");

		$revenue = new Revenue($account);
		if ($amount < 0) {
			$revenue->decrease($txdate, $description, $amount);
		} else {
			$revenue->increase($txdate, $description, $amount);
		}
	}
}

if (!function_exists('bestbooks_bank')) {
	add_action('bestbooks_bank', 'bestbooks_bank', 10, 5);
	/**
	 * $account name of the bank account
	 * $txdate transaction date
	 * $description description of bank transaction
	 * $amount the amount of the transaction
	 * $origination source of funds (Cash, Account Receivable, etc.)
	 * 
	 * @return array Array
	 * (
	 *     [bank] => Array
	 *         (
	 *             [0] => 47  => bank ledger id
	 *             [1] => 61  => bank journal id 
	 *         )
	 *     [asset] => Array
	 *         (
	 *             [0] => 48  => asset ledger id
	 *             [1] => 62  => asset journal id
	 *         )
	 * )
	 */
	function bestbooks_bank($account, $txdate, $description, $amount, $origination="") {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Bank");

		$timezone = get_option("bestbooks_timezone");
		date_default_timezone_set($timezone);

		$post_ids = array();
		$bank_ledger_id = 0;
		$asset_ledger_id = 0;

		$bank = new Bank($account);
		if ($amount < 0) {
			$post_ids = $bank->decrease($txdate, $description, abs($amount));
		} else {
			$post_ids = $bank->increase($txdate, $description, abs($amount));
		}
		$bank_ledger_id = $post_ids[0];
		$bank_journal_ref_id = $post_ids[1];
		$bank->setRef($bank_ledger_id, $bank_journal_ref_id);

		if (!empty($origination)) {
			$coa->add($origination, "Asset");
			$asset = new Asset($origination);
			if ($amount < 0) {
				$post_ids = $asset->increase($txdate, $description, abs($amount));
			} else {
				$post_ids = $asset->decrease($txdate, $description, abs($amount));
			}
			$asset_ledger_id = $post_ids[0];
			$asset_journal_ref_id = $post_ids[1];
			$asset->setRef($asset_ledger_id,$asset_journal_ref_id);
			$asset->setXRef($asset_ledger_id, $bank_ledger_id);
			$bank->setXRef($bank_ledger_id, $asset_ledger_id);
			Journal::setXRef($bank_journal_ref_id, $asset_journal_ref_id);
			Journal::setXRef($asset_journal_ref_id, $bank_journal_ref_id);
		}
		return array(
			'bank' => array($bank_ledger_id, $bank_journal_ref_id),
			'asset' => array($asset_ledger_id, $asset_journal_ref_id)
		);
	}
}

if (!function_exists('bestbooks_journal_add')) {
	add_action('bestbooks_journal_add', 'bestbooks_journal_add', 10, 5);

	/**
	 * Makes a journal entry
	 * 
	 * @see https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
	 * 
	 * @param string $txdate Transaction date
	 * @param string $ref Transaction description reference
	 * @param string $account Account name
	 * @param double $debit Debit amount (can be zero)
	 * @param double $credit Credit amount (can be zero)
	 * 
	 * @return int $id Journal post id
	 */
	function bestbooks_journal_add($txdate,$ref,$account,$debit,$credit) {
		$journal = new Journal();
		return $journal->add($txdate,$ref,$account,$debit,$credit);
	}
}

if (!function_exists('bestbooks_journal_inbalance')) {
	add_action('bestbooks_journal_inbalance', 'bestbooks_journal_inbalance', 10, 0);

	/**
	 * Checks if Journal is in balance
	 * 
	 * @param null
	 * @return boolean True if journal is in balance
	 */
	function bestbooks_journal_inbalance() {
		$journal = new Journal();
		return $journal->inBalance();
	}
}

if (!function_exists('bestbooks_add_transaction')) {
    function bestbooks_add_transaction($type, $account, $date, $description, $debit, $credit) {
		$coa = new ChartOfAccounts();
		$coa->add($account, $type);

		try {
			$ledger = new Ledger($account, $type);
			return $ledger->add($account, $type, $date, $description, $debit, $credit);
		} catch(Exception $ex) {
			return $ex->getMessage();
			exit;
		}
    }
}

if (!function_exists('bestbooks_ledger_add_transaction')) {
	add_action('bestbooks_ledger_add_transaction','bestbooks_ledger_add_transaction', 10, 6);

	function bestbooks_ledger_add_transaction($type, $account, $date, $description, $debit, $credit) {
		return bestbooks_add_transaction($type, $account, $date, $description, $debit, $credit);
	}
}

if (!function_exists('bestbooks_edit_transaction')) {
	add_action('bestbooks_edit_transaction','bestbooks_edit_transaction',10,7);

	/**
	 * Makes the appropriate entry for recording a bank fee
	 * 
	 * @param string $txdate Transaction date
	 * @param string $description Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return void
	 */
	function bestbooks_edit_transaction($id, $type, $account, $date, $description, $debit, $credit) {
		$coa = new ChartOfAccounts();
		$coa->add($account, $type);

		try {
			$ledger = new Ledger($account, $type);
			$ledger->getByID($id);
			return $ledger->update($id, $account, $type, $date, $description, $debit, $credit);
		} catch(Exception $ex) {
			return $ex->getMessage();
			exit;
		}
	}
}

if (!function_exists('bestbooks_ledger_edit_transaction')) {
	add_action('bestbooks_ledger_edit_transaction','bestbooks_ledger_edit_transaction',10,7);

	function bestbooks_ledger_edit_transaction($id, $type, $account, $date, $description, $debit, $credit) {
		bestbooks_edit_transaction($id, $type, $account, $date, $description, $debit, $credit);
	}
}

if (!function_exists('bestbooks_get_transactions')) {
	add_action('bestbooks_get_transactions','bestbooks_get_transactions',10,7);

	function bestbooks_get_transactions($account, $type, $begin_date, $end_date) {
		try {
			$ledger = new Ledger($account, $type);
			return $ledger->get_transactions_by_range($begin_date, $end_date);
		} catch(Exception $ex) {
			$error = array(
				'status' => 'error',
				'messahe' => $ex->getMessage()
			);
			echo json_encode($error);
			exit;
		}	
	}
}

if (!function_exists('bestbooks_ledger_get_transactions')) {
	add_action('bestbooks_ledger_get_transactions','bestbooks_ledger_get_transactions', 10, 7);

	function bestbooks_ledger_get_transactions($account, $type, $begin_date, $end_date) {
		bestbooks_get_transactions($account, $type, $begin_date, $end_date);
	}
}

if (!function_exists('bestbooks_journal_add')) {
	add_action('bestbooks_journal_add', 'bestbooks_journal_add', 10, 6);

	function bestbooks_journal_add($name,$txdate,$ref,$account,$debit,$credit) {
		try {
			$journal = new Journal($name);
			return $journal->add($txdate,$ref,$account,$debit,$credit);
		} catch(Exception $ex) {
			echo $ex->getMessage();
			exit;
		}
	}
}

if (!function_exists('bestbooks_add_journal_transaction')) {
	add_action('bestbooks_add_journal_transaction','bestbooks_add_journal_transaction', 10, 6);

	function bestbooks_add_journal_transaction($name,$account,$txdate,$ref,$debit,$credit) {
		// $name,$txdate,$ref,$account,$debit,$credit
		return bestbooks_journal_add($name,$txdate,$ref,$account,$debit,$credit);
	}
}

if (!function_exists('bestbooks_journal_add_transaction')) {
	add_action('bestbooks_journal_add_transaction','bestbooks_journal_add_transaction', 10, 5);

	function bestbooks_journal_add_transaction($txdate,$ref,$account,$debit,$credit) {
		return bestbooks_journal_add('General Journal',$txdate,$ref,$account,$debit,$credit);
	}
}

if (!function_exists('bestbooks_edit_journal_transaction')) {
	add_action('bestbooks_edit_journal_transaction','bestbooks_edit_journal_transaction',10,7);

	function bestbooks_edit_journal_transaction($id, $name, $account, $date, $reference, $debit, $credit) {
		try {
			$journal = new Journal($name);
			return $journal->update($id,$date,$account,$debit,$credit,$reference);
		} catch(Exception $ex) {
			echo $ex->getMessage();
			exit;
		}
	}
}

/**
 * Original jounrnal edit method for backward compatibility with a single journal = 'General Journal'
 */
if (!function_exists('bestbooks_journal_edit_transaction')) {
	add_action('bestbooks_journal_edit_transaction','bestbooks_journal_edit_transaction', 10, 6);

	function bestbooks_journal_edit_transaction($id, $account, $date, $reference, $debit, $credit) {
		bestbooks_edit_journal_transaction($id, 'General Journal', $account, $date, $reference, $debit, $credit);
	}
}

if (!function_exists('bestbooks_journal_inbalance')) {
	add_action('bestbooks_journal_inbalance', 'bestbooks_journal_inbalance', 10, 0);

	function bestbooks_journal_inbalance() {
		$journal = new Journal();
		return $journal->inBalance();
	}
}

if (!function_exists('bestbooks_user_register')) {
	add_action('user_register', 'bestbooks_user_register', 10, 2);

	function bestbooks_user_register($user_id, $userdata) {
		/*
		when company is switched in Setttings, the accounting tables are created, if not exist?
		if (isset($userdata->role) && $userdata->role === "bestbooks_company") {
			ChartOfAccounts::createTable();
			ChartOfAccounts::alterTable();
			Journal::createTable();
			Journal::alterTable();
			Ledger::createTable();
			Ledger::alterTable();
		}
		*/
	}	
}
// do_action( 'profile_update', int $user_id, WP_User $old_user_data, array $userdata )
add_action('profile_update','bestbooks_profile_update',10,3);
function bestbooks_profile_update($user_id, $old_user_data, $userdata) {
	/*
	when company is switched in Setttings, the accounting tables are created, if not exist?
	if (isset($userdata['role']) && $userdata['role'] === "bestbooks_company") {
		ChartOfAccounts::createTable();
		ChartOfAccounts::alterTable();
		Journal::createTable();
		Journal::alterTable();
		Ledger::createTable();
		Ledger::alterTable();
	}
	*/
}
?>
