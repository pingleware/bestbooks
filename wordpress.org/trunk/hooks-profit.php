<?php
// hooks-profit.php 
/**
 * Cost to Estimate Technological Feasability
 * FASB ASC Topic: 985-20-25-1
 * 
 * All costs incurred to establish the technological feasibility of a computer software product 
 * to be sold, leased, or otherwise marketed are research and development costs. 
 * Those costs shall be charged to expense when incurred as required by Subtopic
 * 
 * For purposes of this Subtopic, the technological feasibility of a computer software product is established when the entity has completed all planning, designing, 
 * activities that are necessary to establish that the product can be produced to meet its design specifications including functions, features, 
 * and technical performance requirements. At a minimum, the entity shall have performed the activities in either (a) or (b) as evidence that
 * technological feasibility has been established: 
 */


/**
 * Example 1: Owner Invests Capital in the Company
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * Owner invests $5,000.   Analysis: Since money is deposited into the checking account, Cash 
 * is debited (the balance increased by $5,000). What account receives a credit? An Equity 
 * account called Owner’s Equity or Capital Contribution. Since Equity accounts are 
 * ‘negative’ accounts, crediting this Equity account increases its balance by $5,000.
 *
 * Debit Cash (increase its balance)
 * 
 * Credit Owner’s Equity|Capital (increases its balance)
 */
if (!function_exists('bestbooks_investment')) {
	add_action('bestbooks_investment', 'bestbooks_investment', 10, 4);

	function bestbooks_investment($txdate, $description, $amount, $equity='Owners Equity') {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add($equity, 'Equity');

		$cash = new Cash('Cash');
		$cash->increase($txdate, $description, $amount);

		$equity = new Equity($equity);
		$equity->increase($txdate, $description, $amount);
	}
}

/**
 * Example 2: Company Takes Out a Loan
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The company borrows $8,000 from a bank.   Analysis: Since the money will be deposited into 
 * the checking account, Cash is debited (the balance increased by $8,000.) The account to 
 * receive the credit is a Liability account called Loans Payable (you may create a separate 
 * account or sub-account for each loan). Liability accounts are credit accounts, so 
 * crediting the Liability account increases its negative balance by $8,000 (moves to the 
 * left on the number line).
 *
 * Debit Cash (increases its balance)
 * 
 * Credit Loans Payable (increases its balance)
 */
if (!function_exists('bestbooks_encumber')) {
	add_action('bestbooks_encumber', 'bestbooks_encumber', 10, 3);

	function bestbooks_encumber($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add('Loans Payable', 'Liability');

		$cash = new Cash('Cash');
		$cash->increase($txdate, $description, $amount);

		$liability = new Liability('Loans Payable');
		$liability->increase($txdate, $description, $amount);
	}
}

/**
 * Example 3: Monthly Statement Fee from Bank
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * Your bank charges a monthly statement fee of $14.   Analysis: This transaction is entered via a journal 
 * entry each month when the checking account is balanced. Since money was removed from the checking 
 * account, Cash is credited (the balance decreased by $14). The Expense account called Bank Service 
 * Charges receives the debit.
 *
 * Debit Bank Fees (increases its balance)
 *
 * Credit Cash (decreases its balance)
 */
if (!function_exists('bestbooks_bankfee')) {
	add_action('bestbooks_bankfee', 'bestbooks_bankfee', 10, 3);

	function bestbooks_bankfee($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add('Bank Service Charges', 'Expense');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$expense = new Expense('Bank Service Charges');
		$expense->increase($txdate, $description, $amount);
	}
}


/**
 * Example 4: Making a Loan Payment
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * You pay $540, via check, on the $8,000 loan acquired in Example 2. Of this amount, $500 is applied to 
 * the principal, and $40 is applied to the loan interest.   Analysis: Since a check is being written, 
 * BestBooks will automatically credit Cash. In this case the debit is split between two accounts. To 
 * reflect the $500 that has been applied to the loan balance, debit the loan account. (Since it is a 
 * liability account, a debit will reduce its balance, which is what you want.) The $40 interest paid is 
 * an expense, so debit the expense account called Loan Interest. Remember that even though the debit is 
 * split between two accounts, the total debit must always equal the total credit.
 *
 * Debit Loans Payable $500 (decreases its balance)
 *
 * Debit Interest Expense $40 (increases its balance)
 *
 * Credit Cash $540 (decreases its balance)
 */
if (!function_exists('bestbooks_loanpayment')) {
	add_action('bestbooks_loanpayment', 'bestbooks_loanpayment', 10, 4);

	function bestbooks_loanpayment($txdate, $description, $amount, $interest) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add('Loans Payable', 'Liability');
		$coa->add('Interest Expense', 'Expense');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, ($amount + $interest));

		$liability = new Liability('Loans Payable');
		$liability->decrease($txdate, $description, $amount);

		$expense = new Expense('Interest Expense');
		$expense->increase($txdate, $description, $interest);
	}
}

/**
 * Example 5: Company Writes a Check to Pay for an Asset
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company writes a check for $8,500 of equipment.   Analysis: Since a check was written, BestBooks 
 * will automatically credit Cash. The item is too costly to be considered an expense, so it must be 
 * entered into the accounting system as an asset. So we will debit an Asset account called Equipment or 
 * something similar. In addition, assets must be depreciated over time, with journal entries entered each 
 * year for a proscribed number of years. Depreciation is complicated, so be sure to see your accountant 
 * when purchasing company assets.
 *
 * Debit Equipment (increases its balance)
 *
 * Credit Cash (decreases its balance)
 *
 * [Remember: A debit adds a positive number and a credit adds a negative number. But you NEVER put a 
 * minus sign on a number you enter into the accounting software.] 
 */
if (!function_exists('bestbooks_payassetbycheck')) {
	add_action('bestbooks_payassetbycheck', 'bestbooks_payassetbycheck', 10, 4);

	function bestbooks_payassetbycheck($txdate, $description, $amount, $account) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add($account, 'Asset');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$asset = new Asset($account);
		$asset->increase($txdate, $description, $amount);
	}
}

if (!function_exists('bestbooks_payassetbycredit')) {
	add_action('bestbooks_payassetbycredit','bestbooks_payassetbycredit', 10, 4);

	function bestbooks_payassetbycredit($txdate, $description, $amount, $account) {
		$coa = new ChartOfAccounts();
		$coa->add($account, 'Asset');
		$coa->add('Accounts Payable', 'Liability');

		$expense = new Asset($account);
		$expense->increase($txdate, $description, $amount);

		$liability = new Liability('Accounts Payable');
		$liability->increase($txdate, $description, $amount);
	}
}

/**
 * Example 6.1: Company Pays Cash for Expenses
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company pays cash for $318 of office supplies.
 *
 * Debit Office (increases its balance)
 *
 * Credit Cash (decreases its balance)
 */
if (!function_exists('bestbooks_payexpensebycash')) {
	add_action('bestbooks_payexpensebycash', 'bestbooks_payexpensebycash', 10, 4);

	function bestbooks_payexpensebycash($txdate, $description, $amount, $account) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add($account, 'Expense');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$expense = new Expense($account);
		$expense->increase($txdate, $description, $amount);
	}
}

/**
 * Example 6.2: Company Writes Check to Pay for Expenses
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company writes a check to pay for $318 of office supplies.   Analysis: Since a check was written, 
 * BestBooks will automatically credit Cash. We debit the Expense account called Office.
 *
 * Debit Office (increases its balance)
 *
 * Credit Bank (decreases its balance)
 */
if (!function_exists('bestbooks_payexpensebycheck')) {
	add_action('bestbooks_payexpensebycheck', 'bestbooks_payexpensebycheck', 10, 4);

	function bestbooks_payexpensebycheck($txdate, $description, $amount, $account, $bank) {
		$coa = new ChartOfAccounts();
		$coa->add($bank, 'Bank');
		$coa->add($account, 'Expense');

		$bank = new Bank($bank);
		$bank->decrease($txdate, $description, $amount);

		$expense = new Expense($account);
		$expense->increase($txdate, $description, $amount);
	}
}

/**
 * Example 7: Company Uses Credit Card to Pay for Expenses
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company purchases $318 of office supplies and pays with a company credit card. Back in the office, 
 * the bill is entered into the accounting software.   Analysis: When you enter a bill, BestBooks will 
 * automatically credit the Liability account called Accounts Payable. And since you purchased office 
 * supplies, an expense account called Office (or similar) should receive the debit.
 *
 * Debit Office (increase its balance)
 *
 * Credit Accounts Payable (increases its balance)
 */
if (!function_exists('bestbooks_payexpensebycard')) {
	add_action('bestbooks_payexpensebycard', 'bestbooks_payexpensebycard', 10, 4);

	function bestbooks_payexpensebycard($txdate, $description, $amount, $account) {
		$coa = new ChartOfAccounts();
		$coa->add($account, 'Expense');
		$coa->add('Accounts Payable', 'Liability');

		$liability = new Liability('Accounts Payable');
		$liability->increase($txdate, $description, $amount);

		$expense = new Expense($account);
		$expense->increase($txdate, $description, $amount);
	}
}


/**
 * Example 8: Company Pays the Credit Card Bill
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * You pay the bill for the $318 of office supplies purchased in Example 7.   Analysis: When the bill was 
 * entered, an expense account called Office (or similar) was debited and Accounts Payable was credited. 
 * Now as we write a check to pay the bill, BestBooks will automatically credit Cash. And the accounting 
 * software will debit Accounts Payable - in effect, reversing the earlier credit.
 *
 * Debit Accounts Payable (decreases its balance)
 *
 * Credit Cash (decrease its balance)
 */
if (!function_exists('bestbooks_cardpayment')) {
	add_action('bestbooks_cardpayment', 'bestbooks_cardpayment', 10, 3);

	function bestbooks_cardpayment($txdate, $description, $amount, $asset='Cash') {
		$coa = new ChartOfAccounts();
		$coa->add($asset, 'Asset');
		$coa->add('Accounts Payable', 'Liability');

		$cash = new Asset($asset);
		$cash->decrease($txdate, $description, $amount);

		$liability = new Liability('Accounts Payable');
		$liability->decrease($txdate, $description, $amount);
	}
}

/**
 * Example 9: Company Pays Cash for a Cost of Good Sold (COGS)
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company pays $450 cash for Product A - a COGS part.   Analysis: When you write the check, 
 * BestBooks will automatically credit Cash. In the check window, choose the COGS account from the 
 * Expenses tab, or choose an Item from the Items tab that is associated with the COGS account. Either 
 * way, the COGS account receives the debit.
 *
 * Debit COGS (increase its balance)
 *
 * Credit Cash (decrease its balance)
 */
if (!function_exists('bestbooks_payment_cash')) {
	add_action('bestbooks_payment_cash', 'bestbooks_payment_cash', 10, 3);

	function bestbooks_payment_cash($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add('Cost of Goods Sold', 'Expense');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$cogs = new Expense('Cost of Goods Sold');
		$cogs->increase($txdate, $description, $amount);
	}
}

/**
 * Example 10: Company Receives Cash Payment for a Sale
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company sells Product A for $650 cash.   
 * Analysis: When you enter the cash sale, BestBooks will automatically debit Cash. 
 * You will have to choose an Item for the sale … it might be “Prod A income” and 
 * associated with the Sales account.
 *
 * Debit Cash (increases its balance)
 * 
 * Credit Sales (increases its balance)
 */
if (!function_exists('bestbooks_sales_cash')) {
	add_action('bestbooks_sales_cash', 'bestbooks_sales_cash', 10, 3);

	function bestbooks_sales_cash($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add("Sales", "Revenue");
		$coa->add("Cash", "Cash");

		$sales = new Revenue("Sales");
		$sales->increase($txdate, $description, $amount);

		$cash = new Cash("Cash");
		$cash->increase($txdate, $description, $amount);
	}
}

/**
 * Example 11: Company Makes a Credit Card Sale
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company sells Product A for $650 on credit.   Analysis: When you create an invoice, 
 * you must specify an Item for each separate charge on the invoice. BestBooks will 
 * automatically credit the revenue account(s) associated with these Items. And BestBooks 
 * will automatically debit the invoice amount to Accounts Receivable.
 *
 * Debit Accounts Receivable (increases the balance)
 *
 * Credit Sales (increases the balance)
 */
if (!function_exists('bestbooks_sales_card')) {
	add_action('bestbooks_sales_card', 'bestbooks_sales_card', 10, 3);

	function bestbooks_sales_card($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add("Sales", "Revenue");
		$coa->add("Account Receivable", "Asset");

		$sales = new Revenue("Sales");
		$sales->increase($txdate, $description, $amount);

		$ar = new Asset("Account Receivable");
		$ar->increase($txdate, $description, $amount);
	}
}

/**
 * Example 12: Company Receives Payment on an Invoice
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The Company receives a payment for the $650 invoice above.   Analysis: When you created the invoice, 
 * BestBooks debited the Accounts Receivable account. When you post the invoice payment, BestBooks will 
 * credit A/R - in effect reversing the earlier debit. The accounting software will also debit Cash - 
 * increasing its balance.
 *
 * Debit Cash (increases the balance)
 * 
 * Credit A/R (decreases the balance)
 */
if (!function_exists('bestbooks_accountreceivable_payment')) {
	add_action('bestbooks_accountreceivable_payment', 'bestbooks_accountreceivable_payment', 10, 3);

	function bestbooks_accountreceivable_payment($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add("Account Receivable", "Asset");

		$cash = new Cash('Cash');
		$cash->increase($txdate, $description, $amount);

		$ar = new Asset("Account Receivable");
		$ar->decrease($txdate, $description, $amount);

	}
}

/**
 * Example 13: Owner Takes Money Out of the Company - a Distribution
 * From: https://www.keynotesupport.com/accounting/accounting-transactions.shtml
 *
 * The owner’s writes himself a check for $1,000.   Analysis: Since a check was written, BestBooks will 
 * automatically credit Cash. The account you chose for the debit is an Equity account called Draw (Sole 
 * Proprietor) or Distribution (Corporation). Note: These are the only non-contra Equity accounts that are 
 * positive accounts and receive debits.
 *
 * Debit Owner’s Draw (increases its balance)
 *
 * Credit Cash (decrease its balance)
 */
if (!function_exists('bestbooks_distribution')) {
	add_action('bestbooks_distribution', 'bestbooks_distribution', 10, 3);

	function bestbooks_distribution($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add('Distribution', 'Equity');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$equity = new Equity('Distrbution');
		$equity->increase($txdate, $description, $amount);

	}
}

/**
 * Costs of Goods Sold
 * 
 * There are the following COGS categories in accordance with the GAAP.
 * 		
 * Debit COGS is an Expense (increases it's balance)
 * Credit Purchases is a Liability (decrease it's balance)
 * Credit Inventory is an Asset (increase or decrease based on the amount)
 */
 if (!function_exists('bestbooks_cogs')) {
	 add_action('bestbooks_cogs', 'bestbooks_cogs', 10, 6);
	 
	 function bestbooks_cogs($txdate, $description, $amount, $cogs='COGS',$purchase='Purchases',$inventory='Inventory') {
		$coa = new ChartOfAccounts();
		$coa->add($cogs, 'Expense');
		$coa->add($purchase, 'Liability');
		$coa->add($inventory, 'Asset');
		
		$expense = new Expense($cogs);
		$expense->increase($txdate, $description, $amount);
		
		$account_payable = new Liability($purchase);
		$account_payable->decrease($txdate, $description, $amount);
		
		$asset = new Asset($inventory);
		if ($amount < 0) {
			$asset->decrease($txdate, $description, $amount);
		} else {
			$asset->increase($txdate, $description, $amount);
		}
	 }
 }

/**
 * woocommerce_payment_successful_result filter
 *
 * update BestBooks after a successful payment through WooCommerce
 *
 * See: https://docs.woocommerce.com/wc-apidocs/source-class-WC_Checkout.html#808
 *      https://docs.woocommerce.com/wc-apidocs/class-WC_Order.html
 */
if (!function_exists('bestbooks_woocommerce_payment_successful_result')) {
	add_filter('woocommerce_payment_successful_result', 'bestbooks_woocommerce_payment_successful_result', 10, 2 );

	function bestbooks_woocommerce_payment_successful_result($result, $order_id) {
		// https://docs.woocommerce.com/wc-apidocs/class-WC_Order.html
		if (class_exists('WC_Order')) {
			$order = new WC_Order( $order_id );
			$txdate = $order->get_date_completed()->__toString();
			$description = "WooCommerce Order #$order_id at ".$order->get_view_order_url();
			$amount = $order->get_formatted_order_total();
	
			bestbooks_sales_card($txdate, $description, $amount);	
		}

		return $result;
	}
}

/**
 * Example 17: Unearned Revenue
 * Is income received but not yet earned, e.g. deposits taken on a job not yet performed.
 * Unearned income is applicable for Service Income, while Product Income is regular income
 * 
 * https://www.wallstreetmojo.com/unearned-revenue-journal-entries/
 * 
 * https://www.accountingverse.com/accounting-basics/unearned-revenue.html 
 * 
 * Cash asset account is debited for amount (balance is decreasing)
 * Unearned Revenue liability account is credited for amount (balance is increasing)
 * 
 */
if (!function_exists('bestbooks_unearned_revenue')) {
	add_action('bestbooks_unearned_revenue','bestbooks_unearned_revenue',10,3);

	function bestbooks_unearned_revenue($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash','Asset');
		$coa->add('Unearned Revenue','Revenue');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$unearned_revenue = new Revenue('Unearned Revenue');
		$unearned_revenue->increase($txdate, $description, $amount);
	}
}

/**
 * Example 18: Accounting for Bad Debt
 * If a company sells on credit, customers will occasionally be unable to pay, 
 * in which case the seller should charge the account receivable to expense as a bad debt
 * 
 * https://www.accountingtools.com/articles/2017/5/17/accounts-receivable-accounting
 * 
 * Bad Debt expense account debited 
 * Account Receivable is credited
 */
if (!function_exists('bestbooks_baddebt')) {
	add_action('bestbooks_baddebt','bestbooks_baddebt',10,3);

	function bestbooks_baddebt($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Bad Debt','Expense');
		$coa->add('Account Receivable','Asset');

		$bad_debt = new Expense('Bad Debt');
		$bad_debt->increase($txdate, $description, $amount);

		$account_receivable = new Asset('Account Receivable');
		$account_receivable->decrease($txdate, $description, $amount);
	}
}

/**
 * Example 19: Accrued Income
 * When a company has earned income but has not received the monies, that are NOT from Sales
 * 
 * https://accounting-simplified.com/financial/accrual-accounting/accrued-income
 * 
 * Income Receivable is debited (increases the balance)
 * Income account is credited (increases the balance)
 */
if (!function_exists('bestbooks_accruedincome')) {
    add_action('bestbooks_accruedincome','bestbooks_accruedincome', 10, 3);

	function bestbooks_accruedincome($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add("Income Receivable", "Asset");
		$coa->add("Income", "Revenue");

		$income = new Income("Income");
		$income->increase($txdate, $description, $amount);

		$ir = new Asset("Income Receivable");
		$ir->increase($txdate, $description, $amount);
	}
}

/**
 * Example 19.1: Receipt of Payment on Accrued Income
 * When payment is due, and the customer makes the payment, an accountant for that company would record an adjustment to accrued revenue. 
 * The accountant would make an adjusting journal entry in which the amount of cash received by the customer 
 * would be debited to the cash account on the balance sheet, 
 * and the same amount of cash received would be credited to the accrued revenue account or accounts receivable account, reducing that account.
 * 
 * Cash Account is debited (increases the balance)
 * Income Receivable is credited (decreases the balamce)
 */
if (!function_exists('bestbooks_accruedincome_payment')) {
    add_action('bestbooks_accruedincome_payment','bestbooks_accruedincome_payment', 10, 3);

	function bestbooks_accruedincome_payment($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add("Income Receivable", "Asset");
		$coa->add("Cash","Asset");

		$ir = new Asset("Income Receivable");
		$ir->decrease($txdate, $description, $amount);

		$cash = new Asset("Cash");
		$cash->increase($txdate, $description, $amount);
	}
}

/**
 * Expense Bill Entry
 * 
 * https://www.double-entry-bookkeeping.com/accounts-payable/utilities-bill/
 */
if (!function_exists('bestbooks_expense')) {
	function bestbooks_expense($txdate, $description, $amount, $account) {
		$post_ids = array();

		$coa = new ChartOfAccounts();
		$coa->add($account, "Expense");
		$coa->add('Accounts Payable', 'Liability');

		$expense_account = new Expense($account);
		$post_ids[0] = $expense_account->addDebit($txdate, $description, $amount);

		$liability_account = new Liability('Accounts Payable');
		$post_ids[1] = $liability_account->addCredit($txdate, $description, $amount);

		return $post_ids;
	}
}

/**
 * https://www.investopedia.com/ask/answers/031015/whats-difference-between-accrued-expenses-and-accounts-payable.asp 
 */
if (!function_exists('bestbooks_pay_expense_by_bank')) {
	function bestbooks_pay_expense($txdate, $description, $amount, $bank) {
		$coa = new ChartOfAccounts();
		$coa->add($bank, "Bank");
		$coa->add('Accounts Payable', 'Liability');

		// Decrease the asset payment account
		$asset_account = new Bank($bank);
		$asset_account->decrease($txdate, $description, $amount);

		// Decrease the accounts payable
		$liability_account = new Liability('Accounts Payable');
		$liability_account->decrease($txdate, $description, $amount);
	}
}

/**
 * Example 20: Accrued Expense
 * When a company has an expense but has not paid, and recorded as an adjusting entry
 * 
 * https://www.accountingtools.com/articles/what-are-accrued-expenses.html
 * 
 * Expense account is debited (balance is increasing)
 * Payable account is credited (balance is increasing)
 */
if (!function_exists('bestbooks_accruedexpense')) {
    add_action('bestbooks_accruedexpense','bestbooks_accruedexpense', 10, 5);

	function bestbooks_accruedexpense($expense,$payable,$txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add($expense, "Expense");
		$coa->add($payable, "Liability");

		$expense_account = new Expense($expense);
		$expense_account->increase($txdate, $description, $amount);

		$payable_account = new Liability($payable);
		$payable_account->increase($txdate, $description, $amount);
	}
}

/**
 * Prepaid Expense
 * 
 * https://www.accountingtools.com/articles/2017/5/14/prepaid-expense 
 */
if (!function_exists('bestbooks_prepaidexpense')) {
	function bestbooks_prepaidexpense($txdate, $description, $amount, $account) {
		$coa = new ChartOfAccounts();
		$coa->add($account, "Expense");
		$coa->add("Prepaid Expense", "Asset");

		$expense_account = new Expense($account);
		$expense_account->decrease($txdate, $description, $amount);

		$prepaid_expense_account = new Asset("Prepaid Expense");
		$prepaid_expense_account->increase($txdate, $description, $amount);
	}
}

/**
 * Example 21: Closing Entries/Account
 * See https://www.accountingtools.com/articles/2017/5/17/closing-entries-closing-procedure
 * 
 * Closing entries are journal entries used to empty temporary accounts at the end of a 
 * reporting period and transfer their balances into permanent accounts. 
 * The use of closing entries resets the temporary accounts to begin accumulating new transactions in the next period. 
 * Otherwise, the balances in these accounts would be incorrectly included in the totals for the following reporting period. 
 * The basic sequence of closing entries is:
 * 
 * 1. Debit all revenue accounts and credit the income summary account, thereby clearing out the balances in the revenue accounts.
 * 2. Credit all expense accounts and debit the income summary account, thereby clearing out the balances in all expense accounts.
 * 3. Close the income summary account to the retained earnings account. 
 * 		If there was a profit in the period, then this entry is a debit to the income summary account and a credit to the retained earnings account. 
 * 		If there was a loss in the period, then this entry is a credit to the income summary account and a debit to the retained earnings account.
 * 
 * The net result of these activities is to move the net profit or net loss for the period into the retained earnings account, 
 * which appears in the stockholders' equity section of the balance sheet.
 * 
 * Since the income summary account is only a transitional account, it is also acceptable to close directly to the retained earnings account and 
 * bypass the income summary account entirely.
 * 
 * Income Summary Account - https://www.accountingtools.com/articles/what-is-the-income-summary-account.html
 * 
 * Retained Earnings (Equity Account) - Beginning retained earnings + Profits/losses - Dividends = Ending retained earnings
 * See more https://www.accountingtools.com/articles/what-are-retained-earnings.html
 * 
 * Retained Earnings: 
 * This account tracks the profits or losses accumulated since a business was opened. At the end of each year, 
 * the profit or loss calculated on the income statement is used to adjust the value of this account. 
 * For example, if a company made a $100,000 profit in the past year, the Retained Earnings account would be increased by that amount; 
 * if the company lost $100,000, then that amount would be subtracted from this account.
 *  
 */
if (!function_exists('bestbooks_initiate_periodic_closing')) {
    add_action('bestbooks_initiate_periodic_closing','bestbooks_initiate_periodic_closing', 10, 2);
    
	function bestbooks_initiate_periodic_closing($start_date, $end_date) {

		try {
			$coa = new ChartOfAccounts();
			$coa->add("Retained Earnings", "Equity");

			$retained_earnings = new Equity("Retained Earnings");
			$income_summary = new Journal("Income Summary");

			$revenue_accounts = array();
			$expense_accounts = array();
			$total_expense = 0;
			$total_revenue = 0;

			foreach($coa->account as $account => $type) {
				if ($type === "Revenue") {
					array_push($revenue_accounts, $account);
				} elseif ($type === "Expense") {
					array_push($expense_accounts, $account);
				}
			}

			foreach($revenue_accounts as $account) {
				$ledger = new Ledger($account, "Revenue");
				$transactions = $ledger->get_transactions_by_range($start_date,$end_date);
				foreach($transactions as $transaction) {
					$income_summary->add($transaction->date,$transaction->ref,$account,0.00,$transaction->credit);
				}
			}

			foreach($expense_accounts as $account) {
				$ledger = new Ledger($account,"Expense");
				$transactions = $ledger->get_transactions_by_range($start_date,$end_date);
				foreach($transactions as $transaction) {
					$income_summary->add($transaction->date,$transaction->ref,$account,$transaction->debit,0.00);
				}
			}

			return $income_summary->inBalance();
		} catch(Exception $ex) {
			return $ex;
		}
	}
}

/**
 * Example 22: Sales Tax Entry
 * See https://www.accountingtools.com/articles/2017/5/15/accounting-for-sales-taxes
 */
if (!function_exists('bestbooks_sales_with_tax')) {
	function bestbooks_sales_with_tax($txdate, $description, $amount, $tax_amount, $tax_jurisdiction) {
		$coa = new ChartOfAccounts();
		$coa->add("Sales", "Revenue");
		$coa->add("Account Receivable", "Asset");
		$coa->add('Sales Tax Liability', 'Liability');

		$sales = new Revenue("Sales");
		$sales->increase($txdate, $description, $amount-$tax_amount);

		$ar = new Asset("Account Receivable");
		$ar->increase($txdate, $description, $amount);

		$sales_tax_liability = new Liability('Sales Tax Liability');
		if (!empty($tax_jurisdiction)) {
			$sales_tax_liability->increase($txdate, $tax_jurisdiction, $tax_amount);
		}
	}
}

if (!function_exists('bestbooks_sales_tax_payment')) {
	function bestbooks_sales_tax_payment($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add('Cash', 'Cash');
		$coa->add('Sales Tax Liability', 'Liability');

		$cash = new Cash('Cash');
		$sales_tax_liability = new Liability('Sales Tax Liability');

		$cash->decrease($txdate, $description, $amount);
		$sales_tax_liability->decrease($txdate, $description, $amount);
	}
}
?>