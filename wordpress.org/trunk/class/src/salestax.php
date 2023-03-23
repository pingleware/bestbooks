<?php
/**
 * SalesTaxPayable class definition
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc. 
 */
/**
 * SalesTaxPayable class definition extending Expense base class
 */
class SalesTaxPayable extends Expense {
    /**
     * Class constructor
     * 
     * @param string $state Sales State jurisdiction
     */
    public function __construct($state) {
        parent::__construct($state." Sales Tax Payable");
    }
}
?>