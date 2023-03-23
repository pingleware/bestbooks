<?php
/**
 * The Bank asset class derived from Cash asset class
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * Bank class definition derived from the Cash asset base class
 */
class Bank extends Cash {
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