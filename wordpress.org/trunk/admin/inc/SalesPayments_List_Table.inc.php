<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}


if (!class_exists('SalesPayments_List_Table')) {
    class SalesPayments_List_Table extends WP_List_Table {
        private $data = array();
        public $invoices = array();
    
        function get_columns() {
            $columns = array(
                'payment_date'      => 'Payment Date',
                'invoice_number'	=> 'Invoice Number',
                'payment_type'	    => 'Payment Type',
                'amount'            => 'Amount',
                'action'            => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'payment_date'      => array('payment_date',false),
                'invoice_number'    => array('invoice_number',true),
                'payment_type'      => array('payment_type',false),
                'amount'            => array('amount',false),
                'action'            => array('action', false)
            );
            return $sortable_columns;
        }
    
        function prepare_items() {
            global $wpdb;
    
            $columns = $this->get_columns();
            $hidden = array();
            $sortable = array();
            $this->_column_headers = array($columns, $hidden, $sortable);
    
            $invoices = get_posts(
                array(
                    'post_type' => 'bestbooks_invoice',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'orderby' => 'post_date',
                    'order' => 'DESC',
                )
            );
        
            $this->invoices = $invoices;
            $payments = array();
        
            foreach($invoices as $invoice) {
                $metadata = json_decode($invoice->post_content, true);
                if (isset($metadata['payments'])) {
                    $payments[] = $invoice;
                }
            }
    
            $index = 0;
            foreach($payments as $payment) {
                $metadata = json_decode($payment->post_content, true);
                $total_payments = $metadata['payments'];
    
                for($i=1; $i<=$total_payments; $i++) {
                    $payment_type = $metadata['payment_type_'.$i];
                    $payment_amount = $metadata['payment_amount_'.$i];
                    $payment_date = $metadata['payment_date_'.$i];
    
                    $this->data[$index++] = array(
                        'payment_date' => $payment_date,
                        'invoice_number' => $metadata['estimate-invnum'],
                        'payment_type' => $payment_type,
                        'amount' => $payment_amount,
                        'action' => '
                        <select class="w3-input w3-block" data-id="'.$index.'" onchange="paymentAction(this)">
                        <option value="">Select</option>
                        <option value="edit">Edit</option>
                        <option value="view">View Receipt</option>
                        <option value="send">Send Receipt</option>
                        <option value="delete">Delete</option>
                        </select>' 
    
                    );		
                }
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