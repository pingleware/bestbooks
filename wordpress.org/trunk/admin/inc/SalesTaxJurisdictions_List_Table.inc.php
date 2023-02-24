<?php
if (!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('SalesTaxJurisdictions_List_Table')) {
    class SalesTaxJurisdictions_List_Table extends WP_List_Table {
        private $data = array();
        
        function get_columns() {
            $columns = array(
                'name' 	=> 'Name',
                'description'	=> 'Description',
                'parent' => 'Parent Jurisdiction',
                'taxrate' => 'Tax Rate (%)',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'name' => array('name',false),
                'description' => array('description',false),
                'parent' => array('parent',false),
                'taxrate' => array('taxrate',false),
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

            $terms  = get_terms( 'bestbooks_taxjurisdiction', array('hide_empty' => false));
            $index = 0;
            foreach($terms as $term) {
                $parent = '';
                if ($term->parent > 0) {
                    $parent_term = get_term_by('id',$term->parent,'bestbooks_taxjurisdiction');
                    $parent = $parent_term->name;
                }
                $this->data[$index++] = array(
                    'ID' => $term->term_id,
                    'name' 	=> $term->name,
                    'description'	=> $term->description,
                    'parent' => $parent,
                    'taxrate' => get_term_meta($term->term_id,'bestbooks-state-taxrate',true),
                    'action' => '
                    <select class="w3-input w3-block" data-id="'.$term->term_id.'" data-tax="bestbooks_tax_jurisdiction" onchange="taxAction(this)">
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