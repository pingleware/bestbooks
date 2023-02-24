<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('SalesCustomers_List_Table')) {
    class SalesCustomers_List_Table extends WP_List_Table {
        private $data = array();
    
        function get_columns() {
            $columns = array(
                'name' 	=> 'Name',
                'email' => 'Email',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'name' => array('name',false),
                'email' => array('email',false),
                'action' => array('action', false)
            );
            return $sortable_columns;
        }
    
        function prepare_items() {
            global $wpdb;
    
            $columns = $this->get_columns();
            $hidden = array();
            $sortable = array();
            $this->_column_headers = array($columns, $hidden, $sortable);

            $bestbooks_customer = get_option("bestbooks_customer");
            if (isset($bestbooks_customer) === false) {
                $bestbooks_customer = "bestbooks_customer";
            }
            $customers = get_users(array('role__in'=>array($bestbooks_customer)));
    
            $index = 0;
            foreach($customers as $customer) {
                $customer->metadata = get_user_meta($customer->ID);
                $this->data[$index++] = array(
                    'ID' => $index,
                    'name' => $customer->display_name,
                    'email' => $customer->user_email,
                    'action' => '
                    <select class="w3-input w3-block" data-id="'.$customer->ID.'" data-customer="'.base64_encode(json_encode($customer)).'" onchange="customerAction(this)">
                    <option value="">Select</option>
                    <option value="edit">View/Edit</option>
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