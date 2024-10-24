<?php
/*
 * Database Interface
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */

 interface BestBooks_DB {
     public function BeginTrans();
     public function Close();
     public function CommitTrans();
     public function CreateDynaset();
     public function CreateQueryDef();
     public function DeleteQueryDef();
     public function Execute();
     public function ExecuteSQL();
     public function ListFields();
     public function ListTables();
     public function OpenQueryDef();
     public function OpenTable();
     public function Rollback();
 }