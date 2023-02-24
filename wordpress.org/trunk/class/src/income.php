<?php
/**
 * Income class defintiion
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * Income class definition derived from the Revenue base class
 */
class Income extends Revenue {
    /**
     * Class constructor
     * 
     * @param string $name Account name
     */
	public function __construct($name) {
		parent::__construct($name,"Income");
	}
}

?>