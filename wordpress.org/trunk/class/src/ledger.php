<?php
/**
 * A general ledger represents the formal ledger for a company's financial statements with debit and credit account records validated by a trial balance. 
 * The ledger provides a complete record of financial transactions over the life of the company. The ledger holds account information that is needed to 
 * prepare financial statements and includes accounts for assets, liabilities, owners' equity, revenues and expenses.
 *
 * Read more: General Ledger https://www.investopedia.com/terms/g/generalledger.asp#ixzz5RqXCLRF0
 *
 * Follow us: Investopedia on Facebook
 *
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2002-2021 PressPage Entertainment Inc DBA PINGLEWARE.
 */
/**
 * Ledger class definition deried from the TAccount base class
 */
class Ledger extends TAccount {
	/**
	 * @var double $balance Current account balance
	 */
	var $balance = 0;
	/**
	 * @var string $name Account name
	 */
	var $name = null;
	/**
	 * @see AccountType
	 * @var AccountType $type Account type
	 */
	var $type = null;
	/**
	 * @var double $debit Last debit entry amount
	 */
	var $debit = 0;
	/**
	 * @var double $credit Last credit entry amount
	 */
	var $credit = 0;

	/**
	 * Constructor for Ledger account to create an new instance 
	 * 
	 * @param string $name Account name
	 * @param AccountType $type Account type
	 */
	public function __construct($name, $type) {
		global $wpdb;
		
		if ($name == null || $type == null) {
			throw new BestBooksException("Null pointer exception");
		}
		$this->name = $name;
		$this->type = $type;


		$sql = "SELECT type FROM ".bestbooks_get_wpdb_prefix()."bestbooks_accounts WHERE name='$this->name'";
		
		/*
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT type FROM ".$wpdb->base_prefix."bestbooks_accounts WHERE name='$this->name'";
			} else {
				$sql = "SELECT type FROM ".$wpdb->prefix."bestbooks_accounts WHERE name='$this->name'";
			}
		} else {
			$sql = "SELECT type FROM ".$wpdb->prefix."bestbooks_accounts WHERE name='$this->name'";
		}
		*/
	
		$result = $wpdb->get_results($sql);

		if (!$result) {
			throw new BestBooksException("Error: " . $sql);
		}
		if ($wpdb->num_rows == 0) {
			throw new BestBooksException("Account:" . $this->name . " not found/does not exist");
		}

		$this->type = $result[0]->type;
		$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE name='$name'";
	
		$result = $wpdb->get_results($sql);
		if (isset($result[0])) {
			$this->balance = number_format($result[0]->Balance, 2);
		} else {
			$this->balance = 0.00;
		}
	}

	public function get_transactions_by_range($begin_date, $end_date) {
		global $wpdb;

		$sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE name='".$this->name."' AND txdate BETWEEN '$begin_date' AND '$end_date' ORDER BY txdate ASC;";
		
		$result = $wpdb->get_results($sql);

		if (is_wp_error($result)) {
			throw new BestBooksException("Error: " . $sql);
		}
		
		return $result;
	}

	public function getByID($id) {
		global $wpdb;

		$sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE id='$id'";

		$result = $wpdb->get_results($sql);

		if (!$result) {
			throw new BestBooksException("Error: " . $sql);
		}
		if ($wpdb->num_rows == 0) {
			throw new BestBooksException("Account not found/does not exist");
		}

		$this->name = $result[0]->name;
		$this->type = $result[0]->type;
		$this->debit = $result[0]->debit;
		$this->credit = $result[0]->credit;

		$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE id='$id'";

		$result = $wpdb->get_results($sql);
		$this->balance = number_format($result[0]->Balance, 2);

	}

	public function update($id, $account, $type, $date, $description, $debit, $credit) {
		global $wpdb;

		$sql = "UPDATE ".bestbooks_get_wpdb_prefix()."bestbooks_ledger SET name='$account',type='$type',txdate='$date',note='$description',debit=$debit,credit=$credit WHERE id='$id'";

		$result = $wpdb->get_results($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger table update failure: " . $sql);
		}

		return "Account updated successfully!";
	}

	public function add($account, $type, $date, $description, $debit, $credit) {
		global $wpdb;

		$sql = "INSERT INTO ".bestbooks_get_wpdb_prefix()."bestbooks_ledger (name,type,txdate,note,debit,credit) VALUES ('$account','$type','$txdate','$description',$debit,$credit);";

		$result = $wpdb->get_results($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger table update failure: " . $sql);
		}

		return "Account added successfully!";
	}

	/**
	 * Gets the account name for this Ledger instance
	 * l=
	 * @return string Account name
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * Gets the account type for this Ledger instance
	 * 
	 * @return string Account type
	 */
	public function getType() {
		return $this->type;
	}

	/**
	 * Finds the account type by name without creating an instance
	 * 
	 * @param string name Account name to search
	 * @return string account type
	 */
	public static function findType($name, $user_id=0) {
		global $wpdb;

		if (function_exists('is_plugin_active_for_network')) { 
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$prefix = $wpdb->base_prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->base_prefix . $user_id . "_";
				}
	
				$sql = "SELECT type FROM ".$prefix."bestbooks_accounts WHERE name='$name'";
			} else {
				$prefix = $wpdb->prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->prefix . $user_id . "_";
				}
	
				$sql = "SELECT type FROM ".$prefix."bestbooks_accounts WHERE name='$name'";
			}
		} else {
			$prefix = $wpdb->prefix;
			if ($user_id > 0) {
			  $prefix = $wpdb->prefix . $user_id . "_";
			}

			$sql = "SELECT type FROM ".$prefix."bestbooks_accounts WHERE name='$name'";
		}

		$result = $wpdb->get_results($sql);
		return $result[0]->type;
	}

	/**
	 * Deletes a transaction by ID
	 * 
	 * @param integer id transaction ID
	 * @return nothing
	 */
	public static function delete($id) {
		global $wpdb;

		$sql = "DELETE FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE id='$id'";

		/*
		if (function_exists('is_plugin_active_for_network')) { 
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$prefix = $wpdb->base_prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->base_prefix . $user_id . "_";
				}
	
				$sql = "DELETE FROM ".$prefix."bestbooks_ledger WHERE id='$id'";
			} else {
				$prefix = $wpdb->prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->prefix . $user_id . "_";
				}
	
				$sql = "DELETE FROM ".$prefix."bestbooks_ledger WHERE id='$id'";
			}
		} else {
			$prefix = $wpdb->prefix;
			if ($user_id > 0) {
			  $prefix = $wpdb->prefix . $user_id . "_";
			}

			$sql = "DELETE FROM ".$prefix."bestbooks_ledger WHERE id='$id'";
		}
		*/

		return $wpdb->get_results($sql);
	}

	/**
	 * Makes a debit entry into this Ledger account
	 * 
	 * @param string $date Transaction date
	 * @param string $desc Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return string Success status
	 */
	public function addDebit($date, $desc, $amount) {
		global $wpdb;
		$this->balance = str_replace(',','',$this->balance);

		$sql = "INSERT INTO ".bestbooks_get_wpdb_prefix()."bestbooks_ledger (name,txdate,note,debit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";

		$result = $wpdb->query($sql);
		$ledger_insert_id = $wpdb->insert_id;

		if ($result===false) {
			throw new BestBooksException("Ledger table insertion failure: " . $sql);
		}

		$this->debit = $amount;
		$journal_id = 0;
                
		if ($this->name !== 'Uncategorized' && $ledger_insert_id > 0) {
			$journal = new Journal();
			$journal_id = $journal->add($date,$ledger_insert_id ,$this->name,$amount,0.00);
			$this->setRef($ledger_insert_id, $journal_id);
		}

		return array($ledger_insert_id, $journal_id);
	}

	/**
	 * Makes a credit entry into this Ledger account
	 * 
	 * @param string $date Transaction date
	 * @param string $desc Transaction description
	 * @param double $amount Transaction amount
	 * 
	 * @return string Success status
	 */
	public function addCredit($date, $desc, $amount) {
		global $wpdb;
		$this->balance = str_replace(',','',$this->balance);

		$sql = "INSERT INTO ".bestbooks_get_wpdb_prefix()."bestbooks_ledger (name,txdate,note,credit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";

		$result = $wpdb->query($sql);
		$ledger_insert_id = $wpdb->insert_id;

		if ($result===false) {
			throw new BestBooksException("Ledger table insertion failure: " . $sql);
		}

		$journal_id = 0;
		$this->credit = $amount;
		if ($this->name !== 'Uncategorized' && $ledger_insert_id > 0) {
			$journal = new Journal();
			$journal_id = $journal->add($date,$ledger_insert_id,$this->name,0.00,$amount);	
		}

		return array($ledger_insert_id, $journal_id);
	}

	/**
	 * Gets the last debit entry amount, if any
	 * 
	 * @return double Last debit entry amount
	 */
	public function getDebit() {
		return $this->debit;

	}

	/**
	 * Gets the last credit entry amount, if any
	 * 
	 * @return double Last credit entry amount
	 */
	public function getCredit() {
		return $this->credit;

	}

	/**
	 * Retrieves the current account ledger balance
	 * 
	 * @return double Current balance
	 */
	public function getBalance() {
		return $this->balance;
	}

	/**
	 * Sets the current account ledger balance
	 * 
	 * @param double $balance New account balanse
	 * @return void
	 */
	public function setBalance($balance) {
		$this->balance = $balance;
	}
	
	/**
	 * Creates the Ledger table
	 * 
	 * @return string Success message
	 */
	public static function getAll($user_id=0) {
		global $wpdb;
		$results = array('total'=>0,'transactions'=>array());

		$sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger ORDER BY txdate DESC";
		$totals = "SELECT COUNT(*) as total FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger ORDER BY txdate DESC";

		/*
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_ledger ORDER BY txdate DESC";
				$totals = "SELECT COUNT(*) as total FROM ".$wpdb->base_prefix."bestbooks_ledger ORDER BY txdate DESC";
			} else {
				$sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_ledger ORDER BY txdate DESC";
				$totals = "SELECT COUNT(*) as total FROM ".$wpdb->prefix."bestbooks_ledger ORDER BY txdate DESC";
			}
		} else {
			$sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_ledger ORDER BY txdate DESC";
			$totals = "SELECT COUNT(*) as total FROM ".$wpdb->prefix."bestbooks_ledger ORDER BY txdate DESC";
		}
		*/
	
		$totals = $wpdb->get_results($totals);
		$results['total'] = $totals[0]->total;
		$results['transactions'] = $wpdb->get_results($sql);
		return $results;
	}
	/**
	 * --total balance
	 * SELECT (SUM(debit)*-1) + SUM(credit) AS TotalBalance
	 * FROM Trasaction
	 *
	 * --daily balance
	 * SELECT TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance * FROM Transaction GROUP BY TransDate
	 * 
	 * --period of time balance
	 * SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalace FROM Transaction WHERE TransDate BETWEEN CURDATE() AND ADDDATE(CURDATE() INTERVAL -30 DAY)
	 * 
	 * --customer balance
	 * SELECT CustId, (SUM(debit)*-1) + SUM(credit) AS CustomerBalance FROM Transaction GROUP BY CustId
	 * 
	 */
	public function get_daily_balance($transdate) {
		global $wpdb;

		$sql = "SELECT txdate AS TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger GROUP BY txdate";

		$results = $wpdb->get_results($sql);
		return $results[0];
	}

	public function get_period_of_time_balance($begin_date,$end_date) {
		global $wpdb;

		$sql = "SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalance FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE txdate BETWEEN ".$begin_date." AND ".$end_date.";";

		$results = $wpdb->get_results($sql);
		if (isset($results[0]->PeriodBalance)) {
			return $results[0]->PeriodBalance;
		} else {
			return 0.00;
		}
	}

	/**
	 * Static Functions
	 * ----------------
	 * 
	 * Ledger::remove($id)
	 * Ledger::createTable()
	 * Legder::alterTable()
	 * Ledger::dropTable()
	 */

	public static function remove($id) {
		global $wpdb;

		$sql = "DELETE FROM ".bestbooks_get_wpdb_prefix()."bestbooks_ledger WHERE id='$id';";
		$result = $wpdb->query($sql);
	
		if ($result===false) {
			throw new BestBooksException("Transaction record deletion error: ".$sql);
		}
		return "Transaction record deleted successfully";	
	}

	public static function createTable() {
        global $wpdb;

		$sql = "CREATE TABLE IF NOT EXISTS `".bestbooks_get_wpdb_prefix()."bestbooks_ledger` (
			`id` int(11) NOT NULL auto_increment,
			`name` varchar(255) NOT NULL default '',
			`txdate` date NOT NULL default '0000-00-00',
			`note` varchar(255) NOT NULL default '',
			`ref` double NOT NULL default '0',
			`debit` decimal(10,2) NOT NULL default '0.00',
			`credit` decimal(10,2) NOT NULL default '0.00',
			`balance` decimal(10,2) NOT NULL default '0.00',
			`type` varchar(10) NOT NULL default '',
			PRIMARY KEY  (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
		/*
        //$sql = "CREATE TABLE `".$wpdb->prefix."Ledger` (`id` TINYINT AUTO_INCREMENT ,`name` VARCHAR( 255 ) NOT NULL,`txdate` DATE NOT NULL,`desc2` VARCHAR( 255 ) NOT NULL,`ref` DOUBLE NOT NULL,`debit` DECIMAL( 10, 2 ) NOT NULL ,`credit` DECIMAL( 10, 2 ) NOT NULL ,`balance` DECIMAL( 10, 2 ) NOT NULL ,`type` VARCHAR( 10 ) NOT NULL ,PRIMARY KEY ( `id` ) )";
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$prefix = $wpdb->base_prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->base_prefix . $user_id . "_";
				}
		
				$sql = "CREATE TABLE IF NOT EXISTS `".$prefix."bestbooks_ledger` (
						`id` int(11) NOT NULL auto_increment,
						`name` varchar(255) NOT NULL default '',
						`txdate` date NOT NULL default '0000-00-00',
						`note` varchar(255) NOT NULL default '',
						`ref` double NOT NULL default '0',
						`debit` decimal(10,2) NOT NULL default '0.00',
						`credit` decimal(10,2) NOT NULL default '0.00',
						`balance` decimal(10,2) NOT NULL default '0.00',
						`type` varchar(10) NOT NULL default '',
						PRIMARY KEY  (`id`)
						) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
			} else {
				$prefix = $wpdb->prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->prefix . $user_id . "_";
				}
		
				$sql = "CREATE TABLE IF NOT EXISTS `".$prefix."bestbooks_ledger` (
						`id` int(11) NOT NULL auto_increment,
						`name` varchar(255) NOT NULL default '',
						`txdate` date NOT NULL default '0000-00-00',
						`note` varchar(255) NOT NULL default '',
						`ref` double NOT NULL default '0',
						`debit` decimal(10,2) NOT NULL default '0.00',
						`credit` decimal(10,2) NOT NULL default '0.00',
						`balance` decimal(10,2) NOT NULL default '0.00',
						`type` varchar(10) NOT NULL default '',
						PRIMARY KEY  (`id`)
						) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";    		
			}
		} else {
			$prefix = $wpdb->prefix;
			if ($user_id > 0) {
			  $prefix = $wpdb->prefix . $user_id . "_";
			}
	
			$sql = "CREATE TABLE IF NOT EXISTS `".$prefix."bestbooks_ledger` (
				`id` int(11) NOT NULL auto_increment,
				`name` varchar(255) NOT NULL default '',
				`txdate` date NOT NULL default '0000-00-00',
				`note` varchar(255) NOT NULL default '',
				`ref` double NOT NULL default '0',
				`debit` decimal(10,2) NOT NULL default '0.00',
				`credit` decimal(10,2) NOT NULL default '0.00',
				`balance` decimal(10,2) NOT NULL default '0.00',
				`type` varchar(10) NOT NULL default '',
				PRIMARY KEY  (`id`)
				) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";    		
		}
		*/
	
        $result = $wpdb->query($sql);

        if ($result === false) {
            throw new BestBooksException("Ledger table creation error: " . $sql);
        }

        return "Ledger table created successfully";
	}

	/**
	 * Alters the Ledger table
	 * 
	 * @return string Success message
	 */
	public static function alterTable() {
        global $wpdb;

		$queries = array();
		$index = 0;

		$queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
		$queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_ledger` ADD `num` INT NOT NULL DEFAULT '0' AFTER `id`;";
		$queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_ledger` ADD `cleared` CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U=uncleared, X=cleared' AFTER `type`;";
		$queries[$index++] = "ALTER TABLE `".bestbooks_get_wpdb_prefix()."bestbooks_ledger` ADD `xref` INT NOT NULL DEFAULT '0' AFTER `ref`;";
		/*
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$prefix = $wpdb->prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->prefix . $user_id . "_";
				}
		
				$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
				$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` ADD `num` INT NOT NULL DEFAULT '0' AFTER `id`;";
				$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` ADD `cleared` CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U=uncleared, X=cleared' AFTER `type`;";
			} else {
				$prefix = $wpdb->prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->prefix . $user_id . "_";
				}
		
				$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
				$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` ADD `num` INT NOT NULL DEFAULT '0' AFTER `id`;";
				$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` ADD `cleared` CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U=uncleared, X=cleared' AFTER `type`;";
			}
		} else {
			$prefix = $wpdb->prefix;
			if ($user_id > 0) {
			  $prefix = $wpdb->prefix . $user_id . "_";
			}
	
			$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
			$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` ADD `num` INT NOT NULL DEFAULT '0' AFTER `id`;";
			$queries[$index++] = "ALTER TABLE `".$prefix."bestbooks_ledger` ADD `cleared` CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U=uncleared, X=cleared' AFTER `type`;";
		}
		*/
		ob_start();
		foreach($queries as $sql) {
			$result = @$wpdb->query($sql);
		}
		ob_get_clean();
        return "Ledger table modified successfully";
	}

	/**
	 * Drops the Ledger table
	 * 
	 * @return string Success message
	 */
	public static function dropTable() {
		global $wpdb;

		$sql = "DROP TABLE ".bestbooks_get_wpdb_prefix()."bestbooks_ledger";    		

		/*
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$prefix = $wpdb->base_prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->base_prefix . $user_id . "_";
				}

				$sql = "DROP TABLE ".$prefix."bestbooks_ledger";    		
			} else {
				$prefix = $wpdb->prefix;
				if ($user_id > 0) {
				  $prefix = $wpdb->prefix . $user_id . "_";
				}

				$sql = "DROP TABLE ".$prefix."bestbooks_ledger";    		
			}
		} else {
			$prefix = $wpdb->prefix;
			if ($user_id > 0) {
			  $prefix = $wpdb->prefix . $user_id . "_";
			}

			$sql = "DROP TABLE ".$prefix."bestbooks_ledger";    		
		}
		*/
	
		$result = $wpdb->query($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger table drop failure");
		}

		return "Ledger table dropped successfully";
	}

	public function setXRef($id, $value) {
		global $wpdb;

		$sql = "UPDATE ".bestbooks_get_wpdb_prefix()."bestbooks_ledger SET xref=$value WHERE id=$id;";
		$result = $wpdb->query($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger entry cross reference update failure");
		}

		return "Ledger entry cross reference updated successfully";
	}

	public function setRef($id, $value) {
		global $wpdb;

		$sql = "UPDATE ".bestbooks_get_wpdb_prefix()."bestbooks_ledger SET ref=$value WHERE id=$id;";
		$result = $wpdb->query($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger entry cross reference update failure");
		}

		return "Ledger entry cross reference updated successfully";
	}
}

?>