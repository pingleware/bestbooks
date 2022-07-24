<?php

class Journal {
  private $name = '';
  public function __construct($name = '') {
    $this->name = $name;
  }

  public function add($date,$ref,$account,$debit,$credit) {
   	global $wpdb;
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "INSERT INTO ".$wpdb->base_prefix."bestbooks_journal (txdate,ref,account,debit,credit) VALUES ('$date','$ref','$account','$debit','$credit')";
      } else {
        $sql = "INSERT INTO ".$wpdb->prefix."bestbooks_journal (txdate,ref,account,debit,credit) VALUES ('$date','$ref','$account','$debit','$credit')";
      }
    } else {
      $sql = "INSERT INTO ".$wpdb->prefix."bestbooks_journal (txdate,ref,account,debit,credit) VALUES ('$date','$ref','$account','$debit','$credit')";
    }
  
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal record insertion error: ".$sql);
    }
    return "new Journal record added";
  }

  public function update($id,$date,$account,$debit,$credit,$ref=0) {
    global $wpdb;
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "UPDATE ".$wpdb->base_prefix."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";
      } else {
        $sql = "UPDATE ".$wpdb->prefix."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";
      }
    } else {
      $sql = "UPDATE ".$wpdb->prefix."bestbooks_journal SET txdate='$date',account='$account',ref='$ref',debit=$debit,credit=$credit WHERE id=$id;";
    }
    //echo $sql.'<br/>';
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal record update error: ".$sql);
    }
    return "Journal record updated!";
  }

  public static function remove($id) {
    global $wpdb;

    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "DELETE FROM ".$wpdb->base_prefix."bestbooks_journal WHERE id='$id';";
      } else {
        $sql = "DELETE FROM ".$wpdb->prefix."bestbooks_journal WHERE id='$id';";
      }
    } else {
      $sql = "DELETE FROM ".$wpdb->prefix."bestbooks_journal WHERE id='$id';";
    }
  
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal record deletion error: ".$sql);
    }
    return "Journal record deleted successfully";
  }

  public function inBalance() {
    global $wpdb;
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT SUM(debit)=SUM(credit) FROM ".$wpdb->base_prefix."bestbooks_journal WHERE account='".$this->name."'";
     } else {
       $sql = "SELECT SUM(debit)=SUM(credit) FROM ".$wpdb->prefix."bestbooks_journal WHERE account='".$this->name."'";
     }
    } else {
      $sql = "SELECT SUM(debit)=SUM(credit) FROM ".$wpdb->prefix."bestbooks_journal WHERE account='".$this->name."'";
    }
  
   	$result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal balance check error: ".$sql);
    }
    $row = $result->fetchRow();
    return $row[0];
  }

  public function getBalance() {
    return $this->inBalance();
  }

  public function balance() {
    global $wpdb;
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT SUM(credit)-SUM(debit) AS balance FROM ".$wpdb->base_prefix."bestbooks_journal WHERE account='".$this->name."'";
     } else {
       $sql = "SELECT SUM(credit)-SUM(debit) AS balance FROM ".$wpdb->prefix."bestbooks_journal WHERE account='".$this->name."'";
     }
    } else {
      $sql = "SELECT SUM(credit)-SUM(debit) AS balance FROM ".$wpdb->prefix."bestbooks_journal WHERE account='".$this->name."'";
    }

    $result = $wpdb->get_results($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal balance check error: ".$sql);
    }
    //$row = $result->fetchRow();
    return ($result[0]->balance ? $result[0]->balance : '0.00');//$row[0];
  }

  public function setBalance() {
      throw new BestBooksException('request not supported');
  }

  public function transactions($where) {
    global $wpdb;
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_journal WHERE account='".$this->name."' ".$where." ORDER BY txdate ASC";
     } else {
       $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal WHERE account='".$this->name."' ".$where." ORDER BY txdate ASC";
     }
    } else {
      $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal WHERE account='".$this->name."' ".$where." ORDER BY txdate ASC";
    }
		//echo $sql.'<br/>';
    $result = $wpdb->get_results($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal balance check error: ".$sql);
    }
    //$row = $result->fetchRow();
    return $result;//$row[0];
  }

  public static function createTable() {
   	global $wpdb;

    //$sql = 'CREATE TABLE `'.$wpdb->prefix.'Journal` (`txdate` DATE NOT NULL,`ref` TINYINT NOT NULL,`account` VARCHAR(50) NOT NULL,`debit` DECIMAL(10,2) NOT NULL,`credit` DECIMAL(10,2) NOT NULL)';
    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->base_prefix."bestbooks_journal` (
                        `id` int(11) NOT NULL,
                        `txdate` date NOT NULL default '0000-00-00',
                        `ref` tinyint(4) NOT NULL default '0',
                        `account` varchar(50) NOT NULL default '',
                        `debit` decimal(10,2) NOT NULL default '0.00',
                        `credit` decimal(10,2) NOT NULL default '0.00'
                        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
      } else {
        $sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->prefix."bestbooks_journal` (
                        `id` int(11) NOT NULL,
                        `txdate` date NOT NULL default '0000-00-00',
                        `ref` tinyint(4) NOT NULL default '0',
                        `account` varchar(50) NOT NULL default '',
                        `debit` decimal(10,2) NOT NULL default '0.00',
                        `credit` decimal(10,2) NOT NULL default '0.00'
                        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
      }
    } else {
      $sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->prefix."bestbooks_journal` (
        `id` int(11) NOT NULL,
        `txdate` date NOT NULL default '0000-00-00',
        `ref` tinyint(4) NOT NULL default '0',
        `account` varchar(50) NOT NULL default '',
        `debit` decimal(10,2) NOT NULL default '0.00',
        `credit` decimal(10,2) NOT NULL default '0.00'
        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
    }
  
    $result = $wpdb->query($sql);

    if ($result === false) {
	    throw new BestBooksException("Journal table creation error. ".$sql);
    }
    return "Journal table created successfully";
  }

  public static function alterTable() {
    // Function to perform any necessary table modifications
    global $wpdb;

    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $check_id_column = "SHOW COLUMNS from `".$wpdb->base_prefix."bestbooks_journal` LIKE 'id';";
        $sql = "ALTER TABLE `".$wpdb->base_prefix."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
        $sql .= "ALTER TABLE `".$wpdb->base_prefix."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
        $sql .= "ALTER TABLE `".$wpdb->base_prefix."bestbooks_journal` ADD PRIMARY KEY( `id`);";
        $sql .= "ALTER TABLE `".$wpdb->base_prefix."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
      } else {
        $check_id_column = "SHOW COLUMNS from `".$wpdb->prefix."bestbooks_journal` LIKE 'id';";
        $sql = "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
        $sql .= "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
        $sql .= "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` ADD PRIMARY KEY( `id`);";
        $sql .= "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
      }
    } else {
      $check_id_column = "SHOW COLUMNS from `".$wpdb->prefix."bestbooks_journal` LIKE 'id';";
      $sql = "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);";
      $sql .= "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` CHANGE `txdate` `txdate` DATE NOT NULL;";
      $sql .= "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` ADD PRIMARY KEY( `id`);";
      $sql .= "ALTER TABLE `".$wpdb->prefix."bestbooks_journal` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
    }
    $verify = $wpdb->get_results($check_id_column);
    if (count($verify) == 0) {
      $result = $wpdb->query($sql);

      if ($result === false) {
        throw new BestBooksException("Journal table alteration error. ".$sql);
      }
      return "Journal table altered successfully";  
    } else {
      return "Journal table has already been altered";  
    }
  }

  public static function dropTable() {
   	global $wpdb;

    if (function_exists("is_plugin_active_for_network")) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "DROP TABLE ".$wpdb->base_prefix."bestbooks_journal";
      } else {
        $sql = "DROP TABLE ".$wpdb->prefix."bestbooks_journal";
      }
    } else {
      $sql = "DROP TABLE ".$wpdb->prefix."bestbooks_journal";
    }
  
    $result = $wpdb->query($sql);

    if ($result===false) {
	    throw new BestBooksException("Journal table drop failure");
    }
    return "Journal table dropped successfully";
  }
}


?>