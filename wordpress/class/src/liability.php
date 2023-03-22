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
 */


class Liability extends Ledger {
    public function __construct($name,$type="Liability") {
      parent::__construct($name,$type);
    }
   
    /**
    * A credit is an accounting entry that either increases a liability or equity account, 
    * or decreases an asset or expense account. It is positioned to the right in an accounting entry.
    */
    function increase($date,$desc,$amount) {
      $balance = parent::getBalance() + floatval($amount);
      parent::setBalance($balance);
        //$journal = new Journal();
        //$journal->add($date,0,$this->name,0.00,$amount);
      return parent::addCredit($date,$desc,$amount);
    }

    function credit($date,$desc,$amount) {
      return $this->increase($date,$desc,$amount);
    }
   
    /**
    * A debit is an accounting entry that either increases an asset or expense account, 
    * or decreases a liability or equity account. It is positioned to the left in an accounting entry.
    */
    function decrease($date,$desc,$amount) {
      $balance = parent::getBalance() - $amount;
      parent::setBalance($balance);
        //$journal = new Journal();
        //$journal->add($date,0,$this->name,$amount,0.00);
      return parent::addDebit($date,$desc,$amount);
    }

    function debit($date,$desc,$amount) {
      return $this->decrease($date,$desc,$amount);
    }
   
   function getAccountBaseType() {
       return 'Liability';
   }
}

?>