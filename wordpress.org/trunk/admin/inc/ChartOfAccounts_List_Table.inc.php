<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class ChartOfAccounts_List_Table extends WP_List_Table {
	private $data = array();

	function get_columns() {
		$columns = array(
			'name' => 'Name',
			'type'    => 'Type',
			'balance' => 'Balance',
			'inuse'      => 'In-Use'
		  );
		  return $columns;
	}

	function get_sortable_columns() {
		return array(
		  'name'  => array('name',true),
		  'type' => array('type',false),
		  'balance' => array('type',false),
		  'inuse'   => array('inuse',false)
		);
	}

	function prepare_items() {
		$columns = $this->get_columns();
		$hidden = array();
		$sortable = array();
		$this->_column_headers = array($columns, $hidden, $sortable);

		$coa = get_coa_instance();
		$index = 0;

		$privacy = get_option('bestbooks_privacy');

		foreach($coa->account as $name => $type) {
			if (!empty($name) && !empty($type)) {
				$inuse = 'Yes';
				if ($coa->in_use($name) === false) {
					$inuse = 'No, <button data-id="'.$name.'" class="delete-button fa fa-trash">Delete</button>';
				}
				$account = new Ledger($name,$type);
				$balance = $account->getBalance();
				$account_name = $name;
				if ($privacy === "yes") {
					$account_name = "**********";
				}	
				$this->data[$index++] = array(
					'ID'=>$index + 1, 
					'name' => $account_name, 
					'type' => $type,
					'balance' => (floatval($balance) < 0 ? "(".number_format(abs(floatval($balance)),2).")" : $balance), 
					'inuse' => $inuse
				);	
			}
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

	function column_default( $item, $column_name ) {
		return $item[ $column_name ];
	}
}
?>