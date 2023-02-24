<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Banking_List_Table extends WP_List_Table {
	private $data = array();

	function get_columns() {
		return array(
			'id' => 'ID',
			'bank' => 'Bank',
			'balance' => 'Balance',
			'action' => 'Action'
		);
	}
	function get_sortable_columns() {
		return array(
			'id' => array('id',true),
		  	'bank' => array('bank',false),
		  	'balance' => array('balanace',false),
		  	'action' => array('action', false)
		);
	}

	function get_bulk_actions() {
		$actions = array(
		  'delete'    => 'Delete'
		);
		return $actions;
	}

	function prepare_items() {
		$columns = $this->get_columns();
		$hidden = array();
		$sortable = array();
		$this->_column_headers = array($columns, $hidden, $sortable);

		$args = array(
			'post_type' => 'bestbooks_bank',
			'post_status' => 'publish'
		);
		
		$active_company = bestbooks_get_active_company();
		if ($active_company > 1) {
			$args['meta_key'] = 'company';
			$args['meta_value'] = $active_company;
			$args['meta_compare'] = '=';
		}
		$banks = get_posts($args);
		$index = 0;

		foreach($banks as $post) {
			$bank = array(
				'id' => $post->ID,
				'name' => $post->post_title,
				'account_number' => get_post_meta($post->ID,'account_number',true),
				'opening_date' => get_post_meta($post->ID,'opening_date',true),
				'url' => get_post_meta($post->ID,'url',true),
				'opening_deposit' => get_post_meta($post->ID,'opening_deposit',true),
				'origination' => get_post_meta($post->ID,'origination',true)
			);
			$name = $post->post_title;
			$journal = new Journal();
			$balance = $journal->balance($name);
			$this->data[$index++] = array(
				'id' => $post->ID,
				'bank' => $name,
				'balance' => $balance,
				'action' => '<select class="w3-input" onchange="bankAction(this)" data-id="'.$bank['id'].'" data-name="'.$name.'" data-bank="'.base64_encode(json_encode($bank)).'">
				<option value="">Select</option>
				<option value="view">View Transactions</option>
				<option value="delete">Delete</option>
				</select>'
			);
		}

		/*
		$coa = get_coa_instance();
		$index = 0;

		foreach($coa->account as $name => $type) {
			if ($type === 'Bank') {
				$post = get_page_by_title($name,OBJECT,'bank');
				$bank = array();
				if (!is_wp_error($post)) {
					$bank = array(
						'id' => $post->ID,
						'name' => $post->post_title,
						'account_number' => get_post_meta($post->ID,'account_number',true),
						'opening_date' => get_post_meta($post->ID,'opening_date',true),
						'url' => get_post_meta($post->ID,'url',true),
						'opening_deposit' => get_post_meta($post->ID,'opening_deposit',true)
					);
				}

				$journal = new Journal();
				$balance = $journal->balance($name);

				$this->data[$index++] = array(
					'bank' => $name,
					'balance' => $balance,
					'action' => '<select class="w3-input" onchange="bankAction(this)" data-id="'.$bank['id'].'" data-name="'.$name.'" data-bank="'.base64_encode(json_encode($bank)).'">
					<option value="">Select</option>
					<option value="edit">Edit</option>
					<option value="view">View Transactions</option>
					<option value="reconcile">Reconcile</option>
					<option value="delete">Delete</option>
					</select>'
				);
			}
		}
		*/

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