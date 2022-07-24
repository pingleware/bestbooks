<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class JournalTransactions_List_Table extends WP_List_Table {
	private $data = array();

	function get_columns() {
		return array(
			'id' => 'ID',
			'date' => 'Date',
			'ref' => 'Reference',
			'account'    => 'Account',
			'debit'      => 'Debit',
			'credit'	=> 'Credit',
			'action'	=> 'Action'
		  );
	}

	function get_sortable_columns() {
		return array(
			'id' => array('id',true),
		  'date'  => array('date',false),
		  'ref' => array('ref',false),
		  'account' => array('account',false),
		  'debit'   => array('debit',false),
		  'credit'  => array('credit',false),
		  'account' => array('action',false)
		);
	}

	function bulk_actions($which = "") {
		global $wpdb;

		if ($which == 'top') {
			echo '<form method="get">';
			echo '<input type="hidden" name="page" value="'.$_GET['page'].'" />';
			$this->bulk_actions_display_month_dropdown();
			$this->bulk_actions_display_year_dropdown();
			echo '<input type="submit" name="filter" value="Filter" class="button" />';
			echo '</form>';
		} elseif ($which == 'bottom') {
			$where = $this->get_where();
			if (function_exists("is_plugin_active_for_network")) {
				if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
					$total_debit = "SELECT SUM(debit) AS total FROM ".$wpdb->base_prefix."bestbooks_journal $where ORDER BY txdate ASC";
					$total_credit = "SELECT SUM(credit) AS total FROM ".$wpdb->base_prefix."bestbooks_journal $where ORDER BY txdate ASC";
				} else {
					$total_debit = "SELECT SUM(debit) AS total FROM ".$wpdb->prefix."bestbooks_journal $where ORDER BY txdate ASC";
					$total_credit = "SELECT SUM(credit) AS total FROM ".$wpdb->prefix."bestbooks_journal $where ORDER BY txdate ASC";
				}
			} else {
				$total_debit = "SELECT SUM(debit) AS total FROM ".$wpdb->prefix."bestbooks_journal $where ORDER BY txdate ASC";
				$total_credit = "SELECT SUM(credit) AS total FROM ".$wpdb->prefix."bestbooks_journal $where ORDER BY txdate ASC";
			}
			$debit = $wpdb->get_results($total_debit);
			$credit = $wpdb->get_results($total_credit);

            echo 'Totals:   Debit <input type="number" value="'.$debit[0]->total.'" />&nbsp; Credit <input type="number" value="'.$credit[0]->total.'" />';
		}
	}

	function bulk_actions_display_month_dropdown() {
		$months = array('January','February','March','April','May','June','July','August','September','October','November','December');
		echo '<select name="month"><option value="">Filter by Month</option>';
		foreach($months as $index => $month) {
			$selected = '';
			if (isset($_GET['month'])) {
				if ($index == ($_GET['month'] - 1)) {
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

		$index = 0;
		foreach($transactions as $transaction) {
			$this->data[$index++] = array(
				'id'=>$transaction->id, 
				'date' => $transaction->txdate, 
				'ref' => $transaction->ref, 
				'account' => $transaction->account, 
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
		return $where;
	}

	function column_default( $item, $column_name ) {
		switch( $column_name ) { 
			case 'id':
			case 'date':
			case 'ref':
		  	case 'account':
		  	case 'debit':
			case 'credit':
			case 'action':
				return $item[ $column_name ];
		  	default:
				return print_r( $item, true ) ; //Show the whole array for troubleshooting purposes
		}
	}
}
?>