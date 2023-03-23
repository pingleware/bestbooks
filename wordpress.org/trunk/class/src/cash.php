<?php
/**
 * The Cash account class derived from the Asset class
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * Cash class definition derived from te Asset base class
 */
class Cash extends Asset {
    /**
     * Class constructor
     * 
     * @param string $name Account name
     */
    public function __construct($name) {
        parent::__construct($name);
    }
}

?>