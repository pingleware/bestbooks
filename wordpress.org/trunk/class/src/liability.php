<?php
/**
 * See: http://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
 * 
 * Liabilities, Equity, and Revenue
 * --------------------------------
 * Liability, Equity, and Revenue accounts usually receive credits, 
 * so they maintain negative balances. They are called credit accounts. 
 * Accounting books will say “Accounts that normally maintain a negative balance 
 * are increased with a Credit and decreased with a Debit.” 
 * Again, look at the number line. 
 * If you add a negative number (credit) to a negative number, 
 * you get a larger negative number! (moving left on the number line). 
 * But if you start with a negative number and add a positive number to it (debit), 
 * you get a smaller negative number because you move to the right on the number line.
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */

/**
 * Liability class derived from Ledger base class
 */
class Liability extends Ledger {
  /**
   * Constructor method
   * 
   * @param string $name Account name
   * @param string $type Account type
   */
  public function __construct($name,$type="Liability") {
      parent::__construct($name,$type);
  }
  
  /**
   * Makes an increase for this Liability account
   *
   * A credit is an accounting entry that either increases a liability or equity account, 
   * or decreases an asset or expense account. 
   * It is positioned to the right in an accounting entry.
   * 
   * @param string $date Transaction date
   * @param string $desc Transaction description
   * @param double $amount Transaction amount
   */
  function increase($date,$desc,$amount) {
    $balance = parent::getBalance() - $amount;
    parent::setBalance($balance);
    return parent::addCredit($date,$desc,$amount);
  }
  
  /**
   * Makes an decrease for this Liability account
   *
   * A debit is an accounting entry that either increases an asset or expense account, 
   * or decreases a liability or equity account. 
   * It is positioned to the left in an accounting entry.
   *    
   * @param string $date Transaction date
   * @param string $desc Transaction description
   * @param double $amount Transaction amount
   */
  function decrease($date,$desc,$amount) {
    $balance = parent::getBalance() + $amount;
    parent::setBalance($balance);
    return parent::addDebit($date,$desc,$amount);
  }
  
  /**
   * Gets this Liability base account type
   * 
   * @return string Returns the based liability type
   */
  function getAccountBaseType() {
      return 'Liability';
  }
   

    function credit($date,$desc,$amount) {
      return $this->increase($date,$desc,$amount);
    }
   

    function debit($date,$desc,$amount) {
      return $this->decrease($date,$desc,$amount);
    }
  
}

?>