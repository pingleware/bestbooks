<?php

class Ledger extends TAccount {
	var $balance = 0;
	var $name = null;
	var $type = null;
	var $debit = 0;
	var $credit = 0;

	public function __construct($name, $type) {
		global $wpdb;
		
		if ($name == null || $type == null) {
			throw new BestBooksException("Null pointer exception");
		}
		$this->name = $name;
		$this->type = $type;
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT type FROM ".$wpdb->base_prefix."bestbooks_accounts WHERE name='$this->name'";
			} else {
				$sql = "SELECT type FROM ".$wpdb->prefix."bestbooks_accounts WHERE name='$this->name'";
			}
		} else {
			$sql = "SELECT type FROM ".$wpdb->prefix."bestbooks_accounts WHERE name='$this->name'";
		}
	
		$result = $wpdb->get_results($sql);

		if (!$result) {
			throw new BestBooksException("Error: " . $sql);
		}
		if ($wpdb->num_rows == 0) {
			throw new BestBooksException("Account:" . $this->name . " not found/does not exist");
		}

		$this->type = $result[0]->type;
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".$wpdb->base_prefix."bestbooks_ledger WHERE name='$name'";
			} else {
				$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".$wpdb->prefix."bestbooks_ledger WHERE name='$name'";
			}
		} else {
			$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".$wpdb->prefix."bestbooks_ledger WHERE name='$name'";
		}
	
		$result = $wpdb->get_results($sql);
		$this->balance = number_format($result[0]->Balance, 2);
	}

	public function getByID($id) {
		global $wpdb;

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_ledger WHERE id='$id'";
			} else {
				$sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_ledger WHERE id='$id'";
			}
		} else {
			$sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_ledger WHERE id='$id'";
		}
	
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

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".$wpdb->base_prefix."bestbooks_ledger WHERE id='$id'";
			} else {
				$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".$wpdb->prefix."bestbooks_ledger WHERE id='$id'";
			}
		} else {
			$sql = "SELECT SUM(debit)-SUM(credit) AS Balance FROM ".$wpdb->prefix."bestbooks_ledger WHERE id='$id'";
		}
	
		$result = $wpdb->get_results($sql);
		$this->balance = number_format($result[0]->Balance, 2);

	}

	public function update($id, $account, $type, $date, $description, $debit, $credit) {
		global $wpdb;

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "UPDATE ".$wpdb->base_prefix."bestbooks_ledger SET name='$account',type='$type',txdate='$date',note='$description',debit=$debit,credit=$credit WHERE id='$id'";
			} else {
				$sql = "UPDATE ".$wpdb->prefix."bestbooks_ledger SET name='$account',type='$type',txdate='$date',note='$description',debit=$debit,credit=$credit WHERE id='$id'";
			}
		} else {
			$sql = "UPDATE ".$wpdb->prefix."bestbooks_ledger SET name='$account',type='$type',txdate='$date',note='$description',debit=$debit,credit=$credit WHERE id='$id'";
		}
		$result = $wpdb->get_results($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger table update failure: " . $sql);
		}

		return "Account updated successfully!";
	}

	public function getName() {
		return $this->name;
	}

	public function getType() {
		return $this->type;
	}

	public function addDebit($date, $desc, $amount) {
		global $wpdb;
		$this->balance = str_replace(',','',$this->balance);

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "INSERT INTO ".$wpdb->base_prefix."bestbooks_ledger (name,txdate,note,debit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";    		
			} else {
				$sql = "INSERT INTO ".$wpdb->prefix."bestbooks_ledger (name,txdate,note,debit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";    		
			}
		} else {
			$sql = "INSERT INTO ".$wpdb->prefix."bestbooks_ledger (name,txdate,note,debit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";    		
		}
			
		$result = $wpdb->query($sql);
		$ledger_insert_id = $wpdb->insert_id;

		if ($result===false) {
			throw new BestBooksException("Ledger table insertion failure: " . $sql);
		}

		$this->debit = $amount;
                
		if ($this->name !== 'Uncategorized') {
			$journal = new Journal();
			$journal->add($date,$ledger_insert_id ,$this->name,$amount,0.00);
			return "Debit amount:" . $amount . " inserted correctly into Ledger:" . $this->name;
		} else {
			return $ledger_insert_id;
		}
                
	}

	public function addCredit($date, $desc, $amount) {
		global $wpdb;
		$this->balance = str_replace(',','',$this->balance);
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "INSERT INTO ".$wpdb->base_prefix."bestbooks_ledger (name,txdate,note,credit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";    		
			} else {
				$sql = "INSERT INTO ".$wpdb->prefix."bestbooks_ledger (name,txdate,note,credit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";    		
			}
		} else {
			$sql = "INSERT INTO ".$wpdb->prefix."bestbooks_ledger (name,txdate,note,credit,balance,type) VALUES ('$this->name','$date','$desc','$amount','$this->balance','$this->type')";    		
		}
			
		$result = $wpdb->query($sql);
		$ledger_insert_id = $wpdb->insert_id;

		if ($result===false) {
			throw new BestBooksException("Ledger table insertion failure: " . $sql);
		}

		$this->credit = $amount;
		if ($this->name !== 'Uncategorized') {
			$journal = new Journal();
			$journal->add($date,$ledger_insert_id,$this->name,0.00,$amount);	
			return "Credit amount:" . $amount . " inserted correctly into Ledger:" . $this->name;
		} else {
			return $ledger_insert_id;
		}
	}

	public function getDebit() {
		return $this->debit;

	}

	public function getCredit() {
		return $this->credit;

	}

	public function getBalance() {
		return $this->balance;
	}

	public function setBalance($balance) {
		$this->balance = $balance;
	}

	public static function getAll() {
		global $wpdb;
		$results = array('total'=>0,'transactions'=>array());

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
	 * SELECT TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance * FROM Trasaction GROUP BY TransDate
	 * 
	 * --period of time balance
	 * SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalace FROM Trasaction WHERE TransDate BETWEEN CURDATE() AND ADDDATE(CURDATE() INTERVAL -30 DAY)
	 * 
	 * --customer balance
	 * SELECT CustId, (SUM(debit)*-1) + SUM(credit) AS CustomerBalance FROM Trasaction GROUP BY CustId
	 * 
	 */
	public function get_daily_balance($transdate) {
		global $wpdb;

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT txdate AS TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance FROM ".$wpdb->base_prefix."bestbooks_ledger GROUP BY txdate";
			} else {
				$sql = "SELECT txdate AS TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance FROM ".$wpdb->prefix."bestbooks_ledger  GROUP BY txdate";
			}
		} else {
			$sql = "SELECT txdate AS TransDate, (SUM(debit)*-1) + SUM(credit) AS DailyBalance FROM ".$wpdb->prefix."bestbooks_ledger  GROUP BY txdate";
		}
	
		$results = $wpdb->get_results($sql);
		return $results[0];
	}

	public function get_period_of_time_balance($begin_date,$end_date) {
		global $wpdb;

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalace FROM ".$wpdb->base_prefix."bestbooks_ledger WHERE txdate BETWEEN ".$begin_date." AND ".$end_date.";";
			} else {
				$sql = "SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalace FROM ".$wpdb->prefix."bestbooks_ledger WHERE txdate BETWEEN ".$begin_date." AND ".$end_date.";";
			}
		} else {
			$sql = "SELECT (SUM(debit)*-1) + SUM(credit) AS PeriodBalace FROM ".$wpdb->prefix."bestbooks_ledger WHERE txdate BETWEEN ".$begin_date." AND ".$end_date.";";
		}
	
		$results = $wpdb->get_results($sql);
		return $results[0]->PeriodBalance;
	}

	public static function remove($id) {
		global $wpdb;

		if (function_exists("is_plugin_active_for_network")) {
		  if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
			$sql = "DELETE FROM ".$wpdb->base_prefix."bestbooks_ledger WHERE id='$id';";
		  } else {
			$sql = "DELETE FROM ".$wpdb->prefix."bestbooks_ledger WHERE id='$id';";
		  }
		} else {
		  $sql = "DELETE FROM ".$wpdb->prefix."bestbooks_ledger WHERE id='$id';";
		}
	  
		$result = $wpdb->query($sql);
	
		if ($result===false) {
			throw new BestBooksException("Transaction record deletion error: ".$sql);
		}
		return "Transaction record deleted successfully";	
	}

	public static function createTable() {
        global $wpdb;

        //$sql = "CREATE TABLE `".$wpdb->prefix."Ledger` (`id` TINYINT AUTO_INCREMENT ,`name` VARCHAR( 255 ) NOT NULL,`txdate` DATE NOT NULL,`desc2` VARCHAR( 255 ) NOT NULL,`ref` DOUBLE NOT NULL,`debit` DECIMAL( 10, 2 ) NOT NULL ,`credit` DECIMAL( 10, 2 ) NOT NULL ,`balance` DECIMAL( 10, 2 ) NOT NULL ,`type` VARCHAR( 10 ) NOT NULL ,PRIMARY KEY ( `id` ) )";
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->base_prefix."bestbooks_ledger` (
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
				$sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->prefix."bestbooks_ledger` (
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
			$sql = "CREATE TABLE IF NOT EXISTS `".$wpdb->prefix."bestbooks_ledger` (
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
	
        $result = $wpdb->query($sql);

        if ($result === false) {
            throw new BestBooksException("Ledger table creation error: " . $sql);
        }

        return "Ledger table created successfully";
	}

	public static function alterTable() {
        global $wpdb;

		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "ALTER TABLE `".$wpdb->base_prefix."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
			} else {
				$sql = "ALTER TABLE `".$wpdb->prefix."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
			}
		} else {
			$sql = "ALTER TABLE `".$wpdb->prefix."bestbooks_ledger` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
		}
        $result = $wpdb->query($sql);

        if ($result === false) {
            throw new BestBooksException("Ledger table modify error: " . $sql);
        }

        return "Ledger table modified successfully";
	}

	public static function dropTable() {
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "DROP TABLE ".$wpdb->base_prefix."bestbooks_ledger";    		
			} else {
				$sql = "DROP TABLE ".$wpdb->prefix."bestbooks_ledger";    		
			}
		} else {
			$sql = "DROP TABLE ".$wpdb->prefix."bestbooks_ledger";    		
		}
	
		$result = $wpdb->query($sql);

		if ($result===false) {
			throw new BestBooksException("Ledger table drop failure");
		}

		return "Ledger table dropped successfully";
	}
}

?>