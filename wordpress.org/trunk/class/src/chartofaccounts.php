<?php
/**
 * A chart of accounts (COA) is a listing of each account a company owns, along with the account type and account balance, shown in the order the accounts appear 
 * in the company�s financial statements. �Chart of accounts� is the official accounting term for the display of this information, which includes both 
 * balance-sheet accounts and income-statement accounts.
 *
 * Read more: Chart of Accounts Definition | Investopedia https://www.investopedia.com/terms/c/chart-accounts.asp#ixzz5RqXgX5xQ
 *
 * Follow us: Investopedia on Facebook
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2018 PressPage Entertainment Inc.
 */
/**
 * ChartOfAccounts class definition
 */
class ChartOfAccounts {
  /**
   * Array of registered accounts
   * 
   * @property-read mixed[] $account Array of registered accounts
   */
  var $account = array();
  var $acctids = array();
  /**
   * Total number of accounts
   * 
   * @property-read integer $count Running count of registered accounts
   */
  var $count = 0;

  /**
   * Class constructor
   * 
   * @return void
   */
  public function __construct() {
      global $wpdb;
       
      $sql = "SELECT name,type FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts";
    
      /*
      if (function_exists('is_plugin_active_for_network')) {
        if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
          $sql = "SELECT name,type FROM ".$wpdb->base_prefix."bestbooks_accounts";
        } else {
          $sql = "SELECT name,type FROM ".$wpdb->prefix."bestbooks_accounts";
        }
      } else {
        $sql = "SELECT name,type FROM ".$wpdb->prefix."bestbooks_accounts";
      }
      */

      $result = $wpdb->get_results($sql);
      foreach($result as $account) {
         $this->account[$account->name] = $account->type;
         $this->count++;
      }      
   }

  /**
   * Drops the chart of accounts table
   * 
   * @throws BestBooksException Accounts table drop failure
   * @return string Success message
   */
  public static function dropTable($user_id=0) {
  	global $wpdb;
      
    $sql = "DROP TABLE ".bestbooks_get_wpdb_prefix()."bestbooks_accounts";

    /*
      if (function_exists('is_plugin_active_for_network')) {
        if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
          $prefix = $wpdb->base_prefix;
          if ($user_id > 0) {
            $prefix = $wpdb->base_prefix . $user_id . "_";
          }

          $sql = "DROP TABLE ".$prefix."bestbooks_accounts";
        } else {
          $prefix = $wpdb->prefix;
          if ($user_id > 0) {
            $prefix = $wpdb->prefix . $user_id . "_";
          }

          $sql = "DROP TABLE ".$prefix."bestbooks_accounts";
        }
      } else {
        $prefix = $wpdb->prefix;
        if ($user_id > 0) {
          $prefix = $wpdb->prefix . $user_id . "_";
        }

          $sql = "DROP TABLE ".$prefix."bestbooks_accounts";
      }
      */
    $result = $wpdb->query($sql);

    if ($result===false) {
        throw new BestBooksException("Accounts table drop failure");
    }

    return "Accounts table dropped successfully";
   }

  /**
   * Creates a new charts of accounts table
   * 
   * @return string Success message
   */
   public static function createTable() {
        global $wpdb;
       
        $sql = "CREATE TABLE IF NOT EXISTS `".bestbooks_get_wpdb_prefix()."bestbooks_accounts` (
          `id` int(11) NOT NULL auto_increment,
          `txdate` date DEFAULT NULL,
          `name` varchar(50) NOT NULL default '',
          `type` varchar(20) NOT NULL default '',
          `data` varchar(25) NOT NULL default '',
          `class` varchar(255) NOT NULL default '',
          PRIMARY KEY  (`id`)
          ) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1";

        $result = $wpdb->query($sql);

        if ($result === false) {
            throw new BestBooksException("Accounts table creation error: ".$sql);
        }

        return "Accounts table created successfully";
    }

    public static function alterTable() {
      global $wpdb;

      $queries = array();
      $queries[0] = "ALTER TABLE ".bestbooks_get_wpdb_prefix()."bestbooks_accounts MODIFY `id` int(11) NOT NULL;";
      $queries[1] = "ALTER TABLE ".bestbooks_get_wpdb_prefix()."bestbooks_accounts CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;";
      $queries[2] = "ALTER TABLE ".bestbooks_get_wpdb_prefix()."bestbooks_accounts CHANGE `txdate` `txdate` DATE NULL;";

      ob_start();
      foreach($queries as $sql) {
        $result = $wpdb->query($sql);
      }
      ob_get_clean();
      return "Chart of Accounts table modified successfully";
    }

  /**
   * Adds a new account to the chart of accounts
   * 
   * @param string $name Account name
   * @param string $type Account type @see AccountTypes
   */
  public function add($name,$type) {
   	  global $wpdb;
   	  
      if (!isset($this->account[$name])) {
          $this->account[$name] = $type;
          $this->count++;

          $created = date('Y-m-d');
          $sql = "INSERT INTO ".bestbooks_get_wpdb_prefix()."bestbooks_accounts (txdate,name,type) VALUES ('".$created."','".$name."','".$type."')";

          $result = $wpdb->query($sql);

          if ($result==0) {
              throw new BestBooksException("Failed to add a new account: ".$sql);
          }

          return $name." added to Accounts successfully";
      }
      return "Account:".$name." already exists";
  }

  public function get_account_by_name($name) {
    global $wpdb;

    $sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts WHERE name='".$name."';";
    
    $result = $wpdb->get_results($sql);

    if ($result==0) {
        throw new BestBooksException("Failed to lookup account: ".$sql);
    }
    
    return $sql;
  }

  public function get_accounts_by_type($type) {
    global $wpdb;

    $sql = "SELECT name FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts WHERE type='".$type."' GROUP BY name;";

    $result = $wpdb->get_results($sql);

    if ($result==0) {
        throw new BestBooksException("Failed to lookup account: ".$sql);
    }
    $accounts = array();
    foreach($result as $account) {
      array_push($accounts, $account->name);
    }
    return $accounts;
  }

  /**
   * Checks if account is being used, that is transactions are present?
   * 
   * @param string $account Account name
   * @return boolean True if in use, otherwise False
   */
  public function in_use($account) {
    global $wpdb;

    $sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal WHERE account='$account'";

    $result = $wpdb->query($sql);

    if ($result > 0) {
      return true;
    }

    return false;
  }

  /**
   * Remove an account from the chart of accounts
   * 
   * @param string $name Account name
   * @return string Success message
   */
  function remove($name) {
    global $wpdb;
    
    $sql = "DELETE FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts WHERE name='$name'";;

    $result = $wpdb->query($sql);

    if ($result==0) {
        throw new BestBooksException("Failed to delete account: ".$sql);
    }

    return $name." deleted from Accounts successfully";
  }

  public static function empty() {
    try {
      global $wpdb;

      $sql = "TRUNCATE ".bestbooks_get_wpdb_perfix()."bestbooks_accounts;";

      $result = $wpdb->get_results($sql);
    } catch(Exception $ex) {
      throw new BestBooksException($ex->get_message());
    }

    return "Chart of Accounts has been emptied";
}

  /**
   * Get total number of accounts in the chart of accounts
   * 
   * @return integer Total number of accounts
   */
  public function getCount() {
    return $this->count;
  }

  /**
   * Get the account list
   * 
   * @return mixed[] Account list
   */
  public function getList() {
    return $this->account;
  }

  public static function getAccountIdByName($name, $user_id=0) {
    global $wpdb;

    $sql = "SELECT id FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts WHERE name='$name';";

    $result = $wpdb->get_results($sql);

    if ($result[0]->total > 0) {
      return false;
    }

    return $result[0]->id;
  }

  public static function getAccountBy($field, $value) {
    global $wpdb;

    $sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts WHERE $field='$value';";

    $result = $wpdb->get_results($sql);

    if ($result instanceof WP_Error) {
      throw new BestBooksException($result->get_message());
    }

    return $results[0];
  }
}

?>