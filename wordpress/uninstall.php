<?php
// if uninstall.php is not called by WordPress, die
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

// Delete BestBooks Options


// Delete BestBooks Custom User Roles
remove_role('bestbooks_customer');
remove_role('bestbooks_vendor');


// Delete BestBooks Custom Fields

// Delete BestBooks Custom Post Types

// Delete Created Pages
$customer = get_page_by_path('customer', ARRAY_A);
if (is_array($customer)) {
    $children = get_children(
        array(
            'post_parent' => $customer['ID'],
            'post_type' => 'page'
        )
    );
    foreach($children as $child) {
        wp_delete_post($child->ID, true);
    }
    wp_delete_post($customer['ID'], true);
}
$vendor = get_page_by_path('vendor', ARRAY_A);
if (is_array($vendor)) {
    $children = get_children(
        array(
            'post_parent' => $vendor['ID'],
            'post_type' => 'page'
        )
    );
    foreach($children as $child) {
        wp_delete_post($child->ID, true);
    }
    wp_delete_post($vendor['ID'], true);
}

// Delete BestBooks Custom Tables
global $wpdb;
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}bestbooks_accounts");
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}bestbooks_ledger");
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}bestbooks_journal");

?>