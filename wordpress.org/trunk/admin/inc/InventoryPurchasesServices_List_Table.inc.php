<?php
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('InventoryPurchasesServices_List_Table')) {
    class InventoryPurchasesServices_List_Table extends WP_List_Table {
        private $data = array();
    
        function get_columns() {
            $columns = array(
                'name' 	=> 'Name',
                'description'	=> 'Description',
                'quantity' => 'Quantity',
                'cost' => 'Cost',
                'vendor' => 'Vendor',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'name' => array('name',false),
                  'description' => array('description',false),
                  'quantity' => array('cost',false),
                  'cost' => array('cost',false),
                  'vendor' => array('cost',false),
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
                'post_type' => 'bestbooks_inventory',
                'post_status' => 'publish',
                'tax_query' => array(
                    array(
                        'taxonomy' => 'inventory_type',
                        'field'    => 'slug',
                        'terms'    => 'purchase-service'
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
                $this->data[$index++] = array(
                    'name' 	=> $product->metadata['name'][0],
                    'description'	=> $product->post_content,
                    'quantity' => $product->metadata['quantity'][0],
                    'cost' => $product->metadata['cost'][0],
                    'vendor' =>  $vendor->display_name . '[' . $vendor->user_email . ']',
                    'action' => '
                    <select class="w3-input w3-block" data-id="'.$product->ID.'" data-tax="bestbooks_sales_product" onchange="inventoryAction(this)">
                        <option va lue="">Select</option>
                        <option value="delete">Delete</option>
                    </select>'      
                );
            }
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