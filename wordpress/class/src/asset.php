<?php
/**
 * See: http://www.keynotesupport.com/accounting/accounting-basics-debits-credits.shtml
 * 
 * Asset and Expense
 * -----------------
 * Because Asset and Expense accounts maintain positive balances, 
 * they are positive, or debit accounts. Accounting books will say 
 * “Accounts that normally have a positive balance are increased with a Debit 
 * and decreased with a Credit.” Of course they are! Look at the number line. 
 * If you add a positive number (debit) to a positive number, 
 * you get a bigger positive number. But if you start with a positive number 
 * and add a negative number (credit), you get a smaller positive number 
 * (you move left on the number line). The asset account called Cash, 
 * or the checking account, is unique in that it routinely receives debits 
 * and credits, but its goal is to maintain a positive balance.
 * 
 */

class Asset extends Ledger {
   public function __construct($name,$type="Asset") {
      parent::__construct($name,$type);
   }
   
   /**
    * A debit is an accounting entry that either increases an asset or expense account, 
    * or decreases a liability or equity account. It is positioned to the left in an accounting entry.
    */
    function increase($date,$desc,$amount) {
      $balance = parent::getBalance() + floatval($amount);
      parent::setBalance($balance);
      return parent::addDebit($date,$desc,$amount);
   }

   function debit($date,$desc,$amount) {
      return $this->increase($date,$desc,$amount);
   }
   
   /**
    * A credit is an accounting entry that either increases a liability or equity account, 
    * or decreases an asset or expense account. It is positioned to the right in an accounting entry.
    */
   function decrease($date,$desc,$amount) {
      $balance = parent::getBalance() - $amount;
      parent::setBalance($balance);
      return parent::addCredit($date,$desc,$amount);
   }

   function credit($date,$desc,$amount) {
      return $this->decrease($date,$desc,$amount);
   }
   
   function getAccountBaseType() {
       return 'Asset';
   }
}
?>