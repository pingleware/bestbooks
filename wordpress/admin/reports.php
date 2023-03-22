<?php
function bestbooks_dashboard_reports() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - Reports</h2>
		<fieldset>
			<legend>Financial Statements</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_balancesheet'); ?>" class="primary_button button w3-button w3-block w3-blue">Balance Sheet</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_incomestatement'); ?>" class="primary_button button w3-button w3-block w3-blue">Income Statement</a>
		</fieldset>
		<fieldset>
			<legend>Taxes</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_salestaxreport'); ?>" class="primary_button button w3-button w3-block w3-blue">Sales Tax Report</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_payrollwagetaxreport'); ?>" class="primary_button button w3-button w3-block w3-blue">Payroll Wage &amp; Tax Report</a>
		</fieldset>
		<fieldset>
			<legend>Customers</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_incomebycustomer'); ?>" class="primary_button button w3-button w3-block w3-blue">Income by Customer</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_agedreceivables'); ?>" class="primary_button button w3-button w3-block w3-blue">Aged Receivables</a>
		</fieldset>
		<fieldset>
			<legend>Vendors</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_expensebyvendor'); ?>" class="primary_button button w3-button w3-block w3-blue">Expense by Vendor</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_agedpayables'); ?>" class="primary_button button w3-button w3-block w3-blue">Aged Payables</a>
		</fieldset>
		<fieldset>
			<legend>Other</legend>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_general_ledger'); ?>" class="primary_button button w3-button w3-block w3-blue">General Ledger</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_account_transactions'); ?>" class="primary_button button w3-button w3-block w3-blue">Account Transactions</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_trialbalance'); ?>" class="primary_button button w3-button w3-block w3-blue">Trial Balance</a><br/>
			<a href="<?php echo admin_url('admin.php?page=bestbooks_reports_gainlossonforeigncurrencyexchange'); ?>" class="primary_button button w3-button w3-block w3-blue">Gain/Loss on Foreign Currency Exchange</a>
		</fieldset>
		<!--
		<fieldset>
			<legend>Public Reporting</legend>
			<a href="<?php //echo admin_url('admin.php?page=bestbooks_reports_sec_findisclosure'); ?>" class="primary_button button w3-button w3-block w3-blue">SEC.GOV Financial Disclosure</a>
			<a href="<?php //echo admin_url('admin.php?page=bestbooks_reports_sec_forms11'); ?>" class="primary_button button w3-button w3-block w3-blue">SEC.GOV Form S-11</a>
		</fieldset>
		-->
	</div>
	<?php	
}

function bestbooks_dashboard_reports_balancesheet() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Balance Sheet</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_incomestatement() {
    $coa = new ChartOfAccounts();
    $accounts = $coa->getList();
    $income_accounts = array();
    $expense_accounts = array();
    $total_income = 0.0;
    $total_expense = 0.0;
    foreach ($accounts as $name => $type) {
        if ($type === "Revenue") {
            $income = new Ledger($name, $type);
            $balance = $income->getBalance();
            $income_accounts[$type][] = array(
                'name' => $name,
                'type' => $type,
                'balance' => $balance
            );
            $total_income += $balance;
        } elseif ($type === "Expense") {
            $expense = new Ledger($name, $type);
            $balance = $expense->getBalance();
            $expense_accounts[$type][] = array(
                'name' => $name,
                'type' => $type,
                'balance' => $balance
            );
            $total_expense += $balance;
        }
    }
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Income Statement</h2>
        <table>
            <th colspan="2">Account</th><th>Debit</th><th>Credit</th>
            <?php foreach ($income_accounts as $type => $accounts) : ?>
                <tr><td colspan="4"><b><?php echo $type; ?></b></td></tr>
                <?php foreach ($accounts as $account) : ?>
                    <tr>
                        <td></td>
                        <td><?php echo $account['name']; ?></td>
                        <td></td>
                        <td><?php echo $account['balance']; ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endforeach; ?>
            <?php foreach ($expense_accounts as $type => $accounts) : ?>
                <tr><td colspan="4"><b><?php echo $type; ?></b></td></tr>
                <?php foreach ($accounts as $account) : ?>
                    <tr>
                        <td></td>
                        <td><?php echo $account['name']; ?></td>
                        <td><?php echo $account['balance']; ?></td>
                        <td></td>
                    </tr>
                <?php endforeach; ?>
            <?php endforeach; ?>
            <tr>
                <td></td>
                <td align="right">Total:</td>
                <td><?php echo $total_expense; ?></td>
                <td><?php echo $total_income; ?></td>
            </tr>
        </table>
	</div>
	<?php
}

function bestbooks_dashboard_reports_salestaxreport() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Sales Tax Report</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_payrollwagetaxreport() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Payroll Wage &amp; Tax Report</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_incomebycustomer() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Income by Customer</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_agedreceivables() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Aged Receivables</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_expensebyvendor() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Expense by Vendor</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_agedpayables() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Aged Payables</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_general_ledger() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - General Ledger</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_account_transactions() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Account Transactions</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}

function bestbooks_dashboard_reports_trialbalance() {
    $coa = new ChartOfAccounts();
    $accounts = $coa->getList();
    $total_debit = 0.0;
    $total_credit = 0.0;
    $tb_account = array();
    foreach ($accounts as $name => $type) {
        if ($type === "Revenue" || $type === "Cash") {
            $income = new Ledger($name, $type);
            $balance = $income->getBalance();
            $tb_accounts[$type][] = array(
                'name' => $name,
                'type' => $type,
                'debit' => $balance,
                'credit' => 0
            );
            $total_debit += $balance;
        } elseif ($type === "Expense" || $type === "Liability" || $type === "Asset") {
            $expense = new Ledger($name, $type);
            $balance = $expense->getBalance();
            $tb_accounts[$type][] = array(
                'name' => $name,
                'type' => $type,
                'debit' => 0,
                'credit' => $balance
            );
            $total_credit += $balance;
        }
    }
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Trial Balance</h2>
        <table>
            <th>Account</th><th>Debit</th><th>Credit</th>
            
            <tr>
                <td align="right">Total</td>
                <td align="right"><?php echo $total_debit; ?></td>
                <td align="right"><?php echo $total_credit; ?></td>
            </tr>
        </table>
        <pre><?php print_r($tb_accounts); ?></pre>
	</div>
	<?php
}

function bestbooks_dashboard_reports_gainlossonforeigncurrencyexchange() {
	?>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_reports'); ?>">Reports</a> - Gain/Loss on Foreign Currency Exchange</h2>
		<center>
			<img src="<?php echo plugin_dir_url(__FILE__); ?>/../../images/coming-soon.png" />
		</center>
	</div>
	<?php
}
?>