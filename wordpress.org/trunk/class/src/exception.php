<?php
/**
 * BestBooksException class definition
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * BestBooksException class definition derived from the Exception base class
 */
class BestBooksException extends Exception {
    // Redefine the exception so message isn't optional
    /**
     * Class constructor
     * 
     * @param string $message Exception message
     * @param integer $code Exception code
     */
    public function __construct($message, $code = 0) {
        // some code

        // make sure everything is assigned properly
        parent::__construct($message, $code);
    }

    // custom string representation of object
    /**
     * Returns a string representation of the exception
     * 
     * @return string Exception message in human readable format
     */
    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}

?>