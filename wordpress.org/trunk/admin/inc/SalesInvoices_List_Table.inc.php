<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}


if (!class_exists('SalesInvoices_List_Table')) {
    class SalesInvoices_List_Table extends WP_List_Table {
        private $data = array();
        public $invoice_num = 0;

        public function __construct() {
            $posts = get_posts(
                array(
                    'post_type' => 'bestbooks_invoice',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'orderby' => 'post_date',
                    'order' => 'DESC',
                )
            );
            
            $invoices = array();
            foreach($posts as $post) {
                $metadata = json_decode($post->post_content, true);
                if (isset($metadata['recurring'])) {
                    if ($metadata['recurring'] === 'no') {
                        $invoices[] = $post;
                    }
                } else {
                    $invoices[] = $post;
                }
            }
            $draft = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'draft', 'numberposts' => -1));
            $reject = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'reject', 'numberposts' => -1));
            if (!is_array($draft)) {
                $draft = array();
            }
            if (!is_array($reject)) {
                $reject = array();
            }

            $invoice_num = count($invoices) + count($draft) + count($reject) + 1;
            $this->invoice_num = 'I' . date('Ymd') . '-' . substr("0000{$invoice_num}", -4);
            parent::__construct();
        }
    
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
    
            $posts = get_posts(
                array(
                    'post_type' => 'bestbooks_invoice',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'orderby' => 'post_date',
                    'order' => 'DESC',
                )
            );
            $invoices = array();

            foreach($posts as $post) {
                $metadata = json_decode($post->post_content, true);
                if (isset($metadata['recurring'])) {
                    if ($metadata['recurring'] === 'no') {
                        array_push($invoices, $post);
                    }
                } else {
                    array_push($invoices, $post);
                }
            }
            $draft = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'draft', 'numberposts' => -1));
            $reject = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'reject', 'numberposts' => -1));
            if (!is_array($draft)) {
                $draft = array();
            }
            if (!is_array($reject)) {
                $reject = array();
            }
            $index=0;
            //$_invoices = zeroBS_getInvoices(true, 20);
            //echo '<pre>'; print_r($invoices); echo '</pre>'; exit;

            foreach($invoices as $invoice) {
                //if ($invoice['recurring'] === 'no') {
                    $metadata = json_decode($invoice->post_content, true);
                    //echo '<pre>'; print_r(get_post_meta($post->ID)); echo '</pre>';
                    $customer_id = get_post_meta($post->ID,'estimate-customer',true);
                    $customer = get_user_by('id',$customer_id);
                    //$state = $metadata['tax_state'];

                    $items = $metadata['items'];
                    $total = 0;
                    for ($i=0; $i<$items; $i++) {
                        $total += $metadata['item_total_'.($i+1)];
                    }
                    $this->data[$index++] = array(
                        'ID' => $invoice->ID,
                        'status' => get_post_meta($post->ID,'estimate-status',true),
                        'date'  => $invoice->post_date,
                        'number' => $metadata['estimate-invnum'],
                        'customer'   => $customer->display_name . ' ['.$customer->user_email.']',
                        'amount' => number_format($total,2),
                        'action' => '
                            <select class="w3-input w3-block" data-id="'.$invoice->ID.'" data-total="'.$total.'" data-invoice="'.base64_encode(json_encode($invoice)).'" onchange="invoiceAction(this)">
                                <option value="">Select</option>
                                <option value="edit">Edit</option>
                                <option value="view">View/Print</option>
                                <option value="send">Send</option>
                                <option value="recurring">Make Recurring</option>
                                <option value="paid">Mark as Paid</option>
                                <option value="deferred">Deferred</option>
                                <option value="baddebt">Bad Debt</option>
                                <option value="delete">Delete</option>
                            </select>' 
                    );
                //}
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