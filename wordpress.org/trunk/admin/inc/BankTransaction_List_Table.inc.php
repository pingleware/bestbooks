<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class BankTransaction_List_Table extends WP_List_Table {
	private $data = array();

	function get_columns() {
		return array(
			'cb'=>'<input type="checkbox"/>',
			'date' => 'Transaction Date',
			'reference' => 'Reference',
			'cleared' => 'X',
			'debit' => 'Debit',
			'credit' => 'Credit',
			'action' => 'Action'
		);
	}
	function get_sortable_columns() {
		return array(
		  'date' => array('date',true),
		  'reference'   => array('reference',false),
		  'cleared' => array('cleared',false),
		  'debit' => array('debit',false),
		  'credit' => array('credit',false),
		  'action' => array('action', false)
		);
	}

	function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="transactions[]" value="%s" />', $item['ID']
        );    
	}
	
	function bulk_actions($which = "") {
		if ($which == 'top') {
			echo '<form method="get">';
			echo '<input type="hidden" name="page" value="'.$_REQUEST['page'].'" />';
			echo '<input type="hidden" name="bank" value="'.$_REQUEST['bank'].'" />';
			$this->bulk_actions_display();
			echo '<input type="submit" name="bulk_action" value="Apply" class="button" />&nbsp;';
			$this->bulk_actions_display_month_dropdown();
			$this->bulk_actions_display_year_dropdown();
			echo '<input type="submit" name="filter" value="Filter" class="button" />';
		} elseif ($which == 'bottom') {
			echo '</form>';
		}
	}

	function bulk_actions_display() {
		$actions = array(
			'delete'    => 'Delete'
		);
		echo '<select name="bulk_action"><option value="">Bulk Actions</option>';
		foreach($actions as $action) {
			echo '<option value="delete">Delete</option>';
		}
		echo '</select>';
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

		$where = '';
		if (isset($_GET['year']) && !empty($_GET['year'])) {
			$year = $_GET['year'];
			$where = " AND YEAR(txdate)='$year' ";
		}
		if (isset($_GET['month']) && !empty($_GET['month'])) {
			$month = $_GET['month'];
			if (empty($where)) {
				$where = " AND MONTH(txdate)='$month' ";
			} else {
				$where .= " AND MONTH(txdate)='$month' ";
			}
		}

		$name = $_GET['bank'];
		$bank = new Journal();
		$transactions = $bank->transactions($name,$where);

		$index = 0;
		foreach($transactions as $transaction) {
			$this->data[$index++] = array(
				'ID' => $transaction->id,
				'date' => $transaction->txdate,
				'reference'   => $transaction->ref,
				'cleared' => '',
				'debit' => $transaction->debit,
				'credit' =>  $transaction->credit,
				'action' => '<select class="w3-input" onchange="bankTransactionAction(this)" data-transaction="'.base64_encode(json_encode($transaction)).'">
					<option value="">Select</option>
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

	function no_items() {
		echo 'No transactions found?';
	}

	function column_default( $item, $column_name ) {
		return $item[ $column_name ];
	}
}
?>