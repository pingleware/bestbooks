<?php
if (!function_exists('bestbooks_new_invoice_number')) {
    function bestbooks_new_invoice_number() {
        $timezone = get_option("bestbooks_timezone");
        date_default_timezone_set($timezone);
        
        $invoices = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'publish','numberposts'=>-1));
        $draft = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'draft', 'numberposts' => -1));
        $reject = get_posts(array('post_type' => 'bestbooks_invoice','post_status' => 'reject', 'numberposts' => -1));
        if (!is_array($invoices)) {
            $invoices = array();
        }
        if (!is_array($draft)) {
            $draft = array();
        }
        if (!is_array($reject)) {
            $reject = array();
        }

        $invoice_num = count($invoices) + count($draft) + count($reject) + 1;
        $invoice_num = 'I' . date('Ymd') . '-' . substr("0000{$invoice_num}", -4);
        return $invoice_num;
    }
}

if (!function_exists('bestbooks_create_sales_invoice')) {
    function bestbooks_create_sales_invoice($customer_id, $post_password, $total, $data) {
        $timezone = get_option("bestbooks_timezone");
        date_default_timezone_set($timezone);
    
        $post_id = wp_insert_post(
            array(
                'post_type' => 'bestbooks_invoice',
                'post_status' => 'publish',
                'post_title' => 'Customer #'.$customer_id,
                'post_password' => $post_password,
                'post_content' => json_encode($data)
            )
        );

        $post = get_post($post_id);
        $txdate = date('Y-m-d',strtotime($post->post_date));
        $description = $post->post_title;

        // Update accounting records for an account receivables on credit because an invoice was created,
        // the customer will have an option to pay the invoice
        // See https://www.accountingtools.com/articles/2017/5/17/accounts-receivable-accounting 
        do_action('bestbooks_sales_card',$txdate,$description,$total);
    }
}

?>