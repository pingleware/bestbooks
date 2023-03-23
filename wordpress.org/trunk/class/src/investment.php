<?php
/**
 * Investment class
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * Investment class definition derived from the Asset base class
 */
class Investment extends Asset {
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