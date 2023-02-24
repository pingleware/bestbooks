<?php
if(!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}


class PurchaseOrder_List_Table extends WP_List_Table {
	private $data = array();
	public static $po_num = 0;

	function get_columns() {
		$columns = array(
			'date'	=> 'Date',
			'description' => 'PO Number',
			'amount' => 'Amount',
			'status' => 'Status',
			'action' => 'Action'
		  );
		  return $columns;
	}

	function get_sortable_columns() {
		$sortable_columns = array(
			'date'  => array('date',true),
		  	'description' => array('description',false),
		  	'amount' => array('amount',false),
			'status' => array('status',false),
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

		$args = array(
			'post_type' => 'bestbooks_purchase',
			'post_status' => 'publish',
			'numberposts' => -1,
			'orderby' => 'post_date',
			'order' => 'DESC',
			'meta_key' => 'bill_type',
			'meta_value' => 'purchase_order',
			'meta_compare' => '='
		);

		$args2 = array(
			'post_type'=>'bestbooks_purchase',
			'post_status'=>'publish',
			'numberposts'=>-1
		);

		$active_company = bestbooks_get_active_company();
		if ($active_company > 1) {
			unset($args['meta_key']);
			unset($args['meta_value']);
			unset($args['meta_compare']);

			$args['meta_query'] = array(
				'relation' => 'AND',
				array(
					'key' => 'bill_type',
					'value' => 'purchase_order',
					'compare' => '='        
				),
				array(
					'key' => 'company',
					'value' => $active_company,
					'compare' => '='        
				)
			);

			$args2['meta_key'] = 'company';
			$args2['meta_value'] = $active_company;
			$args2['meta_compare'] = '=';
		}

		$posts = get_posts($args);
        $all_purchases = get_posts($args2);

		$po_num = count($posts) + count($all_purchases) + 1;
		PurchaseOrder_List_Table::$po_num = 'PO-' . date('Ymd') . '-' . substr("000000{$po_num}", -6);

		$purchases = array();
		$index=0;
		foreach($posts as $post) {
			$metadata = json_decode($post->post_content, true);
			$post->metadata = $metadata;
			$this->data[$index++] = array(
				'ID' => $post->ID,
				'date'  => $post->post_date,
				'description'   => $post->post_title,
				'amount' => get_post_meta($post->ID,'amount',true),
				'status' => get_post_meta($post->ID,'status',true),
				'action' => '
				<select class="w3-input w3-block" data-id="'.$post->ID.'" data-status="'.get_post_meta($post->ID,'status',true).'" onchange="poAction(this)" data-po="'.base64_encode(json_encode($post)).'">
				<option value="">Select</option>
				<option value="edit">Edit</option>
				<option value="view">View/Print</option>
				<option value="send">Send</option>
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