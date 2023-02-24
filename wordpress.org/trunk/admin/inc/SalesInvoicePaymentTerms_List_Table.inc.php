<?php
if (!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('SalesInvoicePaymentTerms_List_Table')) {
    class SalesInvoicePaymentTerms_List_Table extends WP_List_Table {
        private $data = array();
    
        function get_columns() {
            $columns = array(
                'name' 	=> 'Name',
                'description'	=> 'Description',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'name' => array('name',false),
                'description' => array('description',false),
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

            $payment_terms = array();
            $_payment_terms = get_terms(
                array(
                    'taxonomy' => 'bestbooks_payment_term',
                    'hide_empty'=>false
                )
            );
            

            $index=0;
            foreach($_payment_terms as $payment_term) {
                $payment_term->metadata = get_term_meta($payment_term->term_id);
                array_push(
                    $this->data, 
                    array(
                        'ID' => $payment_term->term_id,
                        'name' => $payment_term->name,
                        'description' => $payment_term->description,
                        'action' => '
                        <select class="w3-input w3-block" data-id="'.$payment_term->term_id.'" data-taxonomy="'.$payment_term->term_taxonomy.'" data-tax="'.base64_encode(json_encode($payment_term)).'" onchange="tableAction(this)">
                            <option value="">Select</option>
                            <option value="viewedit">View/Edit</option>
                            <option value="delete">Delete</option>
                        </select>' 
                    )
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
            return $item[$column_name];
        }
    }    
}

if (!class_exists('SalesInvoicePaymentMethods_List_Table')) {
    class SalesInvoicePaymentMethods_List_Table extends WP_List_Table {
        private $data = array();
    
        function get_columns() {
            $columns = array(
                'name' 	=> 'Name',
                'description'	=> 'Description',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'name' => array('name',false),
                'description' => array('description',false),
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

            $payment_method = array();
            $_payment_method = get_terms(
                array(
                    'taxonomy' => 'bestbooks_payment_method',
                    'hide_empty'=>false
                )
            );
            
            $index=0;
            foreach($_payment_method as $payment_method) {
                $payment_method->metadata = get_term_meta($payment_method->term_id);
                array_push(
                    $this->data, 
                    array(
                        'ID' => $payment_method->term_id,
                        'name' => $payment_method->name,
                        'description' => $payment_method->description,
                        'action' => '
                        <select class="w3-input w3-block" data-id="'.$payment_method->term_id.'" data-taxonomy="'.$payment_method->term_taxonomy.'" data-tax="'.base64_encode(json_encode($payment_method)).'" onchange="tableAction(this)">
                            <option value="">Select</option>
                            <option value="viewedit">View/Edit</option>
                            <option value="delete">Delete</option>
                        </select>' 
                    )
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
            return $item[$column_name];
        }
    }
}

if (!class_exists('SalesInvoicePaymentForms_List_Table')) {
    class SalesInvoicePaymentForms_List_Table extends WP_List_Table {
        private $data = array();
    
        function get_columns() {
            $columns = array(
                'name' 	=> 'Name',
                'description'	=> 'Description',
                'action' => 'Action'
              );
              return $columns;
        }
    
        function get_sortable_columns() {
            $sortable_columns = array(
                'name' => array('name',false),
                'description' => array('description',false),
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

            $payment_forms = array();
            $_payment_forms = get_terms(
                array(
                    'taxonomy' => 'bestbooks_payment_form',
                    'hide_empty'=>false
                )
            );
            
            
            $index=0;
            foreach($_payment_forms as $payment_form) {
                $payment_form->metadata = get_term_meta($payment_form->term_id);
                array_push(
                    $this->data, 
                    array(
                        'ID' => $payment_form->term_id,
                        'name' => $payment_form->name,
                        'description' => $payment_form->description,
                        'action' => '
                        <select class="w3-input w3-block" data-id="'.$payment_form->term_id.'" data-taxonomy="'.$payment_form->term_taxonomy.'" data-tax="'.base64_encode(json_encode($payment_form)).'" onchange="tableAction(this)">
                            <option value="">Select</option>
                            <option value="viewedit">View/Edit</option>
                            <option value="delete">Delete</option>
                        </select>' 
                    )
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
            return $item[$column_name];
        }
    }
}
?>