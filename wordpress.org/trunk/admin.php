<?php
/**
 * Administration
 */
require('admin/dashboard.php');
require('admin/sales.php');
require('admin/purchases.php');
require('admin/inventory.php');
require('admin/accounting.php');
require('admin/banking.php');
require('admin/banking_transactions.php');
require('admin/payroll.php');
require('admin/reports.php');
require('admin/auditing.php');
require('admin/settings.php');
require('admin/help.php');

if (!function_exists('bestbooks_dashboard')) {
	function bestbooks_dashboard() {
		$active_company_id = bestbooks_get_active_company();
		$bestbooks_company_profit_nonprofit = get_user_meta($active_company_id,'profitnon-profit',true); // get_option('bestbooks_company_profit_nonprofit');
		$bestbooks_company_tax_exempt = get_user_meta($active_company_id,'tax_exempt',true); // get_option('bestbooks_company_tax_exempt');
		if (isset($bestbooks_company_tax_exempt)) {
			$bestbooks_company_tax_exempt = true;
		} else {
			$bestbooks_company_tax_exempt = false;
		}

		add_menu_page("BestBooks&reg;&trade;", "BestBooks&reg;&trade;", "manage_options", 'bestbooks', 'bestbooks_dashboard_page', 'dashicons-portfolio', 2 );
	
		/* Sales */
		add_submenu_page( 'bestbooks', 'Sales', 'Sales', 'manage_options', 'bestbooks_sales', 'bestbooks_dashboard_sales' ); 
		add_submenu_page( 'bestbooks_sales', 'Estimates', 'Estimates', 'manage_options', 'bestbooks_sales_estimates', 'bestbooks_dashboard_sales_estimates');
		add_submenu_page( 'bestbooks_sales', 'Invoices', 'Invoices', 'manage_options', 'bestbooks_sales_invoices', 'bestbooks_dashboard_sales_invoices');
		add_submenu_page( 'bestbooks_sales', 'Recurring Invoices', 'Recurring Invoices', 'manage_options', 'bestbooks_sales_recurringinvoices', 'bestbooks_dashboard_sales_recurringinvoices');
		add_submenu_page( 'bestbooks_sales', 'Payments', 'Payments', 'manage_options', 'bestbooks_sales_payments', 'bestbooks_dashboard_sales_payments');
		add_submenu_page( 'bestbooks_sales', 'Customer Statements', 'Customer Statements', 'manage_options', 'bestbooks_sales_customerstatements', 'bestbooks_dashboard_sales_customerstatements');
		add_submenu_page( 'bestbooks_sales', 'Customers', 'Customers', 'manage_options', 'bestbooks_sales_customers', 'bestbooks_dashboard_sales_customers');
		add_submenu_page( 'bestbooks_sales', 'Products &amp; Services', 'Products &amp; Services', 'manage_options', 'bestbooks_sales_productsnservices', 'bestbooks_dashboard_sales_productsnservices');
		add_submenu_page( 'bestbooks_sales', 'Invoice Payment Terms', 'Invoice Payment Terms', 'manage_options', 'bestbooks_sales_invoiceterms', 'bestbooks_dashboard_sales_invoicepaymentterms');
		add_submenu_page( 'bestbooks_sales', 'Sales Tax Jurisdictions', 'Sales Tax Jurisdictions', 'manage_options', 'bestbooks_sales_taxjurisdictions', 'bestbooks_dashboard_sales_taxjurisdictions');

		/* Purchases */
		add_submenu_page( 'bestbooks', 'Purchases', 'Purchases', 'manage_options', 'bestbooks_purchases', 'bestbooks_dashboard_purchases' ); 
		add_submenu_page( 'bestbooks_purchases', 'Purchase Order', 'Purchase Order', 'manage_options', 'bestbooks_purchases_order', 'bestbooks_dashboard_purchases_order');
		add_submenu_page( 'bestbooks_purchases', 'Bills', 'Bills', 'manage_options', 'bestbooks_purchases_bills', 'bestbooks_dashboard_purchases_bills');
		add_submenu_page( 'bestbooks_purchases', 'Receipts', 'Receipts', 'manage_options', 'bestbooks_purchases_receipts', 'bestbooks_dashboard_purchases_receipts');
		add_submenu_page( 'bestbooks_purchases', 'Vendors', 'Vendors', 'manage_options', 'bestbooks_purchases_vendors', 'bestbooks_dashboard_purchases_vendors');
		add_submenu_page( 'bestbooks_purchases', 'Products &amp; Services', 'Products &amp; Services', 'manage_options', 'bestbooks_purchases_productsnservices', 'bestbooks_dashboard_purchases_productsnservices');
		add_submenu_page( 'bestbooks_purchases', 'Payment Terms', 'Payment Terms', 'manage_options', 'bestbooks_purchases_paymentterms', 'bestbooks_dashboard_purchases_paymentterms');
	
		/* Inventory */
		add_submenu_page( 'bestbooks', 'Inventory', 'Inventory', 'manage_options', 'bestbooks_inventory', 'bestbooks_dashboard_inventory' ); 
		add_submenu_page( 'bestbooks_inventory', 'Sales Products', 'Sales Products', 'manage_options', 'bestbooks_inventory_sales_products', 'bestbooks_inventory_sales_products' ); 
		add_submenu_page( 'bestbooks_inventory', 'Sales Services', 'Sales Services', 'manage_options', 'bestbooks_inventory_sales_services', 'bestbooks_inventory_sales_services' ); 
		add_submenu_page( 'bestbooks_inventory', 'Purchase Products', 'Purchase Products', 'manage_options', 'bestbooks_inventory_purchase_products', 'bestbooks_inventory_purchase_products' ); 
		add_submenu_page( 'bestbooks_inventory', 'Purchase Services', 'Purchase Services', 'manage_options', 'bestbooks_inventory_purchase_services', 'bestbooks_inventory_purchase_services' ); 
		add_submenu_page( 'bestbooks_inventory', 'Capital Assets', 'Capital Assets', 'manage_options', 'bestbooks_inventory_capital_assets', 'bestbooks_inventory_capital_assets' ); 
	
		/* Accounting */
		add_submenu_page( 'bestbooks', 'Accounting', 'Accounting', 'manage_options', 'bestbooks_accounting', 'bestbooks_dashboard_accounting' ); 
		add_submenu_page( 'bestbooks_accounting', 'Transactions', 'Transactions', 'manage_options', 'bestbooks_accounting_transactions', 'bestbooks_dashboard_accounting_transactions');
		add_submenu_page( 'bestbooks_accounting', 'Chart of Accounts', 'Chart of Accounts', 'manage_options', 'bestbooks_accounting_chartofaccounts', 'bestbooks_dashboard_accounting_chartofaccounts');
		add_submenu_page( 'bestbooks_accounting', 'Journal Transactions', 'Journal Transactions', 'manage_options', 'bestbooks_accounting_journaltransactions', 'bestbooks_dashboard_accounting_journaltransactions');
		add_submenu_page( 'bestbooks_accounting', 'Starting Balances', 'Starrting Balances', 'manage_options', 'bestbooks_accounting_startingbalances', 'bestbooks_dashboard_accounting_startingbalances');
	
		/* Banking */
		add_submenu_page( 'bestbooks', 'Banking', 'Banking', 'manage_options', 'bestbooks_banking', 'bestbooks_dashboard_banking' ); 
		add_submenu_page( 'bestbooks_banking', 'Banking Transactions', 'Banking Transactions', 'manage_options', 'bestbooks_banking_transactions', 'bestbooks_dashboard_banking_transactions');
	
		/* Payroll */
		add_submenu_page( 'bestbooks', 'Payroll', 'Payroll', 'manage_options', 'bestbooks_payroll', 'bestbooks_dashboard_payroll' );
	
		/* Reports */ 
		add_submenu_page( 'bestbooks', 'Reports', 'Reports', 'manage_options', 'bestbooks_reports', 'bestbooks_dashboard_reports' ); 
		add_submenu_page( 'bestbooks_reports', 'Bakance Sheet', 'Balance Sheet', 'manage_options', 'bestbooks_reports_balancesheet', 'bestbooks_dashboard_reports_balancesheet');
		add_submenu_page( 'bestbooks_reports', 'Income Statement', 'Income Statement', 'manage_options', 'bestbooks_reports_incomestatement', 'bestbooks_dashboard_reports_incomestatement');
		add_submenu_page( 'bestbooks_reports', 'Sales Tax Report', 'Sales Tax Report', 'manage_options', 'bestbooks_reports_salestaxreport', 'bestbooks_dashboard_reports_salestaxreport');
		add_submenu_page( 'bestbooks_reports', 'Payroll Wage &amp; Tax Report', 'Payroll Wage &amp; Tax Report', 'manage_options', 'bestbooks_reports_payrollwagetaxreport', 'bestbooks_dashboard_reports_payrollwagetaxreport');
		add_submenu_page( 'bestbooks_reports', 'Income by Customer', 'Income by Customer', 'manage_options', 'bestbooks_reports_incomebycustomer', 'bestbooks_dashboard_reports_incomebycustomer');
		add_submenu_page( 'bestbooks_reports', 'Aged Receivables', 'Aged Receivables', 'manage_options', 'bestbooks_reports_agedreceivables', 'bestbooks_dashboard_reports_agedreceivables');
		add_submenu_page( 'bestbooks_reports', 'Expense by Vendor', 'Expense by Vendor', 'manage_options', 'bestbooks_reports_expensebyvendor', 'bestbooks_dashboard_reports_expensebyvendor');
		add_submenu_page( 'bestbooks_reports', 'Aged Payables', 'Aged Payables', 'manage_options', 'bestbooks_reports_agedpayables', 'bestbooks_dashboard_reports_agedpayables');
		add_submenu_page( 'bestbooks_reports', 'General Ledger', 'General Ledger', 'manage_options', 'bestbooks_reports_general_ledger', 'bestbooks_dashboard_reports_general_ledger');
		add_submenu_page( 'bestbooks_reports', 'Account Transactions', 'Account Transactions', 'manage_options', 'bestbooks_reports_account_transactions', 'bestbooks_dashboard_reports_account_transactions');
		add_submenu_page( 'bestbooks_reports', 'Trial Balance', 'Trial Balance', 'manage_options', 'bestbooks_reports_trialbalance', 'bestbooks_dashboard_reports_trialbalance');
		add_submenu_page( 'bestbooks_reports', 'Gain/Loss on foreign Currency Exchange', 'Gain/Loss on foreign Currency Exchange', 'manage_options', 'bestbooks_reports_gainlossonforeigncurrencyexchange', 'bestbooks_dashboard_reports_gainlossonforeigncurrencyexchange');
	
		/* Auditing */
		add_submenu_page( 'bestbooks', 'Auditing', 'Auditing', 'manage_options', 'bestbooks_auditing', 'bestbooks_dashboard_auditing');

		/* Settings */
		add_submenu_page( 'bestbooks', 'Settings', 'Settings', 'manage_options', 'bestbooks_settings', 'bestbooks_dashboard_settings');
	
		/* Help */
		add_submenu_page( 'bestbooks', 'Help', 'Help', 'manage_options', 'bestbooks_assistance', 'bestbooks_dashboard_help');
	}
}
?>