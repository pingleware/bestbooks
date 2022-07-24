<?php
if (!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

if (!class_exists('Transactions_List_Table')) {
    class Transactions_List_Table extends WP_List_Table {
        private $data = array();
    
        function get_columns() {
            return array(
                'cb'=>'<input type="checkbox"/>',
                'id' => 'ID',
                'date' 	=> 'Date',
                'description'	=> 'Description',
                'account'	=> 'Account',
                'debit' => 'Debit',
                'credit' => 'Credit',
                'action' => 'Action'
              );
        }
    
        function get_sortable_columns() {
            return array(
                'id' => array('id',true),
                'date'  => array('date',true),
                'description' => array('description',false),
                'account'   => array('account',false),
                'debit' => array('debit',false),
                'credit' => array('credit',false),
                'action' => array('action', false)
            );
        }

        function column_cb($item) {
            return sprintf(
                '<input type="checkbox" name="transactions[]" value="%s" />', $item['id']
            );    
        }
            
        function bulk_actions($which = "") {
            global $wpdb;

            if ($which == 'top') {
                echo '<form method="get">';
                echo '<input type="hidden" name="page" value="'.$_GET['page'].'" />';
                $this->bulk_actions_display();
                echo '<input type="submit" name="bulk_action" value="Apply" class="button" />&nbsp;';
                $this->bulk_actions_display_month_dropdown();
                $this->bulk_actions_display_year_dropdown();
                $this->bulk_actions_display_account_type_dropdown();
                echo '<input type="submit" name="filter" value="Filter" class="button" />';
            } elseif ($which == 'bottom') {
                $where = $this->get_where();

                if (function_exists("is_plugin_active_for_network")) {
                    if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
                        $total_debit = "SELECT SUM(debit) AS total FROM ".$wpdb->base_prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                        $total_credit = "SELECT SUM(credit) AS total FROM ".$wpdb->base_prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                    } else {
                        $total_debit = "SELECT SUM(debit) AS total FROM ".$wpdb->prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                        $total_credit = "SELECT SUM(credit) AS total FROM ".$wpdb->prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                    }
                } else {
                    $total_debit = "SELECT SUM(debit) AS total FROM ".$wpdb->prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                    $total_credit = "SELECT SUM(credit) AS total FROM ".$wpdb->prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                }
                $debit = $wpdb->get_results($total_debit);
                $credit = $wpdb->get_results($total_credit);
        
                echo 'Totals:   Debit <input type="number" value="'.$debit[0]->total.'" />&nbsp; Credit <input type="number" value="'.$credit[0]->total.'" />';
                echo '</form>';
            }
        }

        function bulk_actions_display() {
            $actions = array(
                'delete'    => 'Delete'
            );
            echo '<select name="bulk_action"><option value="">Bulk Actions</option>';
            foreach($actions as $action) {
                echo '<option value="delete">Delete</option>';
            }
            echo '</select>';
        }


        function bulk_actions_display_month_dropdown() {
            $months = array('January','February','March','April','May','June','July','August','September','October','November','December');
            echo '<select name="month"><option value="">Filter by Month</option>';
            foreach($months as $index => $month) {
                $selected = '';
                if (isset($_GET['month'])) {
                    if ($index == ($_GET['month'] - 1)) {
                        $selected = 'selected';
                    }
                }

                echo '<option value="'.sprintf("%02d",$index + 1).'" '.$selected.'>'.$month.'</option>';
            }
            echo '</select>';
        }

        function bulk_actions_display_year_dropdown() {
            echo '<select name="year"><option value="">Filter by Year</option>';
            for($year = date('Y') - 7; $year < date('Y') + 7; $year++) {
                $selected = '';
                if (isset($_GET['year'])) {
                    if ($year == $_GET['year']) {
                        $selected = 'selected';
                    }
                }
                echo '<option value="'.$year.'" '.$selected.'>'.$year.'</option>';
            }
            echo '</select>';
        }

        function bulk_actions_display_account_type_dropdown() {
            echo '<select name="type"><option value="">Filter by Account</option>';
            $coa = get_coa_instance();
            foreach ($coa->account as $name => $type) {
                $selected = '';
                if (isset($_GET['type'])) {
                    if ($name == $_GET['type']) {
                        $selected = 'selected';
                    }    
                }
                echo '<option value="'.$name.'" '.$selected.'>'.$name.'</option>';
            }
            echo '</select>';
        }

        function months_dropdown( $post_type ) {
        }

        function search_box( $text, $input_id ) {
            echo '<input type="search" value="" />';
        }
    
        function prepare_items() {
            global $wpdb;
    
            $columns = $this->get_columns();
            $hidden = array();
            $sortable = array();
            $this->_column_headers = array($columns, $hidden, $sortable);

            $where = $this->get_where();
    
            $transactions = $this->get_results($where);
            $index = 0;

            foreach($transactions as $transaction)  {
                $this->data[$index++] = array(
                    'id'=>$transaction->id, 
                    'date' => $transaction->txdate, 
                    'description' => $transaction->note, 
                    'account' => $transaction->name, 
                    'debit' => $transaction->debit, 
                    'credit' => $transaction->credit,
                    'action' => '
                    <select class="w3-input w3-block" data-id="'.$transaction->id.'" data-transaction="'.base64_encode(json_encode($transaction)).'" onchange="transactionAction(this)">
                        <option value="">Select</option>
                        <option value="edit">Edit</option>
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

        function get_where() {
            $where = '';
            if (isset($_GET['year']) && !empty($_GET['year'])) {
                $year = $_GET['year'];
                $where = " WHERE YEAR(txdate)='$year' ";
            }
            if (isset($_GET['month']) && !empty($_GET['month'])) {
                $month = $_GET['month'];
                if (empty($where)) {
                    $where = " WHERE MONTH(txdate)='$month' ";
                } else {
                    $where .= " AND MONTH(txdate)='$month' ";
                }
            }
            if (isset($_GET['type']) && !empty($_GET['type'])) {
                $type = $_GET['type'];
                if (empty($where)) {
                    $where = " WHERE name='$type' ";
                } else {
                    $where .= " AND name='$type' ";
                }
            }
            return $where;
        }

        function get_results($where) {
            global $wpdb; 

            if (function_exists("is_plugin_active_for_network")) {
                if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
                    $sql = "SELECT * FROM ".$wpdb->base_prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                } else {
                    $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_ledger $where ORDER BY txdate ASC";
                }
            } else {
                $sql = "SELECT * FROM ".$wpdb->prefix."bestbooks_ledger $where ORDER BY txdate ASC";
            }

            //echo $sql.'<br/>';
            return $wpdb->get_results($sql);
        }

        function no_items() {
            echo 'No transactions found?';
        }
    
        function column_default( $item, $column_name ) {
            switch( $column_name ) { 
                case 'id':
                case 'date':
                case 'description':
                case 'account':
                case 'debit':
                case 'credit':
                case 'action':
                    return $item[ $column_name ];
                default:
                    return print_r( $item, true ) ; //Show the whole array for troubleshooting purposes
            }
        }
    }        
}
?>