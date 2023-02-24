<?php
/**
 * The definition of the Withdrawals class derived from the Expense base class.
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc. 
 */
/**
 * Withdrawals class definition derived from Expense base class
 */
class Withdrawals extends Expense {
    /**
     * Constructor method
     * 
     * @param string $name Account name
     */
    public function __construct($name) {
        parent::__construct($name);
    }
}

?>