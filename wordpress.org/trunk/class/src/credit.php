<?php
/**
 * Credit class definition
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc. 
 */
/**
 * Credit class definition derived from Liability base class
 */
class Credit extends Liability {
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