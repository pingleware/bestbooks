<?php
/**
 * TAccount
 * 
 * A T-account is an informal term for a set of financial records that use double-entry bookkeeping. The term T-account describes the appearance of the bookkeeping entries. If a large letter T were drawn on the page, the account title would appear just above the T, debits would be listed under the top line of the T on the left side and the credits would be listed under the top line of the T on the right side, with the middle line separating the debits from the credits.
 *
 * Read more: T-Account | Investopedia https://www.investopedia.com/terms/t/t-account.asp#ixzz5RqRRq5X3
 *
 * Follow us: Investopedia on Facebook
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * TAccount abstract class definition
 */
abstract class TAccount {
    /**
     * Gets the account name
     * 
     * @return string Account name
     */
    abstract function getName();
    /**
     * Gets the account type
     * 
     * @return string Account type
     */
    abstract function getType();
    /**
     * Makes a debit entry in the specified account ledger
     * 
     * @param string $date Transaction date
     * @param string $desc Transaction description
     * @param double $amount Transaction amount
     */
    abstract function addDebit($date,$desc,$amount);
    /**
     * Makes a credit entry in the specified account ledger
     * 
     * @param string $date Transaction date
     * @param string $desc Transaction description
     * @param double $amount Transaction amount
     */
    abstract function addCredit($date,$desc,$amount);
    /**
     * Gets the last debit entry amount
     * 
     * @return double Last debit entry amount
     */
    abstract function getDebit();
    /**
     * Gets the last credit entry amount
     * 
     * @return double Last credit entry amount
     */
    abstract function getCredit();
    /**
     * Gets the account current balance
     * 
     * @return double Current balance
     */
    abstract function getBalance();
}


?>