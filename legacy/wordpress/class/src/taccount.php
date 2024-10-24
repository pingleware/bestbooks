<?php

/**
 * TAccount
 */
abstract class TAccount {
   abstract function getName();
   abstract function getType();
   
   abstract function addDebit($date,$desc,$amount);
   abstract function addCredit($data,$desc,$amount);
   
   abstract function getDebit();
   abstract function getCredit();
   
   abstract function getBalance();
}


?>