<?php
/**
 * Template Name: BestBooks Customer Estimate
 * Description: Allows a customer to view their estimate and either approve or deny
 */
?>
<?php get_header(); ?>
<?php global $current_user; ?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.min.js"></script>

<?php if (isset($_GET['num'])) : ?>

    <?php
    $status = 'draft';

    if (isset($_POST['reject_estimate'])) {
        $post = get_post($_POST['estimate_id']);
        $status = 'reject';
        $post->post_status = $status;
        $content = json_decode($post->post_content, true);
        $content['estimate-status'] = 'rejected';
        $post->post_content = json_encode($content);
        wp_update_post($post);
        update_post_meta($post->ID,'estimate-status','rejected');
    } elseif (isset($_POST['approve_estimate'])) {
        $post = get_post($_POST['estimate_id']);
        $post->metadata = get_post_meta($post->ID);
        $content = json_decode($post->post_content,true);
        $post->post_status = 'publish';
        $txdate = date('Y-m-d',strtotime($post->post_date));
        $invoice_num = $_POST['estimate_num'];
        $total = $_POST['estimate_total'];
        $description = 'Invoice #'.$invoice_num.' approved by customer';
        $content = json_decode($post->post_content, true);
        $content['estimate-status'] = 'invoiced';
        $post->post_content = json_encode($content);
        wp_update_post($post);
        update_post_meta($post->ID,'estimate-status','invoiced');
        /**
         * Invoice created
         * GL impact:
         * 
         * Debit: Accounts Receivable
         * Credit: Sales (Income)
         */
        $items = $content['items'];
        $total_tax = 0;
        for($i=1;$i<=$items;$i++) {
            $total_tax += $content['item_tax_'.$i];
        }
        $tax_jurisdiction = $content['tax_jurisdiction'];
        bestbooks_sales_with_tax($txdate, $description, $total, $total_tax, $tax_jurisdiction);
    }

    $estimate_num = $_GET['num'];
    $args = array(
        'post_type' => 'bestbooks_invoice',
        'post_status' => 'draft',
        'meta_key' => 'estimate-invnum',
        'meta_value' => $estimate_num,
        'meta_compare' => '=' 
    );
    $posts = get_posts($args);
    $estimate = array();
    foreach($posts as $post) {
        $post_invnum = get_post_meta($post->ID,'estimate-invnum',true);
        //echo $post_invnum.'<br/>';
        if ($post_invnum === $estimate_num) {
            $post->metadata = get_post_meta($post->ID);
            array_push($estimate, $post);
            break;
        }
    }
    if (count($estimate) == 1) {
        if (post_password_required($estimate[0]->ID)) {
            // authenticate the user against estimate-password?
            echo get_the_password_form($estimate[0]->ID);
        } else {
            $customer_estimate = array();
            $content = json_decode($estimate[0]->post_content, true);

            $company_id = bestbooks_get_active_company();
            if (!$company_id) $company_id = 1;
            $company = get_user_by('id', $company_id);
            $company->metadata = get_user_meta($company->ID);

            //echo '<pre>'; print_r($company); echo '</pre>'; exit;

            $customer_estimate['company']['name'] = $company->display_name;
            $customer_estimate['company']['email'] = $company->user_email;
            $customer_estimate['company']['phone'] = $company->metadata['phone1'][0];
            $customer_estimate['company']['contact'] = $company->metadata['first_name'][0] . ' ' . $company->metadata['last_name'][0];
            $customer_estimate['company']['address1'] = $company->metadata['address_1'][0];
            $customer_estimate['company']['address2'] = $company->metadata['address_2'][0];
            $customer_estimate['company']['city'] = $company->metadata['city'][0];
            $customer_estimate['company']['state'] = $company->metadata['state'][0];
            $customer_estimate['company']['zip'] = $company->metadata['zip_code'][0];
            $customer_estimate['ID'] = $estimate[0]->ID;
            $customer_estimate['date'] = $estimate[0]->post_date;
            $customer_estimate['number'] = $content['estimate-invnum'];

            $customer_id = $content['estimate-customer'];
            $customer = get_user_by('id', $customer_id);
            $customer_estimate['customer']['contact'] = $company->metadata['first_name'][0] . ' ' . $company->metadata['last_name'][0];
            $customer_estimate['customer']['company'] = $customer->display_name;
            $customer_estimate['customer']['email'] = $customer->user_email;
            $customer_estimate['customer']['address1'] = get_user_meta($customer->ID,'billing_address',true);
            $customer_estimate['customer']['address2'] = get_user_meta($customer->ID,'billing_address_2',true);
            $customer_estimate['customer']['city'] = get_user_meta($customer->ID,'billing_city',true);
            $customer_estimate['customer']['state'] = get_user_meta($customer->ID,'billing_state',true);
            $customer_estimate['customer']['zip'] = get_user_meta($customer->ID,'billing_zip',true);
            $customer_estimate['customer']['shipping']['contact'] = $company->metadata['first_name'][0] . ' ' . $company->metadata['last_name'][0];
            $customer_estimate['customer']['shipping']['address1'] = get_user_meta($customer->ID,'shipping_address',true);
            $customer_estimate['customer']['shipping']['address2'] = get_user_meta($customer->ID,'shipping_address_2',true);
            $customer_estimate['customer']['shipping']['city'] = get_user_meta($customer->ID,'shipping_city',true);
            $customer_estimate['customer']['shipping']['state'] = get_user_meta($customer->ID,'shipping_state',true);
            $customer_estimate['customer']['shipping']['zip'] = get_user_meta($customer->ID,'shipping_zip',true);

            $customer_estimate['terms'] = $content['net_terms'];
            $customer_estimate['tax'] = $content['tax_jurisdiction'];
            $customer_estimate['duedate'] = $content['due_date'];

            $subtotal = 0;
            $tax = 0;

            $fmt = new NumberFormatter( 'en_US', NumberFormatter::CURRENCY );

            //echo '<pre>'; print_r($content); echo '</pre>';exit;

            $lineitems_xml = '<lineitems>';
            for($i=0; $i<$content['items']; $i++) {
                $item_id = $content['item_desc_'.($i+1)];
                $item = get_post($item_id);
                //echo '<pre>'; print_r($term); echo '</pre>';
                $lineitems_xml .= '<lineitem>';
                $lineitems_xml .= '<quantity>'.$content['item_qty_'.($i+1)].'</quantity>';
                $lineitems_xml .= '<description>'.$content['item_desc_'.($i+1)].'</description>';
                $lineitems_xml .= '<unitprice>'.$fmt->formatCurrency($content['item_price_'.($i+1)], 'USD').'</unitprice>';
                $lineitems_xml .= '<discount>'.$content['item_disc_'.($i+1)].'</discount>';
                $lineitems_xml .= '<tax>'.$fmt->formatCurrency($content['item_tax_'.($i+1)],'USD').'</tax>';
                $lineitems_xml .= '<total>'.$fmt->formatCurrency($content['item_total_'.($i+1)],'USD').'</total>';
                $lineitems_xml .= '</lineitem>';

                $subtotal += $content['item_total_'.($i+1)];
                $tax += $content['item_tax_'.($i+1)];
            }
            $lineitems_xml .= '</lineitems>';

            $total = $subtotal + $tax;
            $zero = 0;

            $customer_estimate['prices']['subtotal'] = $fmt->formatCurrency($subtotal,'USD');
            $customer_estimate['prices']['tax'] = $fmt->formatCurrency($tax,'USD');
            $customer_estimate['prices']['shipping'] = $fmt->formatCurrency($zero,'USD');
            $customer_estimate['prices']['other'] = $fmt->formatCurrency($zero,'USD');
            $customer_estimate['prices']['total'] = $fmt->formatCurrency($total,'USD');

            $customer_estimate['comments'] = $content['add_terms'];

            $xml_content = bestbooks_prepare_xml_customer_estimate($customer_estimate, $lineitems_xml);
            $customer_estimate_xslt = dirname(__FILE__)."/customerEstimate.xslt";
            print(bestbooks_transform_xml_xslt($xml_content->saveXML(), file_get_contents($customer_estimate_xslt)));
            ?>
            <form method="post">
                <input type="hidden" name="estimate_id" value="<?php echo $customer_estimate['ID']; ?>" />
                <input type="hidden" name="estimate_num" value="<?php echo $estimate_num; ?>" />
                <input type="hidden" name="estimate_total" value="<?php echo $total; ?>" />
                <table class="w3-table">
                    <tr>
                        <?php if (!isset($current_user->roles[0]) ||$current_user->roles[0] !== "administrator") : ?>
                            <td><button type="submit" class="w3-green w3-button w3-block" name="approve_estimate" id="approve_estimate">Approve ?</button></td>
                            <td><button type="submit" class="w3-red w3-button w3-block" name="reject_estimate" id="reject_estimate">Reject ?</button></td>
                        <?php else : ?>
                            <td colspan="2"><a href="#" class="w3-black w3-button w3-block" id="admin-print" onclick="this.style.display='none';window.print();this.style.display='block';">Print</a></td>
                        <?php endif; ?>
                    </tr>
                </table>
            </form>
            <?php
        }
    } else {
        ?>
        <div style="text-align:center;" ><img src="<?php echo plugins_url(); ?>/bestbooks/images/404.jpg" width="100%" height="100%" alt="Not Found!" /></div>
        <?php
    }
    ?>
<?php else: ?>
    <div style="text-align:center;" ><img src="<?php echo plugins_url(); ?>/bestbooks/images/404.jpg" width="100%" height="100%" alt="Not Found!" /></div>
<?php endif; ?>

<?php get_footer(); ?>