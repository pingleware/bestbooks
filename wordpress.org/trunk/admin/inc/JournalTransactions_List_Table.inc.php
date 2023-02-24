<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class JournalTransactions_List_Table extends WP_List_Table {
	private $data = array();

	function get_columns() {
		return array(
			'name' 		=> 'Name',
			'id' 		=> 'ID',
			'date' 		=> 'Date',
			'ref' 		=> 'Reference',
			'account'   => 'Account',
			'debit'     => 'Debit',
			'credit'	=> 'Credit',
			'action'	=> 'Action'
		  );
	}

	function get_sortable_columns() {
		return array(
			'name' 		=> array('name', false),
			'id' 		=> array('id',true),
		  	'date'  	=> array('date',false),
		  	'ref' 		=> array('ref',false),
			'account' 	=> array('account',false),
		  	'debit'   	=> array('debit',false),
		  	'credit'  	=> array('credit',false),
		  	'account' 	=> array('action',false)
		);
	}

	function bulk_actions($which = "") {
		global $wpdb;

		if ($which == 'top') {
			echo '<form method="get">';
			echo '<input type="hidden" name="page" value="'.$_GET['page'].'" />';
			$this->bulk_actions_display_journals_dropdown();
			$this->bulk_actions_display_month_dropdown();
			$this->bulk_actions_display_year_dropdown();
			echo '<input type="submit" name="filter" value="Filter" class="button" />';
			echo '</form>';
		} elseif ($which == 'bottom') {
			if (isset($_GET['journal']) && !empty($_GET['journal'])) {
				$where = $this->get_where();
				$totals = Journal::getDebitCreditTotals($where);
				echo 'Totals:   Debit <input type="number" value="'.$totals['db'].'" />&nbsp; Credit <input type="number" value="'.$totals['cr'].'" />';	
			}
		}
	}

	function bulk_actions_display_journals_dropdown() {
		$journals = Journal::listJournals();
		echo '<select name="journal"><option value="">Filter by Journal</option>';
		foreach($journals as $index => $journal) {
			$selected = '';
			if (isset($_GET['journal'])) {
				if ($journal === $_GET['journal']) {
					$selected = 'selected';
				}
			}

			echo '<option value="'.$journal.'" '.$selected.'>'.$journal.'</option>';
		}
		echo '</select>';
	}

	function bulk_actions_display_month_dropdown() {
		$months = array('January','February','March','April','May','June','July','August','September','October','November','December');
		echo '<select name="month"><option value="">Filter by Month</option>';
		foreach($months as $index => $month) {
			$selected = '';
			if (isset($_GET['month'])) {
				if (intval($index) == ($_GET['month'] - 1)) {
					$selected = 'selected';
				}
			}

			echo '<option value="'.sprintf("%02d",$index + 1).'" '.$selected.'>'.$month.'</option>';
		}
		echo '</select>';
	}

	function bulk_actions_display_year_dropdown() {
		echo '<select name="year"><option value="">Filter by Year</option>';
		for($year = date('Y') - 7; $year < date('Y') + 7; $year++) {
			$selected = '';
			if (isset($_GET['year'])) {
				if ($year == $_GET['year']) {
					$selected = 'selected';
				}
			}
			echo '<option value="'.$year.'" '.$selected.'>'.$year.'</option>';
		}
		echo '</select>';
	}
  
	function prepare_items() {
		$columns = $this->get_columns();
		$hidden = array();
		$sortable = array();
		$this->_column_headers = array($columns, $hidden, $sortable);

		$where = $this->get_where();

		global $wpdb;

		$paged = (isset($_GET['paged']) ? $_GET['paged'] : 1);

		$sql = "SELECT * FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal $where ORDER BY txdate ASC";
		$totals = "SELECT COUNT(*) AS total FROM ".bestbooks_get_wpdb_prefix()."bestbooks_journal ORDER BY txdate ASC";
	
		/*
		if (function_exists("is_plugin_active_for_network")) {
			if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
				$sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_journal $where ORDER BY txdate ASC";
				$totals = "SELECT COUNT(*) AS total FROM ".$wpdb->base_prefix."bestbooks_journal ORDER BY txdate ASC";
			} else {
				$sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal $where ORDER BY txdate ASC";
				$totals = "SELECT COUNT(*) AS total FROM ".$wpdb->prefix."bestbooks_journal ORDER BY txdate ASC";
			}
		} else {
			$sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_journal $where ORDER BY txdate ASC";
			$totals = "SELECT COUNT(*) AS total FROM ".$wpdb->prefix."bestbooks_journal ORDER BY txdate ASC";
		}
		*/
	
		$results = $wpdb->get_results($totals);
		$total = $results[0]->total;
		$limit = 10;
		$pages = intval($total / $limit);
		$next = $pages + $paged;
		$start = $next;
		$prev = $paged - $limit;
		if ($paged == 1) {
			$start = 0;
			$prev = 1;
		}
		//$sql .= " LIMIT $paged,$limit";
		$transactions = $wpdb->get_results($sql);

		$privacy = get_option('bestbooks_privacy');

		$index = 0;
		foreach($transactions as $transaction) {
			$account = $transaction->account;
			if ($privacy === "yes") {
				$account = "**********";
			}
			$this->data[$index++] = array(
				'name'=>$transaction->name,
				'id'=>$transaction->id, 
				'date' => $transaction->txdate, 
				'ref' => $transaction->ref, 
				'account' => $account, 
				'debit'=>$transaction->debit, 
				'credit' => $transaction->credit,
				'action' => '
				<select class="w3-input w3-block" data-id="'.$transaction->id.'" data-transaction="'.base64_encode(json_encode($transaction)).'" onchange="journalAction(this)">
					<option value="">Select</option>
					<option value="edit">Edit</option>
					<option value="delete">Delete</option>
				</select>' 
			);
		}

		$perPage = 15;
		$currentPage = $this->get_pagenum();
		$totalItems = count($this->data);

		$this->set_pagination_args( array(
			'total_items' => $totalItems,
			'per_page'    => $perPage
		) );            
		
		$this->data = array_slice($this->data,(($currentPage-1)*$perPage),$perPage);
	
		$this->items = $this->data;
	}

	function get_where() {
		$where = '';
		if (isset($_GET['year']) && !empty($_GET['year'])) {
			$year = $_GET['year'];
			$where = " WHERE YEAR(txdate)='$year' ";
		}
		if (isset($_GET['month']) && !empty($_GET['month'])) {
			$month = $_GET['month'];
			if (empty($where)) {
				$where = " WHERE MONTH(txdate)='$month' ";
			} else {
				$where .= " AND MONTH(txdate)='$month' ";
			}
		}
		if (empty($where) && isset($_GET['journal'])) {
			$where = " WHERE name='".$_GET['journal']."'";
		} elseif (isset($_GET['journal'])) {
			$where .= " AND name='".$_GET['journal']."'";
		}
		return $where;
	}

	function column_default( $item, $column_name ) {
		return $item[ $column_name ];
	}
}
?>