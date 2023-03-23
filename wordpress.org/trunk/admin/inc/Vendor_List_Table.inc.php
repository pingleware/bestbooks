<?php
if(!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Vendor_List_Table extends WP_List_Table {
	private $data = array();

	function get_columns() {
		$columns = array(
			'name' 	=> 'Name',
			'email'	=> 'Email',
			'action' => 'Action'
		  );
		  return $columns;
	}

	function get_sortable_columns() {
		$sortable_columns = array(
			'name' => array('name',false),
		  	'email'  => array('email',true),
		  	'action' => array('action',false)
		);
		return $sortable_columns;
	}
	function prepare_items() {
		global $wpdb;

		$columns = $this->get_columns();
		$hidden = array();
		$sortable = array();
		$this->_column_headers = array($columns, $hidden, $sortable);

		$vendors = get_users(array('role__in'=>array('bestbooks_vendor')));

		$index = 0;
		foreach($vendors as $vendor) {
			$vendor->metadata = get_user_meta($vendor->ID);
			$this->data[$index++] = array(
				'ID' => $vendor->ID,
				'name' => $vendor->display_name,
				'email'  => $vendor->user_email,
				'action' => '
					<select class="w3-input w3-block" data-id="'.$vendor->ID.'" data-name="'.$vendor->display_name.'" data-email="'.$vendor->user_email.'" data-vendor="'.base64_encode(json_encode($vendor)).'" onchange="vendorAction(this)">
						<option value="">Select</option>
						<option value="edit">Edit</option>
						<option value="1099">Send 1099</option>
						<option value="delete">Delete</option>
					</select>' 
			);
		}

		/**
		 * Pagination on WP_List_Table class
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