<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('PurchaseBills_List_Table')) {
    class PurchaseBills_List_Table extends WP_List_Table {
        private $data = array();
        public $po_num = 0;
    
        function get_columns() {
            $columns = array(
                'status' => 'Status',
                'date'	=> 'Date',
                'description' => 'Description',
                'account' 	=> 'Account',
                'amount' => 'Amount',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'status' => array('status',false),
                'date'  => array('date',true),
                'description' => array('description',false),
                'account'   => array('account',false),
                'amount' => array('amount',false),
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
                'meta_value' => 'purchase_bill',
                'meta_compare' => '='
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
                        'value' => 'purchase_bill',
                        'compare' => '='        
                    ),
                    array(
                        'key' => 'company',
                        'value' => $active_company,
                        'compare' => '='        
                    )
                );
            }
    
            $posts = get_posts($args);

            $po_num = count($posts) + 1;
            $this->po_num = 'PO-' . date('Ymd') . '-' . substr("000000{$po_num}", -6);
    
            $purchases = array();
            $index=0;
            foreach($posts as $post) {
                $post->metadata = json_decode($post->post_content, true);
                $status = get_post_meta($post->ID,'status',true);
                $this->data[$index++] = array(
                    'ID' => $post->ID,
                    'date'  => $post->post_date,
                    'description'   => $post->post_title,
                    'account' => get_post_meta($post->ID,'account',true),
                    'amount' => get_post_meta($post->ID,'amount',true),
                    'status' => $status,
                    'action' => '<select class="w3-input" onchange="billAction(this)" data-id="'.$post->ID.'" data-status="'.$status.'" data-bank="'.base64_encode(json_encode($post)).'">
                    <option value="">Select</option>
                    <option value="pay">Pay</option>
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
}
?>