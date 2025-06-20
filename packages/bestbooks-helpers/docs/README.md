## Functions

<dl>
<dt><a href="#createAccountInstance">createAccountInstance(name, type)</a> ⇒ <code>object</code></dt>
<dd><p>Creates an instance of an account class based on the provided name and type.</p>
</dd>
<dt><a href="#createAccount">createAccount(name, type)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Asynchronously creates a new account in the Chart of Accounts.</p>
</dd>
<dt><a href="#getUsersByType">getUsersByType(userType)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Retrieves users from the database based on the specified user type.</p>
</dd>
<dt><a href="#addCredit">addCredit(account, txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Adds a credit transaction to the specified account.</p>
</dd>
<dt><a href="#addDebit">addDebit(account, txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Adds a debit entry to the specified account.</p>
</dd>
<dt><a href="#addJournalTransaction">addJournalTransaction(account, txdate, reference, debit, credit, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Adds a journal transaction for a given account.</p>
</dd>
<dt><a href="#editJournalTransaction">editJournalTransaction(id, account, txdate, reference, debit, credit)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Edits a journal transaction with the specified details.</p>
</dd>
<dt><a href="#asset">asset(account, txdate, description, amount, [company_id], [office_id], [location_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an asset transaction by adding the account to the Chart of Accounts (COA) and then
creating either a debit or credit entry for the asset, depending on the amount.</p>
</dd>
<dt><a href="#expense">expense(account, txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an expense transaction for a given account.</p>
</dd>
<dt><a href="#liability">liability(account, txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a liability transaction for a given account.</p>
<p>Adds the account to the Chart of Accounts as a Liability if it doesn&#39;t exist,
then records either a debit or credit transaction based on the sign of the amount.</p>
</dd>
<dt><a href="#equity">equity(account, txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Handles equity transactions by adding the account to the Chart of Accounts (COA) as &quot;Equity&quot;
and then increasing or decreasing the equity based on the amount.</p>
</dd>
<dt><a href="#revenue">revenue(account, txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Handles a revenue transaction by updating the Chart of Accounts and the Revenue account.</p>
</dd>
<dt><a href="#isJournalInbalance">isJournalInbalance(name)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Checks if the journal is in balance.</p>
</dd>
<dt><a href="#investment">investment(txdate, description, amount, [equity])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an investment transaction by increasing both the Cash and Equity accounts.</p>
</dd>
<dt><a href="#encumber">encumber(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an encumbrance transaction by increasing both the Cash and Loans Payable accounts.</p>
</dd>
<dt><a href="#bankfee">bankfee(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a bank fee transaction by updating the Chart of Accounts,
decreasing the Cash account, and increasing the Bank Service Charges expense.</p>
</dd>
<dt><a href="#loanPayment">loanPayment(txdate, description, amount, interest)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a loan payment transaction, updating the chart of accounts by decreasing cash and loan liability,
and increasing interest expense.</p>
</dd>
<dt><a href="#payAssetsByCheck">payAssetsByCheck(txdate, description, amount, account)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Processes the payment of an asset by check.</p>
<p>This function adds the specified asset account to the chart of accounts,
decreases the cash balance, and increases the specified asset account by the given amount.</p>
</dd>
<dt><a href="#payAssetsByCredit">payAssetsByCredit(txdate, description, amount, account)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a transaction where an asset is acquired and paid for by increasing accounts payable (credit).</p>
</dd>
<dt><a href="#payExpenseByCheck">payExpenseByCheck(txdate, description, amount, account)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the payment of an expense by check.</p>
<p>This function adds the necessary accounts to the chart of accounts (COA),
decreases the cash balance, and increases the specified expense account.</p>
</dd>
<dt><a href="#payExpenseByCard">payExpenseByCard(txdate, description, amount, account)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the payment of an expense using a card by updating the chart of accounts,
increasing the specified expense account, and increasing the Accounts Payable liability.</p>
</dd>
<dt><a href="#cardPayment">cardPayment(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Processes a card payment transaction by updating the Chart of Accounts,
decreasing the Cash and Accounts Payable balances accordingly.</p>
</dd>
<dt><a href="#cashPayment">cashPayment(txdate, description, amount, [COGS])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a cash payment transaction by updating the Chart of Accounts and creating corresponding journal entries.</p>
</dd>
<dt><a href="#salesCash">salesCash(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a sales transaction by increasing both the Sales (Revenue) and Cash accounts.</p>
</dd>
<dt><a href="#salesCard">salesCard(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a sales transaction by updating the Chart of Accounts,
increasing the Sales (Revenue) and Accounts Receivable (Asset) accounts.</p>
</dd>
<dt><a href="#accountsReceivablePayment">accountsReceivablePayment(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a payment received for accounts receivable.</p>
<p>This function adds the necessary accounts to the chart of accounts if they do not exist,
increases the cash account by the payment amount, and decreases the accounts receivable asset.</p>
</dd>
<dt><a href="#distribution">distribution(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a distribution transaction by updating the Chart of Accounts,
decreasing the Cash account, and increasing the Distribution (Equity) account.</p>
</dd>
<dt><a href="#COGS">COGS(txdate, description, amount, [cogs], [purchase], [inventory])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the Cost of Goods Sold (COGS) transaction by updating the Chart of Accounts and adjusting related accounts.</p>
</dd>
<dt><a href="#unearnedRevenue">unearnedRevenue(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an unearned revenue transaction by updating the Chart of Accounts,
decreasing the Cash account, and increasing the Unearned Revenue account.</p>
</dd>
<dt><a href="#badDebt">badDebt(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a bad debt transaction by increasing the Bad Debt expense and decreasing the Account Receivable asset.</p>
</dd>
<dt><a href="#accruedIncome">accruedIncome([account], [receivable], txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an accrued income transaction by increasing both the income account and the receivable asset.</p>
</dd>
<dt><a href="#accruedIncomePayment">accruedIncomePayment([account], [receivable], txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the payment of accrued income by decreasing the &quot;Income Receivable&quot; asset
and increasing the specified account (default &quot;Cash&quot;).</p>
</dd>
<dt><a href="#accruedExpense">accruedExpense(expense, payable, txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an accrued expense by increasing the specified expense (asset) and payable (liability) accounts.</p>
</dd>
<dt><a href="#dividendDeclared">dividendDeclared(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the declaration of a dividend by updating the chart of accounts.
Decreases the &quot;Retained Earnings&quot; equity account and increases the &quot;Dividends Payable&quot; liability account.</p>
</dd>
<dt><a href="#dividendPaid">dividendPaid(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a dividend payment transaction by updating the Chart of Accounts.
Decreases the &quot;Cash&quot; asset and the &quot;Dividends Payable&quot; liability accounts.</p>
</dd>
<dt><a href="#securityDepositReceived">securityDepositReceived(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the receipt of a security deposit by increasing the &quot;Cash&quot; asset and the &quot;Refundable Security Deposit&quot; liability.</p>
</dd>
<dt><a href="#securityDepositPaid">securityDepositPaid(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a security deposit payment transaction by updating the chart of accounts.
Decreases the Cash asset and increases the Security Deposit liability.</p>
</dd>
<dt><a href="#deferredRevenue">deferredRevenue(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a deferred revenue transaction by increasing both the Cash (Asset) and Unearned Revenue (Liability) accounts.</p>
</dd>
<dt><a href="#recognizeDeferredRevenue">recognizeDeferredRevenue(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Recognizes deferred revenue by transferring the specified amount from the &quot;Unearned Revenue&quot; liability account
to the &quot;Revenue&quot; account on the given transaction date with a description.</p>
</dd>
<dt><a href="#deferredExpense">deferredExpense(txdate, description, amount, [asset_account])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a deferred expense transaction by increasing the specified asset account and decreasing the cash account.</p>
</dd>
<dt><a href="#recognizeDeferredExpense">recognizeDeferredExpense(asset_account, expense_account, txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Recognizes a deferred expense by transferring an amount from an asset account to an expense account.</p>
</dd>
<dt><a href="#prepaidSubscriptions">prepaidSubscriptions(txdate, description, amount)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Handles the accounting entry for prepaid subscriptions by recording a deferred expense.</p>
</dd>
<dt><a href="#recognizePrepaidSubscription">recognizePrepaidSubscription(txdate, description, amount)</a></dt>
<dd><p>Recognizes a prepaid subscription as a deferred expense.</p>
</dd>
<dt><a href="#paidInCapitalStock">paidInCapitalStock(txdate, description, amount, shares, assetClass,, parValue,)</a></dt>
<dd><p>Paid -in Capital Stock ior Contributed Capital</p>
</dd>
<dt><a href="#stockDividend">stockDividend(txdate, description, amount, shares, [assetClass], [parValue])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a stock dividend transaction, updating the chart of accounts and equity balances.</p>
</dd>
<dt><a href="#cashDividendDeclared">cashDividendDeclared()</a></dt>
<dd><p>Cash Dividend Declared 
See <a href="https://www.accountingtools.com/articles/how-do-i-account-for-cash-dividends.html">https://www.accountingtools.com/articles/how-do-i-account-for-cash-dividends.html</a></p>
</dd>
<dt><a href="#cashDividendPayable">cashDividendPayable()</a></dt>
<dd><p>Cash Dividend Payable
See <a href="https://www.accountingtools.com/articles/how-do-i-account-for-cash-dividends.html">https://www.accountingtools.com/articles/how-do-i-account-for-cash-dividends.html</a></p>
</dd>
<dt><a href="#stocksIssuedOtherThanCash">stocksIssuedOtherThanCash(txdate, description, amount, asset_account, shares, [assetClass], [parValue])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the issuance of stocks for consideration other than cash.</p>
<p>This function updates the chart of accounts, asset, and equity accounts to reflect
the issuance of shares in exchange for non-cash assets. It handles par value and
additional paid-in capital if applicable.</p>
</dd>
<dt><a href="#workingHours">workingHours(hoursPerWeek)</a> ⇒ <code>Promise.&lt;{workHoursInYear: number, workHoursInMonth: number}&gt;</code></dt>
<dd><p>Calculates the total working hours in a year and per month based on weekly hours.</p>
</dd>
<dt><a href="#payrollPayable">payrollPayable(txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Processes a payroll payable transaction by updating the chart of accounts,
adding the necessary accounts if they do not exist, and recording the credit and debit entries.</p>
</dd>
<dt><a href="#accruedInterest">accruedInterest(txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an accrued interest transaction by adding entries to the chart of accounts,
and creating corresponding debit and credit entries for interest expense and interest payable.</p>
</dd>
<dt><a href="#interestExpense">interestExpense(txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records an interest expense transaction by adding entries to the chart of accounts,
and debiting both the Interest Expense and Cash accounts.</p>
</dd>
<dt><a href="#bondsIssuedWOAccruedInterest">bondsIssuedWOAccruedInterest(txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the issuance of bonds without accrued interest by updating the chart of accounts,
increasing both the &quot;Cash&quot; and &quot;Bonds Payable&quot; accounts.</p>
</dd>
<dt><a href="#bondsIssuedWithAccruedInterest">bondsIssuedWithAccruedInterest(txdate, description, amount, interest, [monthsPaidInterest], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the issuance of bonds with accrued interest in the accounting system.</p>
<p>This function adds the necessary accounts (Bonds Payable, Interest Payable, Cash)
to the chart of accounts if they do not exist, calculates the accrued interest,
and updates the balances for each account accordingly.</p>
</dd>
<dt><a href="#bondPremium">bondPremium(txdate, description, amount, bondRate, marketRate, maturityDate, [paymentPeriod], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Calculates and records the issuance of a bond at a premium.</p>
<p>Adds necessary accounts to the chart of accounts, computes the bond premium,
and records the appropriate increases in Cash, Bonds Payable, and Bond Premium accounts.</p>
</dd>
<dt><a href="#bondPremiumInterestPayment">bondPremiumInterestPayment(txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the interest payment for a bond premium by increasing both the Interest Expense and Interest Payable accounts.</p>
</dd>
<dt><a href="#bondDiscount">bondDiscount(txdate, description, amount, bondRate, marketRate, maturityDate, [paymentPeriod], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Calculates and records the issuance of a bond at a discount, including present value calculations
for coupon payments and face value, and updates relevant accounts.</p>
</dd>
<dt><a href="#initializeEquity">initializeEquity()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Initializes the equity section of the Chart of Accounts by adding common equity accounts.</p>
<p>Accounts added:</p>
<ul>
<li>Common Shares Par Value</li>
<li>Additional Paid-in Capital</li>
<li>Retained Earnings</li>
<li>Treasury Shares</li>
</ul>
</dd>
<dt><a href="#salesViaPaypal">salesViaPaypal(txdate, description, amount, fee, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a sales transaction made via PayPal, including revenue, PayPal asset increase, and bank fee expense.</p>
</dd>
<dt><a href="#commissionPayable">commissionPayable(txdate, description, amount, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a commission payable transaction by creating necessary accounts and posting debit and credit entries.</p>
</dd>
<dt><a href="#commissionPaid">commissionPaid(txdate, description, amount, [asset], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a commission payment transaction by updating the relevant accounts:</p>
<ul>
<li>Adds &quot;Commission Expense&quot; (Expense), &quot;Commission Payable&quot; (Liability), and the specified asset account.</li>
<li>Debits &quot;Commission Payable&quot; and &quot;Commission Expense&quot; accounts.</li>
<li>Credits the specified asset account.</li>
</ul>
</dd>
<dt><a href="#allocateFundingAccount">allocateFundingAccount(txdate, description, amount, [asset], [equity], [expense], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Allocates funding by creating and updating asset, equity, and expense accounts.</p>
</dd>
<dt><a href="#spendFundingAccount">spendFundingAccount(txdate, description, amount, [payable], [equity], [expense], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a funding allocation transaction by updating the relevant accounts:</p>
<ul>
<li>Adds the specified accounts to the chart of accounts if they do not exist.</li>
<li>Credits the payable account.</li>
<li>Debits the funding allocation (equity) and approval request (expense) accounts.</li>
</ul>
</dd>
<dt><a href="#softwareLicense">softwareLicense(txdate, description, amount, fee, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a software license transaction involving cryptocurrency, sales, transaction fees, and accounts receivable.</p>
</dd>
<dt><a href="#exchangeCryptocurrencyToUSD">exchangeCryptocurrencyToUSD(txdate, description, amount, fee, [gainLoss], [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Exchanges cryptocurrency to USD and records the transaction in the accounting system.</p>
<p>This function handles the accounting entries for exchanging cryptocurrency to USD,
including handling transaction fees and gain/loss on the exchange.</p>
</dd>
<dt><a href="#exchangeUSDToCryptocurrency">exchangeUSDToCryptocurrency(txdate, description, amount, fee, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Exchanges a specified USD amount to cryptocurrency, recording the transaction and associated fee in the accounting system.</p>
</dd>
<dt><a href="#googleAdsenseEarning">googleAdsenseEarning(txdate, description, amount, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a Google AdSense earning as a revenue transaction.</p>
</dd>
<dt><a href="#googleAdsensePayout">googleAdsensePayout(txdate, description, amount, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a Google Adsense payout transaction by updating the chart of accounts and creating corresponding debit and credit entries.</p>
</dd>
<dt><a href="#googleAdsenseReceivePayout">googleAdsenseReceivePayout(txdate, description, amount, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a Google AdSense payout transaction by updating the chart of accounts,
adding the necessary bank and asset accounts, and creating corresponding debit and credit entries.</p>
</dd>
<dt><a href="#addFundsToPostageDebitAccount">addFundsToPostageDebitAccount(txdate, description, amount, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Adds funds to the &quot;Postage Debit Account&quot; by recording a debit in the asset account
and a corresponding credit in the specified bank account.</p>
</dd>
<dt><a href="#postageExpense">postageExpense(txdate, description, amount, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a postage expense transaction by updating the Chart of Accounts and creating corresponding debit and credit entries.</p>
</dd>
<dt><a href="#pendingPurchase">pendingPurchase(txdate, description, amount, [expense], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a pending purchase transaction by creating necessary chart of accounts entries,
and posting corresponding debit and credit journal entries.</p>
</dd>
<dt><a href="#pendingPurchaseCleared">pendingPurchaseCleared(txdate, description, amount, [bank], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Clears a pending purchase by recording the appropriate debit and credit transactions.</p>
</dd>
<dt><a href="#pendingPurchaseSettled">pendingPurchaseSettled(txdate, description, amount, [bank], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Marks a pending purchase as settled by clearing it.</p>
</dd>
<dt><a href="#apic">apic(txdate, description, price, numberOfShares, [parValue], [company_id], [office_id], [user])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>To calculate the Additional Paid-In Capital (APIC), we need to compute the difference between the price at 
which the shares were sold and the par value of the shares. If the price is greater than the par value, 
that difference multiplied by the number of shares will give the APIC amount.</p>
</dd>
<dt><a href="#uccLienNew">uccLienNew(txdate, description, amount, uccNo, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records a new UCC lien transaction by updating relevant accounts:</p>
<ul>
<li>Adds necessary accounts to the chart of accounts if they do not exist.</li>
<li>Decreases revenue, increases accounts receivable, bad debt expense, and allowance for doubtful accounts.</li>
</ul>
</dd>
<dt><a href="#uccLienAccruedInterest">uccLienAccruedInterest(txdate, description, amount, [account], [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records accrued interest for a UCC lien transaction by updating the chart of accounts
and adjusting the relevant asset and revenue accounts.</p>
</dd>
<dt><a href="#uccLienPaid">uccLienPaid(txdate, description, amount, [interest], [account], uccNo, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Records the payment of a UCC lien by updating relevant asset accounts.</p>
</dd>
<dt><a href="#uccLienWriteOff">uccLienWriteOff(txdate, description, amount, [account], uccNo, [company_id], [office_id])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Writes off a UCC lien by adjusting the relevant accounts: decreases Accounts Receivable and Interest Receivable,
and increases Allowance for Doubtful Accounts.</p>
</dd>
<dt><a href="#mrr">mrr()</a></dt>
<dd><p>MRR: Monthly Recurring Revenue
This function records the MRR by recognizing unearned revenue and increasing accounts receivable.</p>
<p>ASC 606 (Revenue from Contracts with Customers) governs the recognition of MRR.
Specifically, ASC 606-10-25 (Recognition: Identifying Performance Obligations) and
ASC 606-10-45 (Presentation: Contract Assets and Contract Liabilities) apply.</p>
<p>Under ASC 606, revenue is recognized when control of goods or services is transferred to the customer,
and unearned revenue (contract liability) is recognized when cash or receivable is recorded before performance.</p>
</dd>
<dt><a href="#mrrEarned">mrrEarned()</a></dt>
<dd><p>MRR: Monthly Recurring Revenue Earned
This function records the earned MRR by recognizing revenue and reducing unearned revenue.</p>
<p>ASC 606 (Revenue from Contracts with Customers) governs the recognition of earned MRR.
Specifically, ASC 606-10-25 (Recognition: Identifying Performance Obligations) and
ASC 606-10-45 (Presentation: Contract Assets and Contract Liabilities) apply.</p>
<p>Under ASC 606, revenue is recognized when control of goods or services is transferred to the customer,
and unearned revenue (contract liability) is reduced as performance obligations are satisfied.</p>
</dd>
<dt><a href="#mrrReceived">mrrReceived()</a></dt>
<dd><p>MRR: Monthly Recurring Revenue Received
This function records the received MRR by recognizing cash and reducing accounts receivable.</p>
<p>ASC 606-10-25 (Revenue from Contracts with Customers) governs the recognition of revenue, including MRR.
When cash is received for previously invoiced MRR, ASC 606-10-45-1 (Presentation: Contract Assets and Contract Liabilities) applies.
The reduction of accounts receivable and increase in cash is a standard receivables settlement under ASC 606.</p>
</dd>
<dt><a href="#cmrr">cmrr()</a></dt>
<dd><p>Recording CMRR (Committed Monthly Recurring Revenue)
CMRR adjusts MRR by accounting for committed changes, including:</p>
<p>Expansions (Upsells)
Contractions (Downgrades)
Churn (Cancellations)</p>
<p>Scenario:
A customer upgrades their subscription from $500 to $700 next month.
Another customer cancels a $200 plan effective next month.
Adjustment Entry for Future Revenue Commitment (CMRR Update):</p>
<pre><code> CMRR Adjustment (Off-Balance Sheet)   $200  
</code></pre>
<p>This adjustment does not impact financial statements immediately but helps forecast future revenue trends.</p>
<p>ASC 606-10-25 (Revenue from Contracts with Customers) governs the recognition of CMRR.</p>
</dd>
<dt><a href="#locationAdd">locationAdd(location, region)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Adds a new location with its region to the database, or updates the region if the location already exists.</p>
</dd>
<dt><a href="#locationUpdate">locationUpdate(name, type, locationId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Updates the location ID for a specific account in the ledger.</p>
</dd>
<dt><a href="#locationDelete">locationDelete(locationId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Deletes a location from the database if it does not exist in the ledger table.</p>
</dd>
<dt><a href="#locationDeleteByName">locationDeleteByName(name)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Deletes a location from the &#39;locations&#39; table based on the account name,
only if there are no other ledger entries referencing that location.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Inventory">Inventory</a> : <code>Object</code></dt>
<dd><p>A mapping of account type names to their corresponding class constructors.</p>
<p>The map supports both direct class references and inline class definitions for specific account types.
Some account types (e.g., ContraAsset, ContraLiability) are mapped to their base class.</p>
</dd>
</dl>

<a name="createAccountInstance"></a>

## createAccountInstance(name, type) ⇒ <code>object</code>
Creates an instance of an account class based on the provided name and type.

**Kind**: global function  
**Returns**: <code>object</code> - An instance of the corresponding account class.  
**Throws**:

- <code>Error</code> If the account type is unsupported.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the account. |
| type | <code>string</code> | The type of the account (should match a key in AccountTypes). |

<a name="createAccount"></a>

## createAccount(name, type) ⇒ <code>Promise.&lt;any&gt;</code>
Asynchronously creates a new account in the Chart of Accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;any&gt;</code> - A promise that resolves with the status of the account creation.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the account to create. |
| type | <code>string</code> | The type of the account (e.g., 'asset', 'liability', etc.). |

<a name="getUsersByType"></a>

## getUsersByType(userType) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Retrieves users from the database based on the specified user type.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - A promise that resolves to an array of user objects from the corresponding table.  
**Throws**:

- Will log an error if the database query fails.


| Param | Type | Description |
| --- | --- | --- |
| userType | <code>string</code> | The type of users to retrieve. Valid values are 'internal', 'vendor', or 'customer'. |

<a name="addCredit"></a>

## addCredit(account, txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;\*&gt;</code>
Adds a credit transaction to the specified account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves to the status of the credit addition.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| account | <code>Object</code> |  | The account object with an addCredit method. |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | The description of the credit transaction. |
| amount | <code>number</code> |  | The amount to credit. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional). |

<a name="addDebit"></a>

## addDebit(account, txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;\*&gt;</code>
Adds a debit entry to the specified account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The status returned by the account's addDebit method.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| account | <code>Object</code> |  | The account object with an addDebit method. |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | The description of the debit transaction. |
| amount | <code>number</code> |  | The amount to debit. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

<a name="addJournalTransaction"></a>

## addJournalTransaction(account, txdate, reference, debit, credit, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Adds a journal transaction for a given account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is added.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| account | <code>string</code> \| <code>number</code> |  | The account identifier for the transaction. |
| txdate | <code>string</code> \| <code>Date</code> |  | The date of the transaction. |
| reference | <code>string</code> |  | A reference or description for the transaction. |
| debit | <code>number</code> |  | The debit amount for the transaction. |
| credit | <code>number</code> |  | The credit amount for the transaction. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction (optional). |

<a name="editJournalTransaction"></a>

## editJournalTransaction(id, account, txdate, reference, debit, credit) ⇒ <code>Promise.&lt;void&gt;</code>
Edits a journal transaction with the specified details.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is updated.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The unique identifier of the journal transaction to edit. |
| account | <code>string</code> | The account associated with the transaction. |
| txdate | <code>string</code> \| <code>Date</code> | The date of the transaction. |
| reference | <code>string</code> | A reference or description for the transaction. |
| debit | <code>number</code> | The debit amount for the transaction. |
| credit | <code>number</code> | The credit amount for the transaction. |

<a name="asset"></a>

## asset(account, txdate, description, amount, [company_id], [office_id], [location_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records an asset transaction by adding the account to the Chart of Accounts (COA) and thencreating either a debit or credit entry for the asset, depending on the amount.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| account | <code>string</code> |  | The name or identifier of the asset account. |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The transaction amount. Positive for debit, negative for credit. |
| [company_id] | <code>number</code> | <code>0</code> | Optional company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | Optional office identifier. |
| [location_id] | <code>number</code> | <code>0</code> | Optional location identifier. |

<a name="expense"></a>

## expense(account, txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records an expense transaction for a given account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | The name or identifier of the expense account. |
| txdate | <code>string</code> \| <code>Date</code> | The date of the transaction. |
| description | <code>string</code> | A description of the expense. |
| amount | <code>number</code> | The amount of the expense. If negative, the expense is decreased. |

<a name="liability"></a>

## liability(account, txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a liability transaction for a given account.Adds the account to the Chart of Accounts as a Liability if it doesn't exist,then records either a debit or credit transaction based on the sign of the amount.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | The name or identifier of the liability account. |
| txdate | <code>string</code> \| <code>Date</code> | The date of the transaction. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The transaction amount. Negative for debit, positive for credit. |

**Example**  
```js
Credit Accounts: Liabilities, Equity, & RevenueFrom: https://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtmlLiability, Equity, and Revenue accounts usually receive credits, so they maintain negative balances. They are called credit accounts. Accounting books will say “Accounts that normally maintain a negative balance are increased with a Credit and decreased with a Debit.” Again, look at the number line. If you add a negative number (credit) to a negative number, you get a larger negative number! (moving left on the number line). But if you start with a negative number and add a positive number to it (debit), you get a smaller negative number because you move to the right on the number line.We have not discussed crossing zero on the number line. If we have $100 in our checkingaccount and write a check for $150, the check will bounce and Cash will have a negative value - an undesirable event. A negative account might reach zero - such as a loan account when the final payment is posted. And many accounts, such as Expense accounts, are reset to zero at the beginning of the new fiscal year. But credit accounts rarely have a positive balance and debit accounts rarely have a negative balance at any time.[Remember: A debit adds a positive number and a credit adds a negative number. But you NEVER put a minus sign on a number you enter into the accounting software.] 
```
<a name="equity"></a>

## equity(account, txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Handles equity transactions by adding the account to the Chart of Accounts (COA) as "Equity"and then increasing or decreasing the equity based on the amount.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is processed.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | The name or identifier of the equity account. |
| txdate | <code>string</code> \| <code>Date</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to increase (if positive) or decrease (if negative) the equity. |

<a name="revenue"></a>

## revenue(account, txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Handles a revenue transaction by updating the Chart of Accounts and the Revenue account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is processed.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | The account identifier for the revenue transaction. |
| txdate | <code>string</code> \| <code>Date</code> | The date of the transaction. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the transaction. Negative values increase revenue, positive values decrease revenue. |

<a name="isJournalInbalance"></a>

## isJournalInbalance(name) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if the journal is in balance.

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Promise resolving to true if in balance, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> | <code>&quot;General&quot;</code> | The name of the journal (default is 'General'). |

<a name="investment"></a>

## investment(txdate, description, amount, [equity]) ⇒ <code>Promise.&lt;void&gt;</code>
Records an investment transaction by increasing both the Cash and Equity accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the investment transaction. |
| amount | <code>number</code> |  | The amount of the investment. |
| [equity] | <code>string</code> | <code>&quot;&#x27;Owners Equity&#x27;&quot;</code> | The name of the equity account to increase. |

**Example**  
```js
Example 1: Owner Invests Capital in the CompanyFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlOwner invests $5,000.   Analysis: Since money is deposited into the checking account, Cash is debited (the balance increased by $5,000). What account receives a credit? An Equity account called Owner’s Equity or Capital Contribution. Since Equity accounts are ‘negative’ accounts, crediting this Equity account increases its balance by $5,000.Debit Cash (increase its balance)Credit Owner’s Equity|Capital (increases its balance)
```
<a name="encumber"></a>

## encumber(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records an encumbrance transaction by increasing both the Cash and Loans Payable accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> | The date of the transaction. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to be encumbered. |

**Example**  
```js
Example 2: Company Takes Out a LoanFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe company borrows $8,000 from a bank.   Analysis: Since the money will be deposited into the checking account,      Cash is debited (the balance increased by $8,000.) The account to receive the credit is a Liability account called Loans Payable (you may create a separate account or sub-account for each loan). Liability accounts are credit accounts, so crediting the Liability account increases its negative balance by $8,000 (moves to the left on the number line).     Debit Cash (increases its balance)     Credit Loans Payable (increases its balance)
```
<a name="bankfee"></a>

## bankfee(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a bank fee transaction by updating the Chart of Accounts,decreasing the Cash account, and increasing the Bank Service Charges expense.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> | The transaction date. |
| description | <code>string</code> | A description of the bank fee. |
| amount | <code>number</code> | The amount of the bank fee. |

**Example**  
```js
Example 3: Monthly Statement Fee from BankFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlYour bank charges a monthly statement fee of $14.   Analysis: This transaction is entered via a journal entry each month when the checking account is balanced. Since money was removed from the checking account, Cash is credited (the balance decreased by $14). The Expense account called Bank Service Charges receives the debit.Debit Bank Fees (increases its balance)Credit Cash (decreases its balance)
```
<a name="loanPayment"></a>

## loanPayment(txdate, description, amount, interest) ⇒ <code>Promise.&lt;void&gt;</code>
Records a loan payment transaction, updating the chart of accounts by decreasing cash and loan liability,and increasing interest expense.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The principal amount of the loan payment. |
| interest | <code>number</code> | The interest portion of the loan payment. |

**Example**  
```js
Example 4: Making a Loan PaymentFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlYou pay $540, via check, on the $8,000 loan acquired in Example 2. Of this amount, $500 is applied to the principal, and $40 is applied to the loan interest.   Analysis: Since a check is being written, BestBooks will automatically credit Cash. In this case the debit is split between two accounts. To reflect the $500 that has been applied to the loan balance, debit the loan account. (Since it is a liability account, a debit will reduce its balance, which is what you want.) The $40 interest paid is an expense, so debit the expense account called Loan Interest. Remember that even though the debit is split between two accounts, the total debit must always equal the total credit.Debit Loans Payable $500 (decreases its balance)Debit Interest Expense $40 (increases its balance)Credit Cash $540 (decreases its balance)
```
<a name="payAssetsByCheck"></a>

## payAssetsByCheck(txdate, description, amount, account) ⇒ <code>Promise.&lt;void&gt;</code>
Processes the payment of an asset by check.This function adds the specified asset account to the chart of accounts,decreases the cash balance, and increases the specified asset account by the given amount.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is complete.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to be paid. |
| account | <code>string</code> | The name of the asset account to increase. |

**Example**  
```js
Example 5: Company Writes a Check to Pay for an AssetFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company writes a check for $8,500 of equipment.   Analysis: Since a check was written, BestBooks will automatically credit Cash. The item is too costly to be considered an expense, so it must be entered into the accounting system as an asset. So we will debit an Asset account called Equipment or something similar. In addition, assets must be depreciated over time, with journal entries entered each year for a proscribed number of years. Depreciation is complicated, so be sure to see your accountant when purchasing company assets.Debit Equipment (increases its balance)Credit Cash (decreases its balance)[Remember: A debit adds a positive number and a credit adds a negative number. But you NEVER put a minus sign on a number you enter into the accounting software.] 
```
<a name="payAssetsByCredit"></a>

## payAssetsByCredit(txdate, description, amount, account) ⇒ <code>Promise.&lt;void&gt;</code>
Records a transaction where an asset is acquired and paid for by increasing accounts payable (credit).

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the transaction. |
| account | <code>string</code> | The asset account to be increased. |

<a name="payExpenseByCheck"></a>

## payExpenseByCheck(txdate, description, amount, account) ⇒ <code>Promise.&lt;void&gt;</code>
Records the payment of an expense by check.This function adds the necessary accounts to the chart of accounts (COA),decreases the cash balance, and increases the specified expense account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date in a string format. |
| description | <code>string</code> | A description of the expense. |
| amount | <code>number</code> | The amount to be paid. |
| account | <code>string</code> | The name of the expense account. |

**Example**  
```js
Example 6: Company Writes Check to Pay for ExpensesFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company writes a check to pay for $318 of office supplies.   Analysis: Since a check was written, BestBooks will automatically credit Cash. We debit the Expense account called Office.- Debit Office (increases its balance)- Credit Cash (decreases its balance)async function processPurchase() {  await payExpenseByCheck('2025-06-15', 'Office Supplies', 318.00, 'Operations Expense', 101, 5);  console.log('Transaction recorded.');}
```
<a name="payExpenseByCard"></a>

## payExpenseByCard(txdate, description, amount, account) ⇒ <code>Promise.&lt;void&gt;</code>
Records the payment of an expense using a card by updating the chart of accounts,increasing the specified expense account, and increasing the Accounts Payable liability.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is successfully recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date in a suitable string format. |
| description | <code>string</code> | A description of the expense transaction. |
| amount | <code>number</code> | The amount of the expense to be recorded. |
| account | <code>string</code> | The name of the expense account to be affected. |

**Example**  
```js
Example 7: Company Uses Credit Card to Pay for ExpensesFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company purchases $318 of office supplies and pays with a company credit card. Back in the office, the bill is entered into the accounting software.   Analysis: When you enter a bill, BestBooks will automatically credit the Liability account called Accounts Payable. And since you purchased office supplies, an expense account called Office (or similar) should receive the debit.Debit Office (increase its balance)Credit Accounts Payable (increases its balance)async function process() {   await payExpenseByCard("2025-06-15","office supplies",318.00,"Office Supplies");}
```
<a name="cardPayment"></a>

## cardPayment(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Processes a card payment transaction by updating the Chart of Accounts,decreasing the Cash and Accounts Payable balances accordingly.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is processed.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the card payment. |

**Example**  
```js
Example 8: Company Pays the Credit Card BillFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlYou pay the bill for the $318 of office supplies purchased in Example 7.   Analysis: When the bill was entered, an expense account called Office (or similar) was debited and Accounts Payable was credited. Now as we write a check to pay the bill, BestBooks will automatically credit Cash, and will debit Accounts Payable - in effect, reversing the earlier credit.Debit Accounts Payable (decreases its balance)Credit Cash (decrease its balance)
```
<a name="cashPayment"></a>

## cashPayment(txdate, description, amount, [COGS]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a cash payment transaction by updating the Chart of Accounts and creating corresponding journal entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date in a string format. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount of the cash payment. |
| [COGS] | <code>string</code> | <code>&quot;&#x27;Cost of Goods Sold&#x27;&quot;</code> | The name of the expense account to use (defaults to 'Cost of Goods Sold'). |

**Example**  
```js
Example 9: Company Pays Cash for a Cost of Good Sold (COGS)From: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company pays $450 cash for Product A - a COGS part.   Analysis: When you write the check, BestBooks will automatically credit Cash. In the check window, choose the COGS account from the Expenses tab, or choose an Item from the Items tab that is associated with the COGS account. Either way, the COGS account receives the debit.Debit COGS (increase its balance)Credit Cash (decrease its balance)
```
<a name="salesCash"></a>

## salesCash(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a sales transaction by increasing both the Sales (Revenue) and Cash accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date in a string format. |
| description | <code>string</code> | A description of the sales transaction. |
| amount | <code>number</code> | The amount of the sales transaction. |

**Example**  
```js
Example 10: Company Receives Cash Payment for a SaleFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company sells Product A for $650 cash.   Analysis: When you enter the cash sale, BestBooks will automatically debit Cash. You will have to choose an Item for the sale … it might be “Prod A income” and associated with the Sales account.Debit Cash (increases its balance)Credit Sales (increases its balance)
```
<a name="salesCard"></a>

## salesCard(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a sales transaction by updating the Chart of Accounts,increasing the Sales (Revenue) and Accounts Receivable (Asset) accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the sale. |

**Example**  
```js
Example 11: Company Makes a Credit Card SaleFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company sells Product A for $650 on credit.   Analysis: When you create an invoice, you must specify an Item for each separate charge on the invoice. BestBooks will automatically credit the revenue account(s) associated with these Items. And BestBooks will automatically debit the invoice amount to Accounts Receivable.Debit Accounts Receivable (increases the balance)Credit Sales (increases the balance)
```
<a name="accountsReceivablePayment"></a>

## accountsReceivablePayment(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a payment received for accounts receivable.This function adds the necessary accounts to the chart of accounts if they do not exist,increases the cash account by the payment amount, and decreases the accounts receivable asset.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the payment has been recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date in a string format. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount received for the accounts receivable payment. |

**Example**  
```js
Example 12: Company Receives Payment on an InvoiceFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe Company receives a payment for the $650 invoice above.   Analysis: When you created the invoice, BestBooks debited the Accounts Receivable account. When you post the invoice payment, BestBooks will credit A/R - in effect reversing the earlier debit. The accounting software will also debit Cash - increasing its balance.Debit Cash (increases the balance)Credit A/R (decreases the balance)
```
<a name="distribution"></a>

## distribution(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a distribution transaction by updating the Chart of Accounts,decreasing the Cash account, and increasing the Distribution (Equity) account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to distribute. |

**Example**  
```js
Example 13: Owner Takes Money Out of the Company - a DistributionFrom: https://www.keynotesupport.com/accounting/accounting-transactions.shtmlThe owner’s writes himself a check for $1,000.   Analysis: Since a check was written, BestBooks will automatically credit Cash. The account you chose for the debit is an Equity account called Draw (Sole Proprietor) or Distribution (Corporation). Note: These are the only non-contra Equity accounts that are positive accounts and receive debits.Debit Owner’s Draw (increases its balance)Credit Cash (decrease its balance)
```
<a name="COGS"></a>

## COGS(txdate, description, amount, [cogs], [purchase], [inventory]) ⇒ <code>Promise.&lt;void&gt;</code>
Records the Cost of Goods Sold (COGS) transaction by updating the Chart of Accounts and adjusting related accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount for the transaction. |
| [cogs] | <code>string</code> | <code>&quot;&#x27;COGS&#x27;&quot;</code> | The name of the COGS account (Expense). |
| [purchase] | <code>string</code> | <code>&quot;&#x27;Purchases&#x27;&quot;</code> | The name of the Purchases account (Liability). |
| [inventory] | <code>string</code> | <code>&quot;&#x27;Inventory&#x27;&quot;</code> | The name of the Inventory account (Asset). |

**Example**  
```js
Costs of Goods SoldThere are the following COGS categories in accordance with the GAAP.		Debit COGS is an Expense (increases it's balance)Credit Purchases is a Liability (decrease it's balance)Credit Inventory is an Asset (increase or decrease based on the amount)
```
<a name="unearnedRevenue"></a>

## unearnedRevenue(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records an unearned revenue transaction by updating the Chart of Accounts,decreasing the Cash account, and increasing the Unearned Revenue account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the transaction. |

**Example**  
```js
Example 17: Unearned RevenueIs income received but not yet earned, e.g. deposits taken on a job not yet performed.Unearned income is applicable for Service Income, while Product Income is regular incomehttps://www.wallstreetmojo.com/unearned-revenue-journal-entries/https://www.accountingverse.com/accounting-basics/unearned-revenue.html Cash asset account is debited for amount (balance is decreasing)Unearned Revenue liability account is credited for amount (balance is increasing)
```
<a name="badDebt"></a>

## badDebt(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a bad debt transaction by increasing the Bad Debt expense and decreasing the Account Receivable asset.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the bad debt. |

**Example**  
```js
Example 18: Accounting for Bad DebtIf a company sells on credit, customers will occasionally be unable to pay, in which case the seller should charge the account receivable to expense as a bad debthttps://www.accountingtools.com/articles/2017/5/17/accounts-receivable-accountingBad Debt expense account debited Account Receivable is credited
```
<a name="accruedIncome"></a>

## accruedIncome([account], [receivable], txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records an accrued income transaction by increasing both the income account and the receivable asset.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [account] | <code>string</code> | <code>&quot;\&quot;Income\&quot;&quot;</code> | The name of the income account to credit. |
| [receivable] | <code>string</code> | <code>&quot;\&quot;Income Receivable\&quot;&quot;</code> | The name of the receivable asset account to debit. |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount of income to accrue. |

**Example**  
```js
Example 19: Accrued IncomeWhen a company has earned income but has not received the monies, that are NOT from Saleshttps://accounting-simplified.com/financial/accrual-accounting/accrued-incomeIncome Receivable is debited (increases the balance)Income account is credited (increases the balance)
```
<a name="accruedIncomePayment"></a>

## accruedIncomePayment([account], [receivable], txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records the payment of accrued income by decreasing the "Income Receivable" assetand increasing the specified account (default "Cash").

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [account] | <code>string</code> | <code>&quot;\&quot;Cash\&quot;&quot;</code> | The account to increase (typically "Cash"). |
| [receivable] | <code>string</code> | <code>&quot;\&quot;Income Receivable\&quot;&quot;</code> | The receivable asset account to decrease. |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount to transfer from receivable to account. |

**Example**  
```js
Example 19.1: Receipt of Payment on Accrued IncomeWhen payment is due, and the customer makes the payment, an accountant for that company would record an adjustment to accrued revenue. The accountant would make an adjusting journal entry in which the amount of cash received by the customer would be debited to the cash account on the balance sheet, and the same amount of cash received would be credited to the accrued revenue account or accounts receivable account, reducing that account.Cash Account is debited (increases the balance)Income Receivable is credited (decreases the balamce)
```
<a name="accruedExpense"></a>

## accruedExpense(expense, payable, txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records an accrued expense by increasing the specified expense (asset) and payable (liability) accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the operation is complete.  

| Param | Type | Description |
| --- | --- | --- |
| expense | <code>string</code> | The name or identifier of the expense account. |
| payable | <code>string</code> | The name or identifier of the payable (liability) account. |
| txdate | <code>string</code> \| <code>Date</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to record for the accrued expense. |

**Example**  
```js
Example 20: Accrued ExpenseWhen a company has an expense but has not paid, and recorded as an adjusting entryhttps://www.accountingtools.com/articles/what-are-accrued-expenses.htmlExpense account is debited (balance is increasing)Payable account is credited (balance is increasing)
```
<a name="dividendDeclared"></a>

## dividendDeclared(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records the declaration of a dividend by updating the chart of accounts.Decreases the "Retained Earnings" equity account and increases the "Dividends Payable" liability account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date of the dividend declaration. |
| description | <code>string</code> | A description of the dividend transaction. |
| amount | <code>number</code> | The amount of the dividend declared. |

**Example**  
```js
Dividends PayableSee https://www.wallstreetprep.com/knowledge/dividends-payable/Cash Dividend Declared:      Debit (decrease) -> Retained Earnings (Equity)     Credit (increase) => Dividends Payable (Liability)Cash Dividend Paid: Debit -> Dividends Payable (liability), Credit -> Cash (Asset)
```
<a name="dividendPaid"></a>

## dividendPaid(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a dividend payment transaction by updating the Chart of Accounts.Decreases the "Cash" asset and the "Dividends Payable" liability accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the dividend paid. |

**Example**  
```js
Cash Dividend Paid:      Debit*= (decrease) -> Dividends Payable (liability)     Credit (decrease) -> Cash (Asset)
```
<a name="securityDepositReceived"></a>

## securityDepositReceived(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records the receipt of a security deposit by increasing the "Cash" asset and the "Refundable Security Deposit" liability.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the security deposit received. |

**Example**  
```js
Cost to Estimate Technological FeasabilityFASB ASC Topic: 985-20-25-1All costs incurred to establish the technological feasibility of a computer software product to be sold, leased, or otherwise marketed are research and development costs. Those costs shall be charged to expense when incurred as required by SubtopicFor purposes of this Subtopic, the technological feasibility of a computer software product is established when the entity has completed all planning, designing, activities that are necessary to establish that the product can be produced to meet its design specifications including async functions, features, and technical performance requirements. At a minimum, the entity shall have performed the activities in either (a) or (b) as evidence thattechnological feasibility has been established: Security DepositReceive: Cash (Asset) -> Debit (increase)         Refundable Security Deposit (Liability) -> Credit (Increase)
```
<a name="securityDepositPaid"></a>

## securityDepositPaid(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a security deposit payment transaction by updating the chart of accounts.Decreases the Cash asset and increases the Security Deposit liability.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the security deposit paid. |

**Example**  
```js
Paid:    Cash (Asset) -> Credit (decrease)         Security Deposit (Asset) -> Debit (increase) 
```
<a name="deferredRevenue"></a>

## deferredRevenue(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Records a deferred revenue transaction by increasing both the Cash (Asset) and Unearned Revenue (Liability) accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> | The transaction date. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount of the deferred revenue. |

**Example**  
```js
Deferred RevenueSince deferred revenues are not considered revenue until they are earned, they are not reported on the income statement.  Instead they are reported on the balance sheet as a liability. As the income is earned, the liability is decreased and recognized as income.the Cash (Asset account) and the Unearned Revenue (Liability account) are increasing.
```
<a name="recognizeDeferredRevenue"></a>

## recognizeDeferredRevenue(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Recognizes deferred revenue by transferring the specified amount from the "Unearned Revenue" liability accountto the "Revenue" account on the given transaction date with a description.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the revenue recognition is complete.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> | The date of the transaction. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to recognize as revenue. |

**Example**  
```js
Recognize Uneaarned RevenueOnce the services are performed, the income can be recognized with the following entry:  This entry is decreasing the liability account and increasing revenue.
```
<a name="deferredExpense"></a>

## deferredExpense(txdate, description, amount, [asset_account]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a deferred expense transaction by increasing the specified asset account and decreasing the cash account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount of the deferred expense. |
| [asset_account] | <code>string</code> | <code>&quot;\&quot;Deferred Expense\&quot;&quot;</code> | The asset account to increase (defaults to "Deferred Expense"). |

**Example**  
```js
Deferred ExpenseLike deferred revenues, deferred expenses are not reported on the income statement. Instead, they are recorded as an asset on the balance sheet until the expenses are incurred. As the expenses are incurred the asset is decreased and the expense is recorded on the income statement.The (Asset account) is increasing, and Cash (Asset account) is decreasing.
```
<a name="recognizeDeferredExpense"></a>

## recognizeDeferredExpense(asset_account, expense_account, txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Recognizes a deferred expense by transferring an amount from an asset account to an expense account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the deferred expense has been recognized.  

| Param | Type | Description |
| --- | --- | --- |
| asset_account | <code>string</code> | The name or identifier of the asset account to decrease. |
| expense_account | <code>string</code> | The name or identifier of the expense account to increase. |
| txdate | <code>string</code> \| <code>Date</code> | The transaction date for the recognition. |
| description | <code>string</code> | A description of the transaction. |
| amount | <code>number</code> | The amount to transfer from the asset to the expense account. |

**Example**  
```js
Recognize Deferred ExpenseHere we are decreasing our (Asset) and increasing our (Expense)
```
<a name="prepaidSubscriptions"></a>

## prepaidSubscriptions(txdate, description, amount) ⇒ <code>Promise.&lt;void&gt;</code>
Handles the accounting entry for prepaid subscriptions by recording a deferred expense.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the operation is complete.  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date in a string format. |
| description | <code>string</code> | A description of the prepaid subscription. |
| amount | <code>number</code> | The monetary amount of the prepaid subscription. |

<a name="recognizePrepaidSubscription"></a>

## recognizePrepaidSubscription(txdate, description, amount)
Recognizes a prepaid subscription as a deferred expense.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> | The transaction date of the prepaid subscription. |
| description | <code>string</code> | A description of the prepaid subscription. |
| amount | <code>number</code> | The amount of the prepaid subscription. |

**Example**  
```js
Recognized Prepaid Subscriptionis an adjusting entry when the prepaid subscription is recognized
```
<a name="paidInCapitalStock"></a>

## paidInCapitalStock(txdate, description, amount, shares, assetClass,, parValue,)
Paid -in Capital Stock ior Contributed Capital

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| txdate | <code>string</code> |  |
| description | <code>string</code> |  |
| amount | <code>number</code> | total amount invested |
| shares | <code>number</code> | are the number of share purchases |
| assetClass, | <code>string</code> | default='Common Stock', other choices are 'Preferred Stock', Debt, Commodity, etc. |
| parValue, | <code>number</code> | default=0 |

<a name="stockDividend"></a>

## stockDividend(txdate, description, amount, shares, [assetClass], [parValue]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a stock dividend transaction, updating the chart of accounts and equity balances.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | Total amount of the stock dividend. |
| shares | <code>number</code> |  | Number of shares issued as dividend. |
| [assetClass] | <code>string</code> | <code>&quot;\&quot;Common Stock\&quot;&quot;</code> | The class of stock affected. |
| [parValue] | <code>number</code> | <code>0</code> | Par value per share. |

**Example**  
```js
Issuance of Stock DividendSee https://www.accountingtools.com/articles/stock-dividend-accountingA business typically issues a stock dividend when it does not have sufficient cash to pay out a normal dividend, and so resorts to a "paper" distribution of additional shares to shareholders. A stock dividend is never treated as a liability of the issuer, since the issuance does not reduce assets. Consequently, this type of dividend cannot realistically be considered a distribution of assets to shareholders.Also used for Participating Preferred Stock divident, see https://www.accountingcoach.com/stockholders-equity/explanation/7
```
<a name="cashDividendDeclared"></a>

## cashDividendDeclared()
Cash Dividend Declared See https://www.accountingtools.com/articles/how-do-i-account-for-cash-dividends.html

**Kind**: global function  
<a name="cashDividendPayable"></a>

## cashDividendPayable()
Cash Dividend PayableSee https://www.accountingtools.com/articles/how-do-i-account-for-cash-dividends.html

**Kind**: global function  
<a name="stocksIssuedOtherThanCash"></a>

## stocksIssuedOtherThanCash(txdate, description, amount, asset_account, shares, [assetClass], [parValue]) ⇒ <code>Promise.&lt;void&gt;</code>
Records the issuance of stocks for consideration other than cash.This function updates the chart of accounts, asset, and equity accounts to reflectthe issuance of shares in exchange for non-cash assets. It handles par value andadditional paid-in capital if applicable.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The total value of the asset received. |
| asset_account | <code>string</code> |  | The name of the asset account. |
| shares | <code>number</code> |  | The number of shares issued. |
| [assetClass] | <code>string</code> | <code>&quot;\&quot;Common Stock\&quot;&quot;</code> | The class of stock issued. |
| [parValue] | <code>number</code> | <code>0</code> | The par value per share. |

**Example**  
```js
Stocks issued other than CashSee https://www.accountingcoach.com/stockholders-equity/explanation/9An example, when an investors trades real estate for shares, where the real estate is the asset account oran investor agrees to a UCC claim on real estate for shares, now the UCC claim is the assetasset_account can be "Real Estate", "UCC Claim", etc.assetClass can be      "Common Stock",      "Preferred Stock",      "Debt",      "Commodity",      "Merger & Acquisitions",      "Employee"
```
<a name="workingHours"></a>

## workingHours(hoursPerWeek) ⇒ <code>Promise.&lt;{workHoursInYear: number, workHoursInMonth: number}&gt;</code>
Calculates the total working hours in a year and per month based on weekly hours.

**Kind**: global function  
**Returns**: <code>Promise.&lt;{workHoursInYear: number, workHoursInMonth: number}&gt;</code> - An object containing the total work hours in a year and in a month.  

| Param | Type | Description |
| --- | --- | --- |
| hoursPerWeek | <code>number</code> \| <code>string</code> | The number of working hours per week. |

**Example**  
```js
Working hoursThis function is designed to calculate the total number of work hours in a year and an average month, based on a given number of hours worked per week. It takes a single argument, hoursPerWeek, which is expected to be a number (or a value that can be converted to a number).Inside the function, hoursPerWeek is first converted to a number using Number(hoursPerWeek), then multiplied by 52 (the number of weeks in a year) to estimate the total annual work hours. The result is rounded to the nearest whole number using Math.round and stored in the variable hoursPerYear.The function then returns an object with two properties:workHoursInYear: the total number of work hours in a year.workHoursInMonth: the average number of work hours in a month, calculated by dividing the yearly hours by 12 and rounding the result.Although the function is marked as async, it does not currently use any asynchronous operations (like await). This means it behaves synchronously, but could be updated in the future to include asynchronous logic if needed.
```
<a name="payrollPayable"></a>

## payrollPayable(txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Processes a payroll payable transaction by updating the chart of accounts,adding the necessary accounts if they do not exist, and recording the credit and debit entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is processed.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the payroll transaction. |
| amount | <code>number</code> |  | The amount for the payroll payable. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional). |

<a name="accruedInterest"></a>

## accruedInterest(txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records an accrued interest transaction by adding entries to the chart of accounts,and creating corresponding debit and credit entries for interest expense and interest payable.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount of interest to accrue. |
| [company_id] | <code>number</code> | <code>0</code> | Optional company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | Optional office identifier. |

**Example**  
```js
Accrued InterestSee https://www.accountingcoach.com/bonds-payable/explanation/2
```
<a name="interestExpense"></a>

## interestExpense(txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records an interest expense transaction by adding entries to the chart of accounts,and debiting both the Interest Expense and Cash accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount of the interest expense. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional). |

<a name="bondsIssuedWOAccruedInterest"></a>

## bondsIssuedWOAccruedInterest(txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records the issuance of bonds without accrued interest by updating the chart of accounts,increasing both the "Cash" and "Bonds Payable" accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount of the bond issued. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional). |

<a name="bondsIssuedWithAccruedInterest"></a>

## bondsIssuedWithAccruedInterest(txdate, description, amount, interest, [monthsPaidInterest], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records the issuance of bonds with accrued interest in the accounting system.This function adds the necessary accounts (Bonds Payable, Interest Payable, Cash)to the chart of accounts if they do not exist, calculates the accrued interest,and updates the balances for each account accordingly.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date in a recognized date format. |
| description | <code>string</code> |  | A description of the bond issuance transaction. |
| amount | <code>number</code> |  | The principal amount of the bonds issued. |
| interest | <code>number</code> |  | The annual interest rate (as a percentage). |
| [monthsPaidInterest] | <code>number</code> | <code>1</code> | The number of months for which interest has accrued. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional, default is 0). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional, default is 0). |

<a name="bondPremium"></a>

## bondPremium(txdate, description, amount, bondRate, marketRate, maturityDate, [paymentPeriod], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Calculates and records the issuance of a bond at a premium.Adds necessary accounts to the chart of accounts, computes the bond premium,and records the appropriate increases in Cash, Bonds Payable, and Bond Premium accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date of the bond issuance. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The face value (principal) of the bond. |
| bondRate | <code>number</code> |  | The stated (coupon) interest rate of the bond (annual, in percent). |
| marketRate | <code>number</code> |  | The market interest rate at issuance (annual, in percent). |
| maturityDate | <code>string</code> \| <code>Date</code> |  | The maturity date of the bond. |
| [paymentPeriod] | <code>number</code> | <code>6</code> | The number of months between interest payments (default is 6). |
| [company_id] | <code>number</code> | <code>0</code> | The company ID for which the bond is issued. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID for which the bond is issued. |

<a name="bondPremiumInterestPayment"></a>

## bondPremiumInterestPayment(txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records the interest payment for a bond premium by increasing both the Interest Expense and Interest Payable accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date of the interest payment. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount of the interest payment. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional). |

<a name="bondDiscount"></a>

## bondDiscount(txdate, description, amount, bondRate, marketRate, maturityDate, [paymentPeriod], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Calculates and records the issuance of a bond at a discount, including present value calculationsfor coupon payments and face value, and updates relevant accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the bond issuance and related account updates are complete.  
**Throws**:

- <code>Error</code> If an error occurs during the calculation or account updates.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date of the bond issuance. |
| description | <code>string</code> |  | Description of the bond transaction. |
| amount | <code>number</code> |  | The face value (principal) of the bond. |
| bondRate | <code>number</code> |  | The stated (coupon) annual interest rate of the bond (as a percentage). |
| marketRate | <code>number</code> |  | The market annual interest rate at issuance (as a percentage). |
| maturityDate | <code>string</code> \| <code>Date</code> |  | The maturity date of the bond. |
| [paymentPeriod] | <code>number</code> | <code>6</code> | Number of months between interest payments (e.g., 6 for semi-annual). |
| [company_id] | <code>number</code> | <code>0</code> | Optional company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | Optional office identifier. |

<a name="bondDiscount..currentDate"></a>

### bondDiscount~currentDate
paymentPeriod is the number of months between interest payments,e.g. 6 for semi-annual payments, 3 for quarterly payments, 12 for annual payments and 1 for monthly payments.

**Kind**: inner constant of [<code>bondDiscount</code>](#bondDiscount)  
<a name="initializeEquity"></a>

## initializeEquity() ⇒ <code>Promise.&lt;void&gt;</code>
Initializes the equity section of the Chart of Accounts by adding common equity accounts.Accounts added:- Common Shares Par Value- Additional Paid-in Capital- Retained Earnings- Treasury Shares

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when all equity accounts have been added.  
<a name="salesViaPaypal"></a>

## salesViaPaypal(txdate, description, amount, fee, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a sales transaction made via PayPal, including revenue, PayPal asset increase, and bank fee expense.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The sales amount received. |
| fee | <code>number</code> |  | The PayPal fee associated with the transaction. |
| [account] | <code>string</code> | <code>&quot;\&quot;Sales\&quot;&quot;</code> | The revenue account name. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

**Example**  
```js
Receive sales using paypal, with optional specific account.For example,     You made a sale from a specific website, like a cottage food website, and need to keep     track of the total sales does not exceed a maximum as defined by state laws.      So sales are recorded in the separate revenue account
```
<a name="commissionPayable"></a>

## commissionPayable(txdate, description, amount, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a commission payable transaction by creating necessary accounts and posting debit and credit entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount of the commission. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office (optional). |

<a name="commissionPaid"></a>

## commissionPaid(txdate, description, amount, [asset], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a commission payment transaction by updating the relevant accounts:- Adds "Commission Expense" (Expense), "Commission Payable" (Liability), and the specified asset account.- Debits "Commission Payable" and "Commission Expense" accounts.- Credits the specified asset account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the commission payment. |
| amount | <code>number</code> |  | The amount of the commission paid. |
| [asset] | <code>string</code> | <code>&quot;\&quot;Cash\&quot;&quot;</code> | The asset account to credit (default is "Cash"). |
| [company_id] | <code>number</code> | <code>0</code> | The company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | The office identifier. |

**Example**  
```js
See https://www.accountingtools.com/articles/commission-expense-accounting#:~:text=Under%20the%20cash%20basis%20of,commission%20paid%20to%20the%20employee.
```
<a name="allocateFundingAccount"></a>

## allocateFundingAccount(txdate, description, amount, [asset], [equity], [expense], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Allocates funding by creating and updating asset, equity, and expense accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when allocation is complete.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | Amount to allocate. |
| [asset] | <code>string</code> | <code>&quot;\&quot;Cash\&quot;&quot;</code> | Name of the asset account. |
| [equity] | <code>string</code> | <code>&quot;\&quot;FundingAllocation\&quot;&quot;</code> | Name of the equity account. |
| [expense] | <code>string</code> | <code>&quot;\&quot;ApprovalRequest\&quot;&quot;</code> | Name of the expense account. |
| [company_id] | <code>number</code> | <code>0</code> | ID of the company (optional, not used in function). |
| [office_id] | <code>number</code> | <code>0</code> | ID of the office (optional, not used in function). |

**Example**  
```js
In a double-entry accounting system, when allocating funds for a new approval request, you typically use the following ledger accounts:1. Cash/Bank Account: This account tracks the cash or bank balance available in your      organization. When funds are allocated for the new approval request,      you'll debit this account to record the increase in the available funds.2. Funding Allocation Account: This account is used to record the allocation of funds      for specific purposes, projects, or approval requests.      You'll credit this account to indicate that funds have been allocated for the      new request.3. Expense/Approval Request Account: This account tracks the expenses or costs associated      with the approval requests.      When the approval request is approved and the allocated funds are spent,      you'll debit this account to record the expense.Let's illustrate the double-entry accounting entries for allocating funds for a new approval request:1. Initial Balance:   - Cash/Bank Account: $10,000 (Debit)   - Funding Allocation Account: $0 (Credit)   - Approval Request Account: $0 (Credit)   - Payment Account: $0 (Credit)2. Funding Allocation for New Approval Request:   - Cash/Bank Account: $10,000 (Debit)   - Funding Allocation Account: $1,000 (Credit)   - Approval Request Account: $0 (Credit)   - Payment Account: $0 (Credit)3. When the Approval Request is Approved and Funds are Spent:   - Cash/Bank Account: $9,000 (Debit) -> Actual cash spent on the approval request   - Funding Allocation Account: $0 (Debit) -> Funds used up   - Approval Request Account: $1,000 (Debit) -> Expense incurred   - Payment Account: $1,000 (Credit) -> Payment made for the approval requestThe Payment Account is used to record the payment made (credit entry) when funds are spent for the approved approval request. This completes the accounting entries, showing the flow of funds from the Cash/Bank Account to the Funding Allocation Account, Approval Request Account, and finally, to the Payment Account.Please note that the specific account names and chart of accounts might vary based on your organization's accounting system and practices. Always consult with your accounting department or a certified accountant to ensure accurate and compliant bookkeeping for your business.
```
<a name="spendFundingAccount"></a>

## spendFundingAccount(txdate, description, amount, [payable], [equity], [expense], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a funding allocation transaction by updating the relevant accounts:- Adds the specified accounts to the chart of accounts if they do not exist.- Credits the payable account.- Debits the funding allocation (equity) and approval request (expense) accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount to be recorded. |
| [payable] | <code>string</code> | <code>&quot;\&quot;AccountPayable\&quot;&quot;</code> | The name of the payable account. |
| [equity] | <code>string</code> | <code>&quot;\&quot;FundingAllocation\&quot;&quot;</code> | The name of the equity account. |
| [expense] | <code>string</code> | <code>&quot;\&quot;ApprovalRequest\&quot;&quot;</code> | The name of the expense account. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID (optional, default is 0). |
| [office_id] | <code>number</code> | <code>0</code> | The office ID (optional, default is 0). |

<a name="softwareLicense"></a>

## softwareLicense(txdate, description, amount, fee, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a software license transaction involving cryptocurrency, sales, transaction fees, and accounts receivable.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount for the main transaction. |
| fee | <code>number</code> |  | The transaction fee amount. |
| [account] | <code>string</code> | <code>&quot;\&quot;Cryptocurrency\&quot;&quot;</code> | The asset account to receive the monies |
| [company_id] | <code>number</code> | <code>0</code> | Optional company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | Optional office identifier. |

**Example**  
```js
When a software license is sold as an NFT and the payment is made using cryptocurrency, the accounting treatment involves recognizing both the sale of the NFT and the receipt of cryptocurrency. Here's a general example based on accrual accounting principles:1. Record Revenue from NFT Sale:   - Debit: Cryptocurrency Asset (to recognize the increase in cryptocurrency)   - Credit: Sales Revenue (to recognize the revenue from the sale of the NFT)2. Recognize Revenue (if applicable):   If the software license provides future services or updates, and revenue recognition criteria are not met immediately, you may initially record unearned revenue:   - Debit: Unearned Revenue   - Credit: Sales Revenue3. Recognize Cryptocurrency Received:   - Debit: Cryptocurrency Asset (to recognize the receipt of cryptocurrency)   - Credit: Accounts Receivable or Cash (depending on whether the payment is immediate or if there is a delay)4. Record Any Transaction Fees:   If there are transaction fees associated with receiving cryptocurrency, record them:   - Debit: Transaction Fees Expense   - Credit: Cryptocurrency Asset (to reduce the amount received)5. Recognize Revenue (if applicable):   Once the revenue recognition criteria are met, move the unearned revenue to recognized revenue:   - Debit: Unearned Revenue   - Credit: Sales Revenue6. Fair Value Consideration:   Cryptocurrency values can be volatile, so it's important to consider fair value adjustments. If there are significant fluctuations in the value of the cryptocurrency between   the time of the sale and receipt, you may need to adjust the value of the cryptocurrency asset.Keep in mind that accounting for cryptocurrency transactions can be complex due to the volatility of cryptocurrency values and regulatory considerations. 
```
<a name="exchangeCryptocurrencyToUSD"></a>

## exchangeCryptocurrencyToUSD(txdate, description, amount, fee, [gainLoss], [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Exchanges cryptocurrency to USD and records the transaction in the accounting system.This function handles the accounting entries for exchanging cryptocurrency to USD,including handling transaction fees and gain/loss on the exchange.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The date of the transaction. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount of cryptocurrency exchanged to USD. |
| fee | <code>number</code> |  | The transaction fee for the exchange. |
| [gainLoss] | <code>number</code> | <code>0</code> | The gain or loss from the exchange (positive for gain, negative for loss). |
| [account] | <code>string</code> | <code>&quot;&#x27;Cash&#x27;&quot;</code> | The account to debit/credit (default is 'Cash'). |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

**Example**  
```js
When you exchange cryptocurrency for USD (U.S. Dollars), you'll need to record the transaction in your accounting records. Here's a general example based on accrual accounting principles:1. Record the Sale of Cryptocurrency:   - Debit: Cash (or Bank Account) - to increase the USD balance   - Credit: Cryptocurrency Asset - to decrease the value of the cryptocurrency being sold2. Recognize Gain or Loss:   If there is a gain or loss on the exchange due to changes in the value of the cryptocurrency, you may need to recognize it:   - Debit or Credit: Gain or Loss on Cryptocurrency Exchange - to capture any difference between the value of the cryptocurrency when acquired and its value when exchanged3. Record Any Transaction Fees:   If there are fees associated with the cryptocurrency exchange, record them separately:   - Debit: Transaction Fees Expense   - Credit: Cash (or Bank Account) - to reduce the amount receivedHere's an example of the journal entry:| Account                                 | Debit ($)  | Credit ($) ||-----------------------------------------|------------|------------|| Cash or Bank Account                    | XXXX       |            || Cryptocurrency Asset                    |            | XXXX       || Gain or Loss on Cryptocurrency Exchange |  (or)      |  (or)      || Transaction Fees Expense                | XXXX       |            |Please note that the specific accounts and amounts will depend on the details of your transaction, such as the amount of cryptocurrency exchanged, any fees incurred, and whether there is a gain or loss on the exchange.It's essential to consult with an accountant or financial professional, especially when dealing with cryptocurrency transactions, as accounting treatment may vary based on specific circumstances and regulations. Additionally, fair value adjustments may be necessary if there are significant fluctuations in the value of the cryptocurrency.
```
<a name="exchangeUSDToCryptocurrency"></a>

## exchangeUSDToCryptocurrency(txdate, description, amount, fee, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Exchanges a specified USD amount to cryptocurrency, recording the transaction and associated fee in the accounting system.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is successfully recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The date of the transaction. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The amount in USD to be exchanged for cryptocurrency. |
| fee | <code>number</code> |  | The transaction fee in USD. |
| [account] | <code>string</code> | <code>&quot;&#x27;Cash&#x27;&quot;</code> | The account name from which the USD is debited. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office associated with the transaction. |

**Example**  
```js
When you exchange USD (U.S. Dollars) for cryptocurrency, you'll need to record the transaction in your accounting records. Here's a general example based on accrual accounting principles:1. Record the Purchase of Cryptocurrency:   - Debit: Cryptocurrency Asset - to increase the value of the cryptocurrency acquired   - Credit: Cash (or Bank Account) - to decrease the USD balance2. Recognize Any Transaction Fees:   If there are fees associated with the cryptocurrency purchase, record them separately:   - Debit: Cryptocurrency Asset - to increase the cost basis of the cryptocurrency   - Credit: Cash (or Bank Account) - to reduce the amount spentHere's an example of the journal entry:| Account                            | Debit ($)  | Credit ($) ||------------------------------------|------------|------------|| Cryptocurrency Asset               | XXXX       |            || Cash or Bank Account               |            | XXXX       || Transaction Fees Expense           | XXXX       |            |Please note that the specific accounts and amounts will depend on the details of your transaction, such as the amount of cryptocurrency purchased and any associated fees.It's important to consult with an accountant or financial professional when recording cryptocurrency transactions, as accounting treatment may vary based on specific circumstances and regulations. Additionally, fair value adjustments may be necessary if there are significant fluctuations in the value of the cryptocurrency.
```
<a name="googleAdsenseEarning"></a>

## googleAdsenseEarning(txdate, description, amount, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a Google AdSense earning as a revenue transaction.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> \| <code>Date</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount earned. |
| [account] | <code>string</code> | <code>&quot;&#x27;Google Adsense Revenue&#x27;&quot;</code> | The account name to credit. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

**Example**  
```js
Bookkeeping Entry for Google AdSense Earnings:Date: [Date of transaction]1. Initial Google AdSense Earnings:   - Account Credit: Google AdSense Revenue   - Amount: [Amount earned from Google AdSense]2. Upon Reaching Threshold Balance:   - Account Debit: Google AdSense Revenue   - Account Credit: Accounts Receivable (or Bank Account)   - Amount: [Threshold balance reached, typically $100]3. When Monies Received:   - Account Debit: Accounts Receivable (if applicable)   - Account Credit: Bank Account   - Amount: [Amount received from Google AdSense]Note: Ensure to record the transactions accurately, with appropriate dates and amounts. Adjust accounts based on your specific bookkeeping system and accounting practices.Account Types:Google AdSense Revenue   Type: Credit (Revenue account)Accounts Receivable      Type: Debit (Asset account)Bank Account             Type: Debit (Asset account)
```
<a name="googleAdsensePayout"></a>

## googleAdsensePayout(txdate, description, amount, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a Google Adsense payout transaction by updating the chart of accounts and creating corresponding debit and credit entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | A description of the transaction. |
| amount | <code>number</code> |  | The payout amount. |
| [account] | <code>string</code> | <code>&quot;&#x27;Google Adsense Revenue&#x27;&quot;</code> | The revenue account name. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

<a name="googleAdsenseReceivePayout"></a>

## googleAdsenseReceivePayout(txdate, description, amount, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a Google AdSense payout transaction by updating the chart of accounts,adding the necessary bank and asset accounts, and creating corresponding debit and credit entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the payout is successfully recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The payout amount. |
| [account] | <code>string</code> | <code>&quot;&#x27;Bank&#x27;&quot;</code> | The bank account name to receive the payout. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

<a name="addFundsToPostageDebitAccount"></a>

## addFundsToPostageDebitAccount(txdate, description, amount, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Adds funds to the "Postage Debit Account" by recording a debit in the asset accountand a corresponding credit in the specified bank account.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is successfully recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date in a valid date format. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount to be added to the postage debit account. |
| [account] | <code>string</code> | <code>&quot;&#x27;Bank&#x27;&quot;</code> | The name of the bank account to credit. |
| [company_id] | <code>number</code> | <code>0</code> | The company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | The office identifier. |

**Example**  
```js
Initial Transfer EntryDebit: Postage Debit Account ($1,000)Credit: Cash/Bank Account ($1,000)To record the transactions involving the CFO transferring funds to the postage debit account and the subsequent deductions for each letter or package sent by the mailroom, you would typically use a double-entry bookkeeping system. Here's how you might record these transactions:1. **Initial Transfer from CFO to Postage Debit Account:**      Debit: Postage Debit Account   Credit: Cash/Bank Account   This entry reflects the transfer of funds from the CFO to the postage debit account.2. **Cost Deduction for Sending Mail:**   Debit: Postage Expense Account   Credit: Postage Debit AccountThis entry records the expense incurred by the mailroom for sending mail. The amount is deducted from the postage debit account.Let's say, for example, the CFO transfers $1,000 to the postage debit account initially, and then the mailroom sends a package costing $50 in postage:1. **Initial Transfer Entry:**      Debit: Postage Debit Account ($1,000)   Credit: Cash/Bank Account ($1,000)2. **Cost Deduction Entry for Sending Mail:**   Debit: Postage Expense Account ($50)   Credit: Postage Debit Account ($50)These entries ensure that the transactions are accurately recorded, reflecting both the transfer of funds and the associated expenses incurred by the mailroom.
```
<a name="postageExpense"></a>

## postageExpense(txdate, description, amount, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a postage expense transaction by updating the Chart of Accounts and creating corresponding debit and credit entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount of the postage expense. |
| [account] | <code>string</code> | <code>&quot;&#x27;Postage Expense Account&#x27;&quot;</code> | The expense account name. |
| [company_id] | <code>number</code> | <code>0</code> | The company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | The office identifier. |

**Example**  
```js
Cost Deduction Entry for Sending MailDebit: Postage Expense Account ($50)Credit: Postage Debit Account ($50)
```
<a name="pendingPurchase"></a>

## pendingPurchase(txdate, description, amount, [expense], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a pending purchase transaction by creating necessary chart of accounts entries,and posting corresponding debit and credit journal entries.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date in a recognized date format. |
| description | <code>string</code> |  | A description of the purchase. |
| amount | <code>number</code> |  | The amount of the purchase. |
| [expense] | <code>string</code> | <code>&quot;&#x27;Expense Account&#x27;&quot;</code> | The name of the expense account to debit. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office associated with the transaction. |

<a name="pendingPurchaseCleared"></a>

## pendingPurchaseCleared(txdate, description, amount, [bank], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Clears a pending purchase by recording the appropriate debit and credit transactions.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | The description of the transaction. |
| amount | <code>number</code> |  | The amount of the transaction. |
| [bank] | <code>string</code> | <code>&quot;&#x27;Bank&#x27;&quot;</code> | The name of the bank account to use. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID associated with the transaction. |
| [office_id] | <code>number</code> | <code>0</code> | The office ID associated with the transaction. |

<a name="pendingPurchaseSettled"></a>

## pendingPurchaseSettled(txdate, description, amount, [bank], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Marks a pending purchase as settled by clearing it.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the purchase has been settled.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | The description of the purchase. |
| amount | <code>number</code> |  | The amount of the purchase. |
| [bank] | <code>string</code> | <code>&quot;&#x27;Bank&#x27;&quot;</code> | The bank associated with the purchase. |
| [company_id] | <code>number</code> | <code>0</code> | The ID of the company. |
| [office_id] | <code>number</code> | <code>0</code> | The ID of the office. |

<a name="apic"></a>

## apic(txdate, description, price, numberOfShares, [parValue], [company_id], [office_id], [user]) ⇒ <code>Promise.&lt;void&gt;</code>
To calculate the Additional Paid-In Capital (APIC), we need to compute the difference between the price at which the shares were sold and the par value of the shares. If the price is greater than the par value, that difference multiplied by the number of shares will give the APIC amount.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| price | <code>number</code> |  | Price per share paid by the investor. |
| numberOfShares | <code>number</code> |  | Number of shares issued. |
| [parValue] | <code>number</code> | <code>5</code> | Par value per share (default is 5). |
| [company_id] | <code>number</code> | <code>0</code> | ID of the company (default is 0). |
| [office_id] | <code>number</code> | <code>0</code> | ID of the office (default is 0). |
| [user] | <code>number</code> | <code>0</code> | ID of the user performing the transaction (default is 0). |

**Example**  
```js
Here's how you can calculate and handle APIC in the contribution method:Formula for APIC:    APIC=(Price−Par Value)×Number of SharesCompany issues 1,000 shares at $10/share, par value is $5.| Account                           | Debit    | Credit  || --------------------------------- | -------- | ------- || Cash                              |  $10,000 |         || Common Stock (Par Value)          |          |  $5,000 || Additional Paid-In Capital (APIC) |          |  $5,000 |
```
<a name="uccLienNew"></a>

## uccLienNew(txdate, description, amount, uccNo, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records a new UCC lien transaction by updating relevant accounts:- Adds necessary accounts to the chart of accounts if they do not exist.- Decreases revenue, increases accounts receivable, bad debt expense, and allowance for doubtful accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | The transaction description. |
| amount | <code>number</code> |  | The amount for the transaction. |
| uccNo | <code>string</code> |  | The UCC lien number. |
| [account] | <code>string</code> | <code>&quot;\&quot;Account Receivables\&quot;&quot;</code> | The account name for receivables. |
| [company_id] | <code>number</code> | <code>0</code> | The company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | The office identifier. |

**Example**  
```js
If a business files a **UCC lien** on another business for **unpaid revenue**, it likely means the creditor (filing business) is trying to secure payment for money owed, such as unpaid invoices or contractual obligations. This situation is usually related to **accounts receivable** or a **breach of contract for revenue owed**.  Bookkeeping Entries for the Creditor (Filing Business)If the business is owed revenue and has filed a UCC lien to secure the claim, it records the receivable:  1. Recording the Unpaid Revenue (Accounts Receivable)         Dr. Accounts Receivable         $50,000               Cr. Revenue                   $50,000       Dr. Accounts Receivable** → Recognizes the amount the other business owes.       Cr. Revenue** → Recognizes the revenue earned but not received.  2. Filing the UCC Lien (Securing the Debt)The lien itself is not a direct financial transaction but rather a legal claim. However, to track the lien, the business may create a memo entry or an "Allowance for Doubtful Accounts" if there's uncertainty about collection:           Dr. Bad Debt Expense             $50,000               Cr. Allowance for Doubtful Accounts  $50,000       Dr. Bad Debt Expense** → Recognizes potential loss if the debt is uncollectible.       Cr. Allowance for Doubtful Accounts** → Adjusts expected collectibility.  
```
<a name="uccLienAccruedInterest"></a>

## uccLienAccruedInterest(txdate, description, amount, [account], [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records accrued interest for a UCC lien transaction by updating the chart of accountsand adjusting the relevant asset and revenue accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The amount to increase in the asset account. |
| [account] | <code>string</code> | <code>&quot;\&quot;Interest Receivable\&quot;&quot;</code> | The asset account to be used. |
| [company_id] | <code>number</code> | <code>0</code> | The company identifier. |
| [office_id] | <code>number</code> | <code>0</code> | The office identifier. |

**Example**  
```js
Accruing Interest on the Outstanding DebtIf the lien allows interest to accrue (e.g., 10% annual interest), record the monthly interest earned:     Dr. Interest Receivable         $417           Cr. Interest Income           $417  (Assuming $50,000 × 10% ÷ 12 months = $417 per month) Dr. Interest Receivable → Tracks interest due from the debtor. Cr. Interest Income → Recognizes earned interest. Repeat this entry each month the debt remains unpaid.
```
<a name="uccLienPaid"></a>

## uccLienPaid(txdate, description, amount, [interest], [account], uccNo, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Records the payment of a UCC lien by updating relevant asset accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the transaction is recorded.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | Description of the transaction. |
| amount | <code>number</code> |  | The principal amount paid. |
| [interest] | <code>number</code> | <code>0</code> | The interest amount paid (optional). |
| [account] | <code>string</code> | <code>&quot;\&quot;Account Receivable\&quot;&quot;</code> | The receivable account name (optional). |
| uccNo | <code>string</code> |  | The UCC lien number. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID (optional). |
| [office_id] | <code>number</code> | <code>0</code> | The office ID (optional). |

**Example**  
```js
If the Debt is Paid After the LienWhen the business receives payment, reverse the receivable and record cash:       Dr. Cash                         $50,000           Cr. Accounts Receivable         $50,000   Dr. Cash** → Increases cash balance.   Cr. Accounts Receivable** → Clears the debt from the books.  
```
<a name="uccLienWriteOff"></a>

## uccLienWriteOff(txdate, description, amount, [account], uccNo, [company_id], [office_id]) ⇒ <code>Promise.&lt;void&gt;</code>
Writes off a UCC lien by adjusting the relevant accounts: decreases Accounts Receivable and Interest Receivable,and increases Allowance for Doubtful Accounts.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the write-off is complete.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| txdate | <code>string</code> |  | The transaction date. |
| description | <code>string</code> |  | The transaction description. |
| amount | <code>number</code> |  | The amount to write off. |
| [account] | <code>string</code> | <code>&quot;\&quot;Account Receivable\&quot;&quot;</code> | The account to decrease (default is "Account Receivable"). |
| uccNo | <code>string</code> \| <code>number</code> |  | The UCC lien number. |
| [company_id] | <code>number</code> | <code>0</code> | The company ID (default is 0). |
| [office_id] | <code>number</code> | <code>0</code> | The office ID (default is 0). |

**Example**  
```js
If the Debt is Written OffIf the debtor fails to pay and the lien does not result in collection:       Dr. Allowance for Doubtful Accounts  $50,000           Cr. Accounts Receivable         $50,000  Dr. Allowance for Doubtful Accounts** → Removes the expected bad debt.  Cr. Accounts Receivable** → Writes off the uncollectible balance.  
```
<a name="mrr"></a>

## mrr()
MRR: Monthly Recurring RevenueThis function records the MRR by recognizing unearned revenue and increasing accounts receivable.ASC 606 (Revenue from Contracts with Customers) governs the recognition of MRR.Specifically, ASC 606-10-25 (Recognition: Identifying Performance Obligations) andASC 606-10-45 (Presentation: Contract Assets and Contract Liabilities) apply.Under ASC 606, revenue is recognized when control of goods or services is transferred to the customer,and unearned revenue (contract liability) is recognized when cash or receivable is recorded before performance.

**Kind**: global function  
<a name="mrrEarned"></a>

## mrrEarned()
MRR: Monthly Recurring Revenue EarnedThis function records the earned MRR by recognizing revenue and reducing unearned revenue.ASC 606 (Revenue from Contracts with Customers) governs the recognition of earned MRR.Specifically, ASC 606-10-25 (Recognition: Identifying Performance Obligations) andASC 606-10-45 (Presentation: Contract Assets and Contract Liabilities) apply.Under ASC 606, revenue is recognized when control of goods or services is transferred to the customer,and unearned revenue (contract liability) is reduced as performance obligations are satisfied.

**Kind**: global function  
<a name="mrrReceived"></a>

## mrrReceived()
MRR: Monthly Recurring Revenue ReceivedThis function records the received MRR by recognizing cash and reducing accounts receivable.ASC 606-10-25 (Revenue from Contracts with Customers) governs the recognition of revenue, including MRR.When cash is received for previously invoiced MRR, ASC 606-10-45-1 (Presentation: Contract Assets and Contract Liabilities) applies.The reduction of accounts receivable and increase in cash is a standard receivables settlement under ASC 606.

**Kind**: global function  
<a name="cmrr"></a>

## cmrr()
Recording CMRR (Committed Monthly Recurring Revenue)CMRR adjusts MRR by accounting for committed changes, including:Expansions (Upsells)Contractions (Downgrades)Churn (Cancellations)Scenario:A customer upgrades their subscription from $500 to $700 next month.Another customer cancels a $200 plan effective next month.Adjustment Entry for Future Revenue Commitment (CMRR Update):     CMRR Adjustment (Off-Balance Sheet)   $200  This adjustment does not impact financial statements immediately but helps forecast future revenue trends.ASC 606-10-25 (Revenue from Contracts with Customers) governs the recognition of CMRR.

**Kind**: global function  
<a name="locationAdd"></a>

## locationAdd(location, region) ⇒ <code>Promise.&lt;any&gt;</code>
Adds a new location with its region to the database, or updates the region if the location already exists.

**Kind**: global function  
**Returns**: <code>Promise.&lt;any&gt;</code> - The result of the database insert or update operation.  

| Param | Type | Description |
| --- | --- | --- |
| location | <code>string</code> | The name of the location to add or update. |
| region | <code>string</code> | The region associated with the location. |

<a name="locationUpdate"></a>

## locationUpdate(name, type, locationId) ⇒ <code>Promise.&lt;\*&gt;</code>
Updates the location ID for a specific account in the ledger.

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The result of the update operation.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the account to update. |
| type | <code>string</code> | The type of the account to update. |
| locationId | <code>number</code> \| <code>string</code> | The new location ID to set for the account. |

<a name="locationDelete"></a>

## locationDelete(locationId) ⇒ <code>Promise.&lt;\*&gt;</code>
Deletes a location from the database if it does not exist in the ledger table.

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The result of the delete operation.  
**Throws**:

- Will log an error if the deletion fails.


| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>number</code> \| <code>string</code> | The ID of the location to delete. |

<a name="locationDeleteByName"></a>

## locationDeleteByName(name) ⇒ <code>Promise.&lt;\*&gt;</code>
Deletes a location from the 'locations' table based on the account name,only if there are no other ledger entries referencing that location.

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The result of the delete operation.  
**Throws**:

- Will log an error if the operation fails.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The account name used to find the associated location. |

<a name="Inventory"></a>

## Inventory : <code>Object</code>
A mapping of account type names to their corresponding class constructors.The map supports both direct class references and inline class definitions for specific account types.Some account types (e.g., ContraAsset, ContraLiability) are mapped to their base class.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Revenue | <code>Class</code> | Represents a revenue account. |
| ContraRevenue | <code>Class</code> | Represents a contra revenue account (same as Revenue). |
| Withdrawals | <code>Class</code> | Represents a withdrawals account. |
| Journal | <code>Class</code> | Represents a journal account. |
| Bank | <code>Class</code> | Represents a bank account (same as Cash). |
| Cash | <code>Class</code> | Represents a cash account. |
| DigitalCurrency | <code>Class</code> | Represents a digital currency account (same as Cash). |
| Credit | <code>Class</code> | Represents a credit account. |
| Investment | <code>Class</code> | Represents an investment account. |

