<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('InventoryCapital_List_Table')) {
    class InventoryCapital_List_Table extends WP_List_Table {
        private $data = array();
        
        function get_columns() {
            return array(
                'date' 	=> 'Purchase date',
                'acquisition' => 'Acquisition Date',
                'description'	=> 'Description',
                'quantity' => 'Quantity',
                'cost' => 'Cost',
                'value' => 'Value',
                'vendor' => 'Vendor',
                'action' => 'Action'
              );
        }
    
        function get_sortable_columns() {
            return array(
                'date' => array('date',false),
                'acquisition' => array('acquisition',false),
                'description' => array('description',false),
                'quantity' => array('cost',false),
                'cost' => array('cost',false),
                'value' => array('value',false),
                'vendor' => array('cost',false),
                'action' => array('action',false)
            );
        }

        function prepare_items() {
            global $wpdb;
    
            $columns = $this->get_columns();
            $hidden = array();
            $sortable = array();
            $this->_column_headers = array($columns, $hidden, $sortable);

            $args = array(
                'post_type' => 'bestbooks_inventory',
                'post_status' => 'publish',
                'tax_query' => array(
                    array(
                        'taxonomy' => 'inventory_type',
                        'field'    => 'slug',
                        'terms'    => 'capital-assets'
                    )
                )
            );

            $active_company = bestbooks_get_active_company();
            if ($active_company > 1) {
                $args['meta_key'] = 'company';
                $args['meta_value'] = $active_company;
                $args['meta_compare'] = '=';                
            }
            
            $products = get_posts($args);

            $index = 0;
            foreach($products as $product) {
                $product->metadata = get_post_meta($product->ID);
                $vendor = get_user_by('id',$product->metadata['vendor'][0]);
                //if (!isset($product->metadata['disposal_date'])) {
                    $this->data[$index++] = array(
                        'ID' => $product->ID,
                        'date' 	=> date("m/d/Y",strtotime($product->metadata['purchase_date'][0])),
                        'acquisition' => date("m/d/Y",strtotime($product->metadata['acquisition_date'][0])),
                        'description'	=> $product->post_title,
                        'quantity' => $product->metadata['quantity'][0],
                        'cost' => $product->metadata['cost'][0],
                        'value' => $product->metadata['value'][0],
                        'vendor' => $vendor->display_name . '[' . $vendor->user_email . ']',
                        'action' => '
                        <select class="w3-input w3-block" data-id="'.$product->ID.'" data-product="'.base64_encode(json_encode($product)).'" data-tax="bestbooks_capital_asset" onchange="inventoryAction(this)">
                            <option value="">Select</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                        </select>'     
                    );    
                //}
            }
            $perPage = 5;
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
