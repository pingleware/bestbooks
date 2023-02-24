<?php
/**
 * Estimate List Table definition
 * 
 * @package bestbooks
 * @subpackage library
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2009-2021 PressPage Entertainment Inc. DBA PINGLEWARE
 */

if(!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('SalesEstimates_List_Table')) {
	/**
	 * WP_List_Table for Estimates
	 * 
	 * @method void __construct()
	 * @method array get_columns()
	 * @method string column_default()
	 * @method void prepare_items()
	 * @method static get_data()
	 * @method string column_number(array $item)
	 * @method array get_bulk_actions()
	 * @method string column_cb(array $item)
	 */
    class SalesEstimates_List_Table extends WP_List_Table {
        private $data = array();
        public $estimate_num = 0;

	    /**
	     * Constructor
	     * @param none
	     * @return nothing
	     */
	    function __construct() {
            $estimates = get_posts(
                array(
                    'post_type' => 'bestbooks_invoice',
                    'post_status' => 'draft',
                    'numberposts' => -1,
                    'orderby' => 'post_date',
                    'order' => 'DESC',
                )
            );
            $estimate_num = 0;
            $publish = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'publish','numberposts' => -1));
            $reject = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'reject','numberposts' => -1));
            if (!is_array($publish)) {
                $publish = array();
            }
            if (!is_array($reject)) {
                $reject = array();
            }
            $estimate_num = count($estimates) + count($publish) + count($reject) + 1;
            $this->estimate_num = 'E' . date('Ymd') . '-' . substr("0000{$estimate_num}", -4);

	        parent::__construct(array(
	            'singular' => 'estimate',
	            'plural' => 'estimates',
	            'ajax' => true
	            ));
	    }
    
        function get_columns() {
            $columns = array(
                'cb' => '<input type="checkbox" />',
                'status' 	=> 'Status',
                'date'	=> 'Date',
                'number'	=> 'Number',
                'customer' => 'Customer',
                'amount' => 'Amount',
                'taxstate' => 'Tax Jurisdiction',
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
                  'taxstate' => array('taxstate',false),
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
                    'post_status' => 'draft',
                    'numberposts' => -1,
                    'orderby' => 'post_date',
                    'order' => 'DESC',
                )
            );
            $publish = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'publish','numberposts' => -1));
            $reject = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'reject','numberposts' => -1));
            if (!is_array($publish)) {
                $publish = array();
            }
            if (!is_array($reject)) {
                $reject = array();
            }
            $estimate_num = count($estimates) + count($publish) + count($reject) + 1;
            $this->estimate_num = 'E' . date('Ymd') . '-' . substr("0000{$estimate_num}", -4);
            $estimate_num = $this->estimate_num;
            $index = 0;
    
            //echo '<pre>'; print_r(json_decode($estimates[0]->post_content)); echo '</pre>';

            foreach($estimates as $estimate) {
                $metadata = json_decode($estimate->post_content, true);
                $customer = get_user_by('id', $metadata['estimate-customer']);
                $estimate->metadata = $metadata;

                $invoice = json_decode($estimate->post_content);
                //echo '<pre>'; print_r($invoice); echo '</pre>';
                if (isset($invoice->tax_state)) {
                    $jurisdiction = $invoice->tax_state;
                } else {
                    $jurisdiction = $invoice->tax_jurisdiction;
                }
    
                $items = $metadata['items'];
                $total = 0;
                for ($i=1; $i<=$items; $i++) {
                    $total += isset($metadata['item_total_'.$i]) === false ? 0.00 : floatval($metadata['item_total_'.$i]);
                }
                $this->data[$index++] = array(
                    'id' => $estimate->ID,
                    'status' => $metadata['estimate-status'],
                    'date'  => $estimate->post_date,
                    'number' => $metadata['estimate-invnum'],
                    'customer'   => $customer->display_name . ' ['.$customer->user_email.']',
                    'amount' => number_format($total,2),
                    'taxstate' => $jurisdiction,
                    'action' => '
                        <select class="w3-input w3-block" data-id="'.$estimate->ID.'" data-estimate="'.base64_encode(json_encode($estimate)).'" onchange="estimateAction(this)">
                            <option value="">Select</option>
                            <option value="edit">Edit</option>
                            <option value="view">View/Print</option>
                            <option value="send">Send</option>
                            <option value="invoice">Make an Invoice</option>
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
    /**
     * Enables the bulk action selection
     * 
     * @param none
     * @return array actions
     */
    function get_bulk_actions() {
        $actions = array(
            'send'      => 'Send',
            'invoice'   => 'Make as Invoice',
            'delete'    => 'Delete'
        );
        return $actions;
    }

    /**
     * Customization for the checkbox column, adding a checkbox
     * 
     * @param array column data
     * @return string formatted output
     */
    function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="id[]" value="%s" />', $item['id']
        );    
    }
}
?>