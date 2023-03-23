<?php
/**
 * @package bestbooks
 * @subpackage library
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2009-2021 PressPage Entertainment Inc. DBA PINGLEWARE
 */
if(!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('SalesEstimatesRejected_List_Table')) {
    class SalesEstimatesRejected_List_Table extends WP_List_Table {
        private $data = array();
        public $estimate_num = 0;
    
        function get_columns() {
            $columns = array(
                'status' 	=> 'Status',
                'date'	=> 'Date',
                'number'	=> 'Number',
                'customer' => 'Customer',
                'amount' => 'Amount',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'status' => array('status',false),
                  'date'  => array('date',true),
                  'number' => array('number',false),
                  'customer'   => array('customer',false),
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
    
            $estimates = get_posts(
                array(
                    'post_type' => 'bestbooks_invoice',
                    'post_status' => 'reject',
                    'numberposts' => -1,
                    'orderby' => 'post_date',
                    'order' => 'DESC',
                )
            );
            $publish = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'publish','numberposts' => -1));
            $draft = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'draft','numberposts' => -1));
            if (!is_array($publish)) {
                $publish = array();
            }
            if (!is_array($draft)) {
                $draft = array();
            }
            $estimate_num = count($estimates) + count($publish) + count($draft) + 1;
            $this->estimate_num = 'E' . date('Ymd') . '-' . substr("0000{$estimate_num}", -4);
            $index = 0;
    
            foreach($estimates as $estimate) {
                $metadata = json_decode($estimate->post_content, true);
                $customer = get_user_by('id', $metadata['estimate-customer']);
    
                $items = $metadata['items'];
                $total = 0;
                for ($i=0; $i<$items; $i++) {
                    $total += $metadata['item_total_'.($i+1)];
                }
                $this->data[$index++] = array(
                    'ID' => $estimate->ID,
                    'status' => $metadata['estimate-status'],
                    'date'  => $estimate->post_date,
                    'number' => $metadata['estimate-invnum'],
                    'customer'   => $customer->display_name . ' ['.$customer->user_email.']',
                    'amount' => number_format($total,2),
                    'action' => '
                        <select class="w3-input w3-block" data-id="'.$estimate->ID.'" data-estimate="'.base64_encode(json_encode($estimate)).'" onchange="estimateAction(this)">
                            <option value="">Select</option>
                            <option value="edit">Edit</option>
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