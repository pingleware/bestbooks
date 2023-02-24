<?php
/**
 * A journal is a detailed account that records all the financial transactions of a business, to be used for future reconciling of and transfer to other official accounting records, such as the general ledger
 * 
 * Read more: Journal https://www.investopedia.com/terms/j/journal.asp#ixzz5RqZ8UckN
 *
 * Follow us: Investopedia on Facebook
 *
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */

 /**
  * Journal class
  */
class Journal {
  private $name = '';
  /**
   * Class constructor
   */
  public function __construct($name = 'General Journal') {
    $this->name = $name;
  }
  
  /**
   * Adds a transaction entry to the journal
   * 
   * @param string $date Transaction date
   * @param string $ref Transaction description reference
   * @param string $account Account name
   * @param double $debit Transaction debit amount
   * @param double $credit Transaction credit amount
   * 
   * @return integer $id Journal post id
   */
  public function add($date,$ref,$account,$debit,$credit) {
   	global $wpdb;

    $sql = "INSERT INTO ".bestbooks_get_wpdb_prefix()."bestbooks_journal (name,txdate,ref,account,debit,credit) VALUES ('$this->name','$date','$ref','$account','$debit','$credit')";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "INSERT INTO ".$wpdb->base_prefix."bestbooks_journal (name,txdate,ref,account,debit,credit) VALUES ('$this->name','$date','$ref','$account','$debit','$credit')";
      } else {
        $sql = "INSERT INTO ".$wpdb->prefix."bestbooks_journal (name,txdate,ref,account,debit,credit) VALUES ('$this->name','$date','$ref','$account','$debit','$credit')";
      }
    } else {
      $sql = "INSERT INTO ".$wpdb->prefix."bestbooks_journal (name,txdate,ref,account,debit,credit) VALUES ('$this->name','$date','$ref','$account','$debit','$credit')";
    }
    */
  
    $result = $wpdb->query($sql);
		$journal_insert_id = $wpdb->insert_id;

    if ($result===false) {
	    throw new BestBooksException("Journal record insertion error: ".$sql);
    }
    return $journal_insert_id;
  }

  public function update($id,$date,$account,$debit,$credit,$ref=0) {
    global $wpdb;

    $sql = "UPDATE ".bestbooks_get_wpdb_prefix()."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "UPDATE ".$wpdb->base_prefix."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";
      } else {
        $sql = "UPDATE ".$wpdb->prefix."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";
      }
    } else {
      $sql = "UPDATE ".$wpdb->prefix."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";
    }
    */

    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal record update error: ".$sql);
    }
    return "Journal record updated!";
  }

  public static function remove($id) {
    global $wpdb;

    $sql = "DELETE FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal WHERE id='$id';";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $prefix = $wpdb->base_prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->base_prefix . $user_id . "_";
        }
        $sql = "DELETE FROM ".$prefix."bestbooks_journal WHERE id='$id';";
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }
        $sql = "DELETE FROM ".$prefix."bestbooks_journal WHERE id='$id';";
      }
    } else {
      $prefix = $wpdb->prefix;
      if ($user_id > 0) {
        $prefix = $wpdb->prefix . $user_id . "_";
      }

      $sql = "DELETE FROM ".$prefix."bestbooks_journal WHERE id='$id';";
    }
    */
  
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal record deletion error: ".$sql);
    }
    return "Journal record deleted successfully";
  }

  /**
   * Checks whether Journal is in balance
   * 
   * @return boolean True if journal is in-balance
   */
  public function inBalance($account='') {
    global $wpdb;

    $account_clause = '';
    if (!empty($account)) {
      $account_clause = " AND account='$account'";
    }

    $sql = "SELECT SUM(debit)=SUM(credit) FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal WHERE name='".$this->name."' $account_clause;";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT SUM(debit)=SUM(credit) FROM ".$wpdb->base_prefix."bestbooks_journal WHERE name='".$this->name."' $account_clause;";
     } else {
        $sql = "SELECT SUM(debit)=SUM(credit) FROM ".$wpdb->prefix."bestbooks_journal WHERE name='".$this->name."' $account_clause;";
     }
    } else {
      $sql = "SELECT SUM(debit)=SUM(credit) FROM ".$wpdb->prefix."bestbooks_journal WHERE name='".$this->name."' $account_clause;";
    }
    */
  
   	$result = $wpdb->get_results($sql);

    if (is_wp_error($result)) {
	    throw new BestBooksException("Journal balance check error: ".$sql);
    }
    $row = $result[0];
    return $row;
  }

  public function getBalance($account) {
    return $this->inBalance($account);
  }

  public function balance($account) {
    global $wpdb;

    $sql = "SELECT SUM(debit)-SUM(credit) AS balance FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal WHERE name='".$this->name."' AND account='$account';";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT SUM(debit)-SUM(credit) AS balance FROM ".$wpdb->base_prefix."bestbooks_journal WHERE name='".$this->name."' AND account='$account';";
     } else {
       $sql = "SELECT SUM(debit)-SUM(credit) AS balance FROM ".$wpdb->prefix."bestbooks_journal WHERE name='".$this->name."' AND account='$account';";
     }
    } else {
      $sql = "SELECT SUM(debit)-SUM(credit) AS balance FROM ".$wpdb->prefix."bestbooks_journal WHERE name='".$this->name."' AND account='$account';";
    }
    */

    $result = $wpdb->get_results($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal balance check error: ".$sql);
    }
    //$row = $result->fetchRow();
    return (isset($result[0]->balance) ? $result[0]->balance : '0.00');//$row[0];
  }

  /**
   * Sets the journal balance
   * 
   * @throws BestBooksException Not Supported
   */
  public function setBalance() {
      throw new BestBooksException('request not supported');
  }
   
  /**
   * Creates a new database table for the journal transactions
   * 
   * @return string Success message
   */
  public function transactions($account, $where) {
    global $wpdb;

    $sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal WHERE name='".$this->name."' AND account='$account' ".$where." ORDER BY txdate ASC";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_journal WHERE name='".$this->name."' AND account='$account' ".$where." ORDER BY txdate ASC";
     } else {
       $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal WHERE name='".$this->name."' AND account='$account' ".$where." ORDER BY txdate ASC";
     }
    } else {
      $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal WHERE name='".$this->name."' AND account='$account' ".$where." ORDER BY txdate ASC";
    }
    */
    $result = $wpdb->get_results($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal balance check error: ".$sql);
    }
    return $result;//$row[0];
  }

  public static function createTable() {
   	global $wpdb;

     $sql = "CREATE TABLE IF NOT EXISTS `".bestbooks_get_wpdb_prefix()."bestbooks_journal` (
      `id` int(11) NOT NULL,
      `txdate` date NOT NULL default '0000-00-00',
      `ref` tinyint(4) NOT NULL default '0',
      `account` varchar(50) NOT NULL default '',
      `debit` decimal(10,2) NOT NULL default '0.00',
      `credit` decimal(10,2) NOT NULL default '0.00'
      ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

    /*
    //$sql = 'CREATE TABLE `'.$wpdb->prefix.'Journal` (`txdate` DATE NOT NULL,`ref` TINYINT NOT NULL,`account` VARCHAR(50) NOT NULL,`debit` DECIMAL(10,2) NOT NULL,`credit` DECIMAL(10,2) NOT NULL)';
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $prefix = $wpdb->base_prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->base_prefix . $user_id . "_";
        }
        $sql = "CREATE TABLE IF NOT EXISTS `".$prefix."bestbooks_journal` (
                        `id` int(11) NOT NULL,
                        `txdate` date NOT NULL default '0000-00-00',
                        `ref` tinyint(4) NOT NULL default '0',
                        `account` varchar(50) NOT NULL default '',
                        `debit` decimal(10,2) NOT NULL default '0.00',
                        `credit` decimal(10,2) NOT NULL default '0.00'
                        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }
        $sql = "CREATE TABLE IF NOT EXISTS `".$prefix."bestbooks_journal` (
                        `id` int(11) NOT NULL,
                        `txdate` date NOT NULL default '0000-00-00',
                        `ref` tinyint(4) NOT NULL default '0',
                        `account` varchar(50) NOT NULL default '',
                        `debit` decimal(10,2) NOT NULL default '0.00',
                        `credit` decimal(10,2) NOT NULL default '0.00'
                        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
      }
    } else {
      $prefix = $wpdb->prefix;
      if ($user_id > 0) {
        $prefix = $wpdb->prefix . $user_id . "_";
      }

      $sql = "CREATE TABLE IF NOT EXISTS `".$prefix."bestbooks_journal` (
        `id` int(11) NOT NULL,
        `txdate` date NOT NULL default '0000-00-00',
        `ref` tinyint(4) NOT NULL default '0',
        `account` varchar(50) NOT NULL default '',
        `debit` decimal(10,2) NOT NULL default '0.00',
        `credit` decimal(10,2) NOT NULL default '0.00'
        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
    }
    */
  
    $result = $wpdb->query($sql);

    if ($result === false) {
	    throw new BestBooksException("Journal table creation error. ".$sql);
    }
    return "Journal table created successfully";
  }

  public static function alterTable() {
    // Function to perform any necessary table modifications
    global $wpdb;

    $queries = array();
    $index = 0;

    $queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
    $queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_journal` ADD `name` VARCHAR(255) NOT NULL DEFAULT 'General Journal' AFTER `id`;";
    $queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
    $queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_journal` ADD PRIMARY KEY( `id`);";
    $queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
    $queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_journal` ADD `xref` INT NOT NULL DEFAULT '0' AFTER `ref`;";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $prefix = $wpdb->base_prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->base_prefix . $user_id . "_";
        }

        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD `name` VARCHAR(255) NOT NULL DEFAULT 'General Journal' AFTER `id`;";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD PRIMARY KEY( `id`);";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }

        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD `name` VARCHAR(255) NOT NULL DEFAULT 'General Journal' AFTER `id`;";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD PRIMARY KEY( `id`);";
        $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
      }
    } else {
      $prefix = $wpdb->prefix;
      if ($user_id > 0) {
        $prefix = $wpdb->prefix . $user_id . "_";
      }

      $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
      $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD `name` VARCHAR(255) NOT NULL DEFAULT 'General Journal' AFTER `id`;";
      $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
      $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` ADD PRIMARY KEY( `id`);";
      $queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
    }
    */
    ob_start();
    foreach($queries as $sql) {
      $result = $wpdb->query($sql);
    }
    ob_get_clean();
    return "Journal table altered successfully";  
  }

  public static function dropTable($user_id) {
   	global $wpdb;

    $sql = "DROP TABLE ".bestbooks_get_wpdb_prefix()."bestbooks_journal";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $prefix = $wpdb->base_prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->base_prefix . $user_id . "_";
        }

        $sql = "DROP TABLE ".$prefix."bestbooks_journal";
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }

        $sql = "DROP TABLE ".$prefix."bestbooks_journal";
      }
    } else {
      $prefix = $wpdb->prefix;
      if ($user_id > 0) {
        $prefix = $wpdb->prefix . $user_id . "_";
      }

      $sql = "DROP TABLE ".$prefix."bestbooks_journal";
    }
    */
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal table drop failure");
    }
    return "Journal table dropped successfully";
  }

  public static function listJournals($user_id=0) {
    global $wpdb;

    $sql = "SELECT name FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal GROUP BY name;";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $prefix = $wpdb->base_prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->base_prefix . $user_id . "_";
        }

        $sql = "SELECT name FROM ".$prefix."bestbooks_journal GROUP BY name;";
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }

        $sql = "SELECT name FROM ".$prefix."bestbooks_journal GROUP BY name;";
      }
    } else {
      $prefix = $wpdb->prefix;
      if ($user_id > 0) {
        $prefix = $wpdb->prefix . $user_id . "_";
      }

      $sql = "SELECT name FROM ".$prefix."bestbooks_journal GROUP BY name;";
    }
    */
  
    $result = $wpdb->get_results($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal list failure");
    }
    $journals = array();
    foreach($result as $journal) {
      array_push($journals, $journal->name);
    }
    // Get Journals listed in the Chart of Accounts?
    $coa = new ChartOfAccounts();
    $public_journals = $coa->get_accounts_by_type('Journal');
    foreach($public_journals as $journal) {
      array_push($journals, $journal);
    }
    return $journals;
  }

  public static function getDebitCreditTotals($where='') {
    global $wpdb;

    $total_debit = "SELECT SUM(debit) AS total FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal $where ORDER BY txdate ASC";
    $total_credit = "SELECT SUM(credit) AS total FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal $where ORDER BY txdate ASC";

    /*
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $prefix = $wpdb->base_prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->base_prefix . $user_id . "_";
        }

        $total_debit = "SELECT SUM(debit) AS total FROM ".$prefix."bestbooks_journal $where ORDER BY txdate ASC";
        $total_credit = "SELECT SUM(credit) AS total FROM ".$prefix."bestbooks_journal $where ORDER BY txdate ASC";
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }

        $total_debit = "SELECT SUM(debit) AS total FROM ".$prefix."bestbooks_journal $where ORDER BY txdate ASC";
        $total_credit = "SELECT SUM(credit) AS total FROM ".$prefix."bestbooks_journal $where ORDER BY txdate ASC";
      }
    } else {
      $prefix = $wpdb->prefix;
      if ($user_id > 0) {
        $prefix = $wpdb->prefix . $user_id . "_";
      }

      $total_debit = "SELECT SUM(debit) AS total FROM ".$prefix."bestbooks_journal $where ORDER BY txdate ASC";
      $total_credit = "SELECT SUM(credit) AS total FROM ".$prefix."bestbooks_journal $where ORDER BY txdate ASC";
    }
    */
    $debit = $wpdb->get_results($total_debit);
    $credit = $wpdb->get_results($total_credit);

    return array(
      'db' => $debit[0]->total,
      'cr' => $credit[0]->total
    );
  }

  public static function setXRef($id, $value) {
    global $wpdb;

    $sql = "UPDATE ".bestbooks_get_wpdb_prefix()."bestbooks_journal SET xref=$value WHERE id=$id;";
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal entry update cross reference failure");
    }
    return "Journal entry cross reference updated successfully";
  }
}
?>