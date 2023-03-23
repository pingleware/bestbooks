<?php
// hooks-nonprofit.php 

/**
 * See more at https://www.accountingtools.com/articles/nonprofit-accounting.html
 */

/**
 * Non-profit Chart of Accounts
 */
if (!function_exists('bestbooks_nonprofit_chartofaccounts')) {
    add_action('bestbooks_nonprofit_chartofaccounts','bestbooks_nonprofit_chartofaccounts',10,0);

    function bestbooks_nonprofit_chartofaccounts() {
        // Statement of Financial Position
        $accounts = array(
            array(
                'financial_position' => array(
                    'Checking' => 'Bank',
                    'Savngs' => 'Bank',
                    'Investments' => '',
                    'Accounts Receivable' => '',
                    'Inventory' => '',
                    'Prepaid Expenses' => '',
                    'Property' => '',
                    'Equipment' => '',
                    'Accumulated Depreciation' => '',
                    'Accumulated Amortization' => '',
                    'Accounts Payable' => '',
                    'Accrued Salaries' => '',
                    'Accrued Payroll Taxes' => '',
                    'Accrued Employee Benefits' => '',
                    'Accrued Property Taxes' => '',
                    'Deferred Revenue' => '',
                    'Credit Card Payable' => '',
                    'Unrestricted Net Assets' => 'Equity',
                    'Temporarily Restricted Net Assets' => 'Equity',
                    'Permanently Restricted Net Assets' => 'Equity'            
                )
            ),
            array(
                'revenue' => array(
                    'Donations and Grants – Individuals' => '',
                    'Donations and Grants – Government' => '',
                    'Donations and Grants – Foundations' => '',
                    'Special Events – Sponsorships' => '',
                    'Special Events – Auction' => '',
                    'Special Events – Ticket Sales' => '',
                    'Program Revenue' => '',
                    'Sales of Merchandise' => '',
                    'Membership Dues' => '',
                    'In-Kind Contributions' => '',
                    'Temporarily Restricted Income' => '',
                    'Permanently Restricted Income' => '',
                    'Interest Income' => '',
                    'Dividend Income' => ''
                )
            ),
            array(
                'expenses' => array(
                    'Salaries and Wages' => '',
                    'Payroll Taxes' => '',
                    'Health Insurance' => '',
                    'Dental Insurance' => '',
                    'Retirement Benefits' => '',
                    'Workers Compensation' => '',
                    'HSA Contributions' => '',
                    'Depreciation Expense' => '',
                    'Amortization Expense' => '',
                    'Cost of Goods Sold' => '',
                    'Fundraising Expenses' => '',
                    'Special Event Expenses' => '',
                    'Program Expenses' => '',
                    'Marketing and Branding' => '',
                    'Advertising' => '',
                    'Contract Services' => '',
                    'Accounting Services' => '',
                    'Legal Services' => '',
                    'Rent Expense' => '',
                    'Utilities' => '',
                    'Telecommunications' => '',
                    'Maintenance and Repairs' => '',
                    'Office Supplies' => '',
                    'Printing and Copying' => '',
                    'Postage and Shipping' => '',
                    'Licenses and Permits' => '',
                    'Bank Fees' => '',
                    'Merchant Service Fees' => '',
                    'Board Expenses' => '',
                    'D&O Insurance' => '',
                    'Miscellaneous Expenses' => ''
                )
            )
        );

        $coa = new ChartOfAccounts();

        foreach ($accounts as $account_types) {
            foreach($account_types as $name => $type) {
                $coa->add($name, $type);
            }
        }
    }
}

/**
 * Net Assets
 * 
 * Net assets take the place of equity in the balance sheet, since there are no investors to take an equity position in a nonprofit.
 */ 
if (!function_exists('bestbooks_nonprofit_net_assets')) {
    add_action('bestbooks_nonprofit_net_assets', 'bestbooks_nonprofit_net_assets', 10, 3);

    /**
     * Useful recording anonymous donations, like a cash jar, etc.
     * 
     * @param txdate Date of receipt of cash donation
     * @param description Description of donation, donation is unrestrictive
     * @param amount Amount of the cash donation
     */
    function bestbooks_nonprofit_net_assets($txdate, $description, $amount) {
        bestbooks_nonprofit_fundraising($txdate, $description, 0, 0, $amount, 'Anonymous');
    }
}

/**
 * Donor Restrictions
 * 
 * Net assets are classified as being either with donor restrictions or without donor restrictions. 
 * Assets with donor restrictions can only be used in certain ways, frequently being assigned only to specific programs. 
 * Assets without donor restrictions can be used for any purpose.
 */
if (!function_exists('bestbooks_nonprofit_donor_restrictions')) {
    add_action('bestbooks_nonprofit_cashdonor','bestbooks_nonprofit_donor_restrictions',10,5);

    /**
     * @param txdate Date of receipt of cash donation
     * @param description Description of donation incuding restriction explanation
     * @param permanent If the restrictive donation is permanent, default temporary=0
     * @param amount The amount of the cash donation
     * @param donor_type Donor type: Individual, Corporate, Government, Foundation
     */
    function bestbooks_nonprofit_donor_restrictions($txdate, $description, $permanent=0, $amount, $donor_type) {
        bestbooks_nonprofit_fundraising($txdate, $description, 1, $permanent, $amount, $donor_type);
    }
}

/**
 * Programs
 * 
 * A nonprofit exists in order to provide some kind of service, which is called a program. 
 * A nonprofit may operate a number of different programs, each of which is accounted for separately. 
 * By doing so, one can view the revenues and expenses associated with each program.
 */
if (!function_exists('bestbooks_nonprofit_program_revenue')) {
    add_action('bestbooks_nonprofit_program_revenue','bestbooks_nonprofit_program_revenue',10,3);

    function bestbooks_nonprofit_program_revenue($txdate, $description, $amount) {
		$coa = new ChartOfAccounts();
		$coa->add("Program Revenue", "Revenue");
		$coa->add("Cash", "Cash");

		$sales = new Revenue("Program Revenue");
		$sales->increase($txdate, $description, $amount);

		$cash = new Cash("Cash");
		$cash->increase($txdate, $description, $amount);
    }
}

/**
 * Management and Administration
 * 
 * Costs may be assigned to the management and administration classification, which refers to the general overhead structure of a nonprofit. 
 * Donors want this figure to be as low as possible, which implies that the bulk of their contributions are going straight to programs.
 */

/**
 * Fund Raising
 * 
 * Costs may be assigned to the fund raising classification, which refers to the sales and marketing activities of a nonprofit, such as solicitations, 
 * fund raising events, and writing grant proposals.
 */
if (!function_exists('bestbooks_nonprofit_fundraising')) {
    add_action('bestbooks_nonprofit_fundraising','bestbooks_nonprofit_fundraising',10,6);

    /**
     * @param txdate Date of receipt of cash donation
     * @param description Description of donation including whether the donation is restricted
     * @param restrictive Whether donation is restrictive, default is unrestricted=0
     * @param permanent Whether the restrictive donation is permanent, default is temporary=0
     * @param amount Amount of the cash donation
     * @param donor_type Donor type: Individual, Corporate, Government, Foundation, or a more descriptive donor/program type
     */
    function bestbooks_nonprofit_fundraising($txdate, $description, $restrictive=0, $permanent=0, $amount, $donor_type) {
        $net_assets = 'Unrestrictive Net Assets';
        if ($restrictive == 1) {
            $net_assets = 'Temporary Restrictive Net Assets';
            if ($permanent == 1) {
                $net_assets = 'Permanent Restrictive Net Assets';
            }
        }

        $coa = new ChartOfAccounts();
        $coa->add('Cash','Asset');
        $coa->add($net_assets, 'Equity');
		$coa->add('Donations and Grants - ' . $donor_type,'Revenue');

		$cash = new Cash('Cash');
		$cash->decrease($txdate, $description, $amount);

		$equity = new Equity($net_assets);
		$equity->increase($txdate, $description, $amount);

		$revenue = new Revenue('Donations and Grants - ' . $donor_type);
		$revenue->increase($txdate, $description, $amount);
    }
}

/**
 * Financial Statements
 * 
 * The financial statements produced by a nonprofit entity differ in several respects from those issued by a for-profit entity. 
 * For example, the statement of activities replaces the income statement, while the statement of financial position replaces the balance sheet. 
 * Both for-profit and nonprofit entities issue a statement of cash flows. 
 * Finally, there is no nonprofit equivalent for the statement of stockholders' equity, since a nonprofit has no equity.
 */


?>