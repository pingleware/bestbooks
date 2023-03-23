<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}


if (!class_exists('CustomerStatements_List_Table')) {
    class CustomerStatements_List_Table extends WP_List_Table {
        private $data = array();
        private $customer_id = 0;
    
    
        function get_columns() {
            $columns = array(
                'customer' 	=> 'Customer',
                'date'	=> 'Statement Date',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'customer' => array('customer',false),
                  'date' => array('date',true),
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
    
            $statements = get_posts(
                array(
                    'post_type' => 'customer_statement',
                    'post_status' => 'publish',
                    'posts_per_page' => -1
                )
            );
            $index = 0;
            foreach($statements as $statement) {
                if (isset($_REQUEST['cid'])) {
                    $this->customer_id = $_REQUEST['cid'];
                }
                $customer_id = $this->customer_id;
    
                $this->data[$index++] = array(
                    'ID' => $statement->ID,
                    'customer' => $customer_id,
                    'date' => $statement->post_date,
                    'action' => '
                        <select class="w3-input w3-block" data-id="'.$index.'" onchange="estimateAction(this)">
                            <option value="">Select</option>
                            <option value="edit">Edit</option>
                            <option value="view">View</option>
                            <option value="send">Send</option>
                            <option value="print">Print</option>
                            <option value="send">Send</option>
                            <option value="delete">Delete</option>
                        </select>' 
                );
            }
    
            $this->items = $this->data;
        }
    
        function column_default( $item, $column_name ) {
            return $item[ $column_name ];
        }
    
        function refresh($customer_id) {
            $this->customer_id = $customer;
            $this->prepare_items();
            $this->display();
        }
    }    
}
?>