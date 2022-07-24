<?php

class ChartOfAccounts {
   var $account = array();
   var $count = 0;

   public function __construct() {
      global $wpdb;
       
      $sql = '';
    
      if (function_exists('is_plugin_active_for_network')) {
        if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
          $sql = "SELECT name,type FROM ".$wpdb->base_prefix."bestbooks_accounts";
        } else {
          $sql = "SELECT name,type FROM ".$wpdb->prefix."bestbooks_accounts";
        }
        $result = $wpdb->get_results($sql);
        foreach($result as $account) {
           $this->account[$account->name] = $account->type;
           $this->count++;
        }  
      } else {
        $sql = "SELECT name,type FROM ".$wpdb->prefix."bestbooks_accounts";
        $result = $wpdb->get_results($sql);
        foreach($result as $account) {
           $this->account[$account->name] = $account->type;
           $this->count++;
        }  
      }
   }

   public static function dropTable() {
   	  global $wpdb;
      
      $sql = '';

      if (function_exists('is_plugin_active_for_network')) {
        if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
          $sql = "DROP TABLE ".$wpdb->base_prefix."bestbooks_accounts";
        } else {
          $sql = "DROP TABLE ".$wpdb->prefix."bestbooks_accounts";
        }
      } else {
          $sql = "DROP TABLE ".$wpdb->prefix."bestbooks_accounts";
      }
      $result = $wpdb->query($sql);

      if ($result===false) {
          throw new BestBooksException("Accounts table drop failure");
      }

      return "Accounts table dropped successfully";
   }

    public static function createTable() {
        global $wpdb;
       
        $sql = '';

        if (function_exists('is_plugin_active_for_network')) {
          if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
            $sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->base_prefix."bestbooks_accounts` (
                            `id` int(11) NOT NULL auto_increment,
                            `txdate` date DEFAULT NULL,
                            `name` varchar(50) NOT NULL default '',
                            `type` varchar(20) NOT NULL default '',
                            `data` varchar(25) NOT NULL default '',
                            `class` varchar(255) NOT NULL default '',
                            PRIMARY KEY  (`id`)
                            ) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1";
          } else {
            $sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->prefix."bestbooks_accounts` (
                            `id` int(11) NOT NULL auto_increment,
                            `txdate` date DEFAULT NULL,
                            `name` varchar(50) NOT NULL default '',
                            `type` varchar(20) NOT NULL default '',
                            `data` varchar(25) NOT NULL default '',
                            `class` varchar(255) NOT NULL default '',
                            PRIMARY KEY  (`id`)
                            ) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1";
          }
        } else {
          $sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->prefix."bestbooks_accounts` (
            `id` int(11) NOT NULL auto_increment,
            `txdate` date DEFAULT NULL,
            `name` varchar(50) NOT NULL default '',
            `type` varchar(20) NOT NULL default '',
            `data` varchar(25) NOT NULL default '',
            `class` varchar(255) NOT NULL default '',
            PRIMARY KEY  (`id`)
            ) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1";
        }
        
        $result = $wpdb->query($sql);

        if ($result === false) {
            throw new BestBooksException("Accounts table creation error: ".$sql);
        }

        return "Accounts table created successfully";
    }

    public static function alterTable() {
      global $wpdb;

      $sql = '';
      if (function_exists('is_plugin_active_for_network')) {
        if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
          $sql = "ALTER TABLE ".$wpdb->base_prefix."bestbooks_accounts MODIFY `id` int(11) NOT NULL;";
        } else {
          $sql = "ALTER TABLE ".$wpdb->prefix."bestbooks_accounts MODIFY `id` int(11) NOT NULL;";
        }
      } else {
        $sql = "ALTER TABLE ".$wpdb->prefix."bestbooks_accounts MODIFY `id` int(11) NOT NULL;";
      }
      $result = $wpdb->query($sql);

      if ($result===false) {
        throw new BestBooksException("Chart of Accounts table modify failure");
      }
      return "Chart of Accounts table modified successfully";
    }

   public function add($name,$type) {
   	  global $wpdb;
   	  
      if (!isset($this->account[$name])) {
          $this->account[$name] = $type;
          $this->count++;

          $sql = "";

          $created = date('Y-m-d');
          if (function_exists('is_plugin_active_for_network')) {
            if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
              $sql = "INSERT INTO ".$wpdb->base_prefix."bestbooks_accounts (txdate,name,type) VALUES ('".$created."','".$name."','".$type."')";
            } else {
              $sql = "INSERT INTO ".$wpdb->prefix."bestbooks_accounts (txdate,name,type) VALUES ('".$created."','".$name."','".$type."')";            
            }
          } else {
            $sql = "INSERT INTO ".$wpdb->prefix."bestbooks_accounts (txdate,name,type) VALUES ('".$created."','".$name."','".$type."')";            
          }
          $result = $wpdb->query($sql);

          if ($result==0) {
              throw new BestBooksException("Failed to add a new account: ".$sql);
          }

          return $name." added to Accounts successfully";
      }
      return "Account:".$name." already exists";
   }

  function in_use($account) {
    global $wpdb;

    $sql = '';
    if (function_exists('is_plugin_active_for_network')) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_journal WHERE account='$account'";
      } else {
        $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal WHERE account='$account'";
      }
    } else {
      $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal WHERE account='$account'";
    }
    $result = $wpdb->query($sql);

    if ($result > 0) {
      return true;
    }

    return false;
  }

  function remove($name) {
    global $wpdb;
    $sql = '';
    if (function_exists('is_plugin_active_for_network')) {
      if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
        $sql = "DELETE FROM ".$wpdb->base_prefix."bestbooks_accounts WHERE name='$name'";
      } else {
        $sql = "DELETE FROM ".$wpdb->prefix."bestbooks_accounts WHERE name='$name'";
      }
    } else {
      $sql = "DELETE FROM ".$wpdb->prefix."bestbooks_accounts WHERE name='$name'";
    }
    $result = $wpdb->query($sql);

    if ($result==0) {
        throw new BestBooksException("Failed to delete account: ".$sql);
    }

    return $name." deleted from Accounts successfully";
  }

   public function getCount() {
      return $this->count;
   }

   public function getList() {
      return $this->account;
   }
}

?>