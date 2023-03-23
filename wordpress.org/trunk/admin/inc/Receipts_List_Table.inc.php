<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('Receipts_List_Table')) {
    class Receipts_List_Table extends WP_List_Table {
        private $data = array();
        function get_columns() {
            $columns = array(
                'status' 	=> 'Status',
                'image'	=> 'Image',
                'receipt' => 'Receipt',
                'date'	=> 'Date',
                'amount' => 'Amount',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'status' => array('status',false),
                  'image' => array('image',false),
                  'receipt'   => array('receipt',false),
                  'date'  => array('date',true),
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
                'post_type' => 'bestbooks_receipt',
                'post_status' => 'publish',
                'posts_per_page' => -1
            );
            		
            $active_company = bestbooks_get_active_company();
            if ($active_company > 1) {
                $args['meta_key'] = 'company';
                $args['meta_value'] = $active_company;
                $args['meta_compare'] = '=';
            }

    
            $receipts = get_posts($args);

            $index = 0;
            foreach($receipts as $receipt) {
                $args = array(
                    'post_type' => 'attachment', 
                    'posts_per_page' => 1, 
                    'post_status' =>'any', 
                    'post_parent' => $receipt->ID
                ); 
                $attachment = get_posts($args);
                $receipt->image_url = $attachment[0]->guid;
                if (get_post_meta($receipt->ID,'bestbooks_status',true) !== null) {
                    $receipt->status = get_post_meta($receipt->ID,'bestbooks_status',true);
                } else {
                    $receipt->status = 'uploaded';
                }
    
                $total = get_post_meta($receipt->ID,'total',true);
                if ($total === null) {
                    $total = 0.00;
                }
    
                $this->data[$index++] = array(
                    'ID' => $receipt->ID,
                    'status' => $receipt->status,
                    'image' => '<img onclick="enlargeImage(this)" data-id="'.$receipt->ID.'" data-total-amount="'.$total.'" style="cursor:pointer;" src="'.$receipt->image_url.'" width="100" height="100" />',
                    'receipt'   => $receipt->post_title,
                    'date'  => $receipt->post_date,
                    'amount' => $total,
                    'action' => '
                        <select class="w3-input w3-block" data-id="'.$receipt->ID.'" onchange="estimateAction(this)">
                            <option value="">Select</option>
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