<?php
/*
Plugin Name: Bestbooks&reg;&trade;
Plugin URI: http://wordpress.org/plugins/bestbooks/
Description: An accounting application framework built from scratch. BestBooks&reg;&trade; Accounting Application Framework is a registered trademark of PressPage Entertainment Inc.
Version: 2.6.3
Author: PressPage Entertainment Inc DBA PINGLEWARE
Author URI: https://pingleware.work
Trademark: 2021 PressPage Entertainment Inc
*/

/*
 * Copyright 2009-2021  PressPage Entertainment Inc  (email : presspage.entertainment@gmail.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * 
*/

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define('BESTBOOKS_VERSION', '2.6.3');

require_once dirname(__FILE__).'/vendor/autoload.php';
require_once dirname(__FILE__).'/ajax.php';
require_once dirname(__FILE__).'/api.php';
require_once dirname(__FILE__).'/admin.php';
require_once dirname(__FILE__).'/hooks.php';
require_once dirname(__FILE__).'/imports.php';
require_once dirname(__FILE__).'/export.php';
require_once dirname(__FILE__).'/taxonomy.php';
require_once dirname(__FILE__).'/userprofile.php';
require_once dirname(__FILE__).'/functions.php';
require_once dirname(__FILE__).'/shortcodes.php';

if (!function_exists('addBestBooksToManagementPage')) {
    //// Add page to options menu.
    function addBestBooksToManagementPage()
    {
        bestbooks_dashboard();
        // Add a new submenu under Options:
        //add_options_page('BestBooks', 'BestBooks', 8, 'bestbooks', 'displayBestBooksManagementPage');
    }

    add_action('admin_menu', 'addBestBooksToManagementPage');
}

if (!function_exists('bestbooks_page_template')) {
    add_filter( 'page_template', 'bestbooks_page_template' );

    function bestbooks_page_template($page_template) {
        if (is_page('estimate')) {
            if (file_exists(dirname( __FILE__ ) . '/templates/customer-estimate.php')) {
                $page_template = dirname( __FILE__ ) . '/templates/customer-estimate.php';
            }
        } elseif (is_page('invoice')) {
            if (file_exists(dirname( __FILE__ ) . '/templates/customer-invoice.php')) {
                $page_template = dirname( __FILE__ ) . '/templates/customer-invoice.php';
            }
        } elseif (is_page('statement')) {
            if (file_exists(dirname( __FILE__ ) . '/templates/customer-statement.php')) {
                $page_template = dirname( __FILE__ ) . '/templates/customer-statement.php';
            }
        } elseif (is_page('purchase-order')) {
            if (file_exists(dirname( __FILE__ ) . '/templates/vendor-purchase-order.php')) {
                $page_template = dirname( __FILE__ ) . '/templates/vendor-purchase-order.php';
            }
        } elseif (is_page('newhire')) {
            if (file_exists(dirname( __FILE__ ) . '/templates/newhire-multistate.php')) {
                $page_template = dirname( __FILE__ ) . '/templates/newhire-multistate.php';
            }
        } elseif (is_page('employee/w4')) {
            if (file_exists(dirname( __FILE__ ) . '/templates/employee-w4.php')) {
                $page_template = dirname( __FILE__ ) . '/templates/employee-w4.php';
            }
        }
        return $page_template;
    }    
}
if (!function_exists('addBestBooksTables') && class_exists('ChartOfAccounts')) {
    function addBestBooksTables ()
    {
        global $wpdb;
    
        if (is_admin()) {
            ChartOfAccounts::createTable();
            Journal::createTable();
            Ledger::createTable();
            ChartOfAccounts::alterTable();
            Ledger::alterTable();
            Journal::alterTable();
        } // endif of is_admin()
    
        // Create two custom user role
        add_role('bestbooks_customer', 'BestBooks Customer', array('read'=>true));
        add_role('bestbooks_vendor', 'BestBooks Vendor', array('read'=>true));
        add_role('bestbooks_company', 'BestBooks Company', array('read'=>true));
    }    

    register_activation_hook(__FILE__,'addBestBooksTables');
}

if (!function_exists('bestbooks_deactivate')) {
    function bestbooks_deactivate() {
        unregister_taxonomy('inventory_type');
        unregister_taxonomy('bestbooks_payment_term');
        unregister_taxonomy('bestbooks_payment_method');
        unregister_taxonomy('bestbooks_payment_form');
        unregister_taxonomy('bestbooks_taxjurisdiction');
    }

    register_deactivation_hook(__FILE__,'bestbooks_deactivate');
}

if (!function_exists('bestbooks_register_taxonomies')) {
    function bestbooks_register_taxonomies() {
        if (!taxonomy_exists('inventory_type')) {
            register_taxonomy('inventory_type','bestbooks_inventory');
            wp_insert_term('Sales Service','inventory_type');
            wp_insert_term('Sales  Product','inventory_type');
            wp_insert_term('Purchase Product','inventory_type');
            wp_insert_term('Purchase Service','inventory_type');
            wp_insert_term('Capital Assets','inventory_type');
        }
    
        if (!taxonomy_exists('bestbooks_payment_term')) {
            /**
             * Taxonomy: BestBooks Payment Terms.
             */
        
            $labels = [
                "name" => __( "BestBooks Payment Terms", "ondemand" ),
                "singular_name" => __( "BestBooks Payment Term", "ondemand" ),
            ];
        
            
            $args = [
                "label" => __( "BestBooks Payment Terms", "ondemand" ),
                "labels" => $labels,
                "public" => true,
                "publicly_queryable" => true,
                "hierarchical" => false,
                "show_ui" => true,
                "show_in_menu" => true,
                "show_in_nav_menus" => true,
                "query_var" => true,
                "rewrite" => [ 'slug' => 'bestbooks_payment_term', 'with_front' => true, ],
                "show_admin_column" => false,
                "show_in_rest" => true,
                "rest_base" => "bestbooks_payment_term",
                "rest_controller_class" => "WP_REST_Terms_Controller",
                "show_in_quick_edit" => false,
                "show_in_graphql" => false,
            ];
            register_taxonomy( "bestbooks_payment_term", [ "bestbooks_inventory" ], $args );
        }
        if (!taxonomy_exists('bestbooks_payment_method')) {
            /**
             * Taxonomy: BestBooks Payment Methods.
             */
        
            $labels = [
                "name" => __( "BestBooks Payment Methods", "ondemand" ),
                "singular_name" => __( "BestBooks Payment Method", "ondemand" ),
            ];
        
            
            $args = [
                "label" => __( "BestBooks Payment Methods", "ondemand" ),
                "labels" => $labels,
                "public" => true,
                "publicly_queryable" => true,
                "hierarchical" => false,
                "show_ui" => true,
                "show_in_menu" => true,
                "show_in_nav_menus" => true,
                "query_var" => true,
                "rewrite" => [ 'slug' => 'bestbooks_payment_method', 'with_front' => true, ],
                "show_admin_column" => false,
                "show_in_rest" => true,
                "rest_base" => "bestbooks_payment_method",
                "rest_controller_class" => "WP_REST_Terms_Controller",
                "show_in_quick_edit" => false,
                "show_in_graphql" => false,
            ];
            register_taxonomy( "bestbooks_payment_method", [ "bestbooks_inventory" ], $args );
        }
        if (!taxonomy_exists('bestbooks_payment_form')) {
            /**
             * Taxonomy: BestBooks Payment Forms.
             */
        
            $labels = [
                "name" => __( "BestBooks Payment Forms", "ondemand" ),
                "singular_name" => __( "BestBooks Payment Form", "ondemand" ),
            ];
        
            
            $args = [
                "label" => __( "BestBooks Payment Forms", "ondemand" ),
                "labels" => $labels,
                "public" => true,
                "publicly_queryable" => true,
                "hierarchical" => false,
                "show_ui" => true,
                "show_in_menu" => true,
                "show_in_nav_menus" => true,
                "query_var" => true,
                "rewrite" => [ 'slug' => 'bestbooks_payment_form', 'with_front' => true, ],
                "show_admin_column" => false,
                "show_in_rest" => true,
                "rest_base" => "bestbooks_payment_form",
                "rest_controller_class" => "WP_REST_Terms_Controller",
                "show_in_quick_edit" => false,
                "show_in_graphql" => false,
            ];
            register_taxonomy( "bestbooks_payment_form", [ "bestbooks_inventory" ], $args );
        }

        if (!taxonomy_exists('bestbooks_taxjurisdiction')) {
            /**
             * Taxonomy: BestBooks State.
             */
        
            $labels = [
                "name" => __( "BestBooks Tax Jurisdictions", "ondemand" ),
                "singular_name" => __( "BestBooks Tax Jurisdiction", "ondemand" ),
            ];
        
            
            $args = [
                "label" => __( "BestBooks Tax Jurisdictions", "ondemand" ),
                "labels" => $labels,
                "public" => true,
                "publicly_queryable" => true,
                "hierarchical" => true,
                "show_ui" => true,
                "show_in_menu" => true,
                "show_in_nav_menus" => true,
                "query_var" => true,
                "rewrite" => [ 'slug' => 'bestbooks_taxjurisdiction', 'with_front' => true, ],
                "show_admin_column" => false,
                "show_in_rest" => true,
                "rest_base" => "bestbooks_taxjurisdiction",
                "rest_controller_class" => "WP_REST_Terms_Controller",
                "show_in_quick_edit" => false,
                "show_in_graphql" => false,
            ];
            register_taxonomy( "bestbooks_taxjurisdiction", [ "bestbooks_invoice" ], $args );
        }
    }        

    add_action('init','bestbooks_register_taxonomies');
}

if (!function_exists('bestbooks_upgrade_completed')) {
    /**
     * Update Routines and Processes
     * 
     * This function runs when WordPress completes its upgrade process
     * It iterates through each plugin updated to see if ours is included
     * @param $upgrader_object Array
     * @param $options Array
     * 
     * @see https://developer.wordpress.org/reference/hooks/upgrader_process_complete/
     */
    function bestbooks_upgrade_completed( $upgrader_object, $options ) {
        // The path to our plugin's main file
        $our_plugin = plugin_basename( __FILE__ );
        // If an update has taken place and the updated type is plugins and the plugins element exists
        if( $options['action'] == 'update' && $options['type'] == 'plugin' && isset( $options['plugins'] ) ) {
            // Iterate through the plugins being updated and check if ours is there
            foreach( $options['plugins'] as $plugin ) {
                if( $plugin == $our_plugin ) {
                    // Update the database tables
                    if (class_exists('ChartOfAccounts')) {
                        ChartOfAccounts::alterTable();
                    }
                    if (class_exists('Ledger')) {
                        Ledger::alterTable();
                    }
                    if (class_exists('Journal')) {
                        Journal::alterTable();        
                    }
                }
            }

            // Convert purchase_bill post type to bestbooks_purchase with metadata bill_type of bill
            $posts = get_posts(array('post_type'=>'purchase_bill','numberposts'=>-1));
            foreach($posts as $post) {
                $post->post_type = 'bestbooks_purchase';
                wp_update_post($post);
                update_post_meta($post->ID,'bill_type','bill');
            }
        }
    }

    add_action( 'upgrader_process_complete', 'bestbooks_upgrade_completed', 10, 2 );
}
?>