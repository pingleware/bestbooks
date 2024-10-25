<?php
/**
 * Plugin Name: WP human resource management front-end
 * Plugin URI: https://github.com/asaquzzaman/hrm
 * Description: Back-end all feature available for front-end
 * Author: asaquzzaman
 * Version: 2.0.1
 * Author URI: http://mishubd.com
 * License: GPL2
 * TextDomain: hrm
 */

/**
 * Copyright (c) 2013 Asaquzzaman Mishu (email: joy.mishu@gmail.com). All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 * **********************************************************************
 */
require_once dirname (__FILE__) . '/includes/functions.php';
class hrm_front {

	public $query_vars = array();
    public static $version = '2.0.1';

	function __construct() {
        // Define constants
        $this->define_constants();
        // Include required files
        $this->includes();
        $this->instantiate();
        // Initialize the action hooks
        $this->init_actions();
        $this->init_filter();

		//add_filter( 'query_vars', array( $this, 'register_query_var' ) );
		//add_action( 'init', array($this, 'register_rule') );
       // add_action( 'wp_enqueue_scripts', array( 'Wp_Hrm', 'admin_scripts' ) );
        //add_action( 'wp_enqueue_scripts', array( 'Wp_Hrm', 'file_scripts' ) );
        //add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts') );
        //add_action( 'admin_enqueue_scripts', array($this, 'enqueue_scripts') );
        //add_filter( 'hrm_header_path', array( $this, 'hrm_header_path'), 10, 2 );
        // add_filter( 'hrm_subtab_path', array( $this, 'hrm_subtab_path' ), 10, 4 );
        // add_filter( 'hrm_tab_menu_url', array( $this, 'hrm_tab_menu_url' ), 10, 3 );
        // add_filter( 'hrm_subtab_menu_url', array( $this, 'hrm_subtab_menu_url' ), 10, 4 );
        // add_filter( 'hrm_redirect_url', array( $this, 'hrm_redirect_url' ), 10, 4 );
        // add_filter( 'hrm_pagination_redirect', array( $this, 'hrm_pagination_redirect' ), 10, 2 );
        // add_filter( 'hrm_search_redirect', array( $this, 'hrm_search_redirect' ), 10, 2 );
        // add_filter( 'hrm_employee_profile', array( $this, 'hrm_employee_profile' ), 10, 5 );
        //add_filter( 'hrm_query_var', array( $this, 'hrm_query_var' ) );
        //add_filter( 'hrm_employee_menu_url', array( $this, 'employee_menu_url' ),10, 4);
        //add_filter( 'hrm_employee_sub_menu_url', array( $this, 'hrm_employee_sub_menu_url' ),10, 5);
        //add_filter( 'hrm_task_assign_user_url', array( $this, 'hrm_task_assign_user_url' ),10, 4);

        //add_filter( 'hrm_job_title_url', array( $this, 'hrm_desc_notice_url' ), 10, 4 );
        //add_filter( 'hrm_job_category_url', array( $this, 'hrm_desc_notice_url' ), 10, 4 );
        //add_filter( 'hrm_job_location_url', array( $this, 'hrm_desc_notice_url' ), 10, 4 );
        //add_filter( 'hrm_new_pay_grade_url', array( $this, 'hrm_desc_notice_url' ), 10, 4 );

        //add_filter( 'hrm_menu_lable', array( $this, 'menu_lable' ) );
        //add_action( 'hrm_menu_items', array( $this, 'admin_menu' ) );

        //add_filter( 'hrm_menu_lable', array( $this, 'updates' ) );
        //add_filter( 'hrm_menu_items', array( $this, 'menu_items' ), 10, 2 );
        // add_action( 'wp_ajax_get_pages', array( $this, 'get_pages' ) );
        // add_action( 'wp_ajax_get_wp_pages', array( $this, 'get_wp_pages' ) );
        // add_action( 'wp_ajax_save_page_settings', array( $this, 'save_page_settings' ) );

        
	}

    /**
     * Define UserProfile Constants
     *
     * @since 0.1
     * 
     * @return void
     */
    private function define_constants() {
        $this->define( 'HRM_FRONTEND_VERSION', '0.3' );
        $this->define( 'HRM_FRONTEND_DB_VERSION', '0.1' );
        $this->define( 'HRM_FRONTEND_PATH', dirname( __FILE__ ) );
        $this->define( 'HRM_FRONTEND_URL', plugins_url( '', __FILE__ ) );
        $this->define( 'HRM_FRONTEND_ASSETS', HRM_FRONTEND_URL . '/assets' );
        $this->define( 'HRM_FRONTEND_INCLUDES', HRM_FRONTEND_PATH . '/includes' );
        $this->define( 'HRM_FRONTEND_IS_ADMIN', is_admin() );

        //Item name should be same as the product post title
        //Exa. From you website the product title is 'WooCommerce Product Feed' so WOOGOOL_ITEM_NAME should be 'WooCommerce Product Feed'
        $this->define( 'HRM_FRONTEND_ITEM_NAME', 'HRM Front-end' );
    }

    /**
     * Define constant if not already set
     *
     * @since 0.1
     *
     * @param  string $name
     * @param  string|bool $value
     * 
     * @return void
     */
    private function define( $name, $value ) {
        if ( ! defined( $name ) ) {
            define( $name, $value );
        }
    }

    function init_filter() {
        add_filter( 'hrm_addons', array( $this, 'frontend_addon' ) );
        add_filter( 'hrm_addons_license', array( $this, 'license' ) );
    }

    function init_actions() {
        add_action( 'init', array( 'HRM_Shortcodes', 'init' ) );
    }

    function license( $licenses ) {
        $licenses[] = array (
            'id'          => HRM_FRONTEND_ITEM_NAME,
            'item_name'   => HRM_FRONTEND_ITEM_NAME,
            'name'        => sprintf( __( '%1$s License Key', 'hrm-frontend' ), 'HRM Front-end' ),
            'desc'        => '',
            'type'        => 'license_key',
            'size'        => 'regular',
            'field_class' => 'hrm-frontend-license-class',
            'class_name'  => 'HRM_Frontend_License'
        );

        return $licenses;
    }

    function frontend_addon( $addons ) {

        $addons[] = array(
            'label' => 'Front-End',
            'key'  => 'front_end'
        );

        return $addons;
    }

    function save_page_settings () {
        check_ajax_referer('hrm_nonce');

        $pages = empty( $_POST['pages'] ) ? array() : $_POST['pages'];

        foreach ( $pages as $key => $page ) {
            update_option( $page['option'], $page['value'] );
        }

        wp_send_json_success();
    }

    function get_wp_pages() {
        check_ajax_referer('hrm_nonce');

        $args = array(
            'sort_order' => 'asc',
            'sort_column' => 'post_title',
            'hierarchical' => 1,
            'child_of' => 0,
            'parent' => -1,
            'offset' => 0,
            'post_type' => 'page',
            'post_status' => 'publish'
        ); 
        $pages = get_pages($args); 

        wp_send_json_success($pages);
    }

    function get_pages() {
        check_ajax_referer('hrm_nonce');

        $pages = hrm_frontend_pages();

        foreach ( $pages as $key => $page ) {
            $pages[$key]['value'] = get_option( $page['option'] );
        }
        
        wp_send_json_success($pages);
    }

    function includes() {
        include_once( 'includes/hrm-autoloader.php' );
        require_once dirname(__FILE__) . '/includes/license-handler/EDD_License_Handler.php';
    }

    function menu_items( $page, $exclude ) {
        $path = dirname(__FILE__);
       // $page[hrm_updates_page()]['tab'] = false;
        $page[hrm_updates_page()]['front-end'] = array(
            'id'        => 'hrm-fornt-end-license',
            'title'     => __( 'Front-end', 'hrm' ),
            'file_slug' => 'views/license',
            'file_path' => $path . '/views/license.php',
            'tab'       => false
        );

        return $page;
    }

    function updates( $labels ) {

        if ( array_key_exists( hrm_updates_page() , $labels ) ) {
            return $labels;
        }

        $labels[hrm_updates_page()] = __( 'Updates', 'hrm' );

        return $labels;
    }

    function hrm_desc_notice_url( $url, $page_name, $tab, $sub_tab ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }

        $page_id = hrm_get_option( $page_name, 'hrm_page', false );
        $url = get_permalink( $page_id );
        return add_query_arg( array( 'tab' => $tab,'sub_tab' => $sub_tab ), $url  );
    }

    function instantiate() {
        (new HRM_Frontend_License)->init( __FILE__, HRM_FRONTEND_ITEM_NAME, self::$version, 'Asaquzzaman' );
    }

    function hrm_task_assign_user_url( $url, $page, $tab, $assign_to ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }

        $page_id = hrm_get_option( $page, 'hrm_page', false );
        $url = get_permalink( $page_id );
        return add_query_arg( array( 'tab' => $tab, 'employee_id' => $assign_to ), $url );
    }

    public static function enqueue_scripts() {

        wp_enqueue_script( 'hrm-frontend-config', plugins_url( '/assets/vendor/config.js', __FILE__ ), array('jquery'), HRM_VERSION, false );
        wp_enqueue_script( 'hrm-frontend', plugins_url( '/assets/js/hrm-frontend.js', __FILE__ ), array('hrm-config','hrm-const','hrm-frontend-config'), HRM_VERSION, true );
        
        wp_localize_script( 'hrm-frontend-config', 'HRM_Frontend_Vars', array(

            'dir_url' => plugin_dir_url(__FILE__),
        ) );

        if ( !is_admin() ) {
           wp_enqueue_style( 'hrm-front', plugins_url( '/assets/css/hrm-front.css', __FILE__ ), false, false, 'all' ); 
        }
    }

    function hrm_employee_sub_menu_url( $url, $page, $tab, $sub_tab, $employee_id ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }
        $page_id = hrm_get_option( $page, 'hrm_page', false );
        $url = get_permalink( $page_id );
        return add_query_arg( array( 'tab' => $tab, 'sub_tab' => $sub_tab, 'employee_id' => $employee_id ), $url );
    }

    function employee_menu_url( $url, $page, $tab, $employee_id ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }
        $page_id = hrm_get_option( $page, 'hrm_page', false );
        $url = get_permalink( $page_id );
        return add_query_arg( array( 'tab' => $tab,'employee_id' => $employee_id ), $url  );
    }

    public static function init() {
        if ( !class_exists( 'Wp_Hrm' ) ) {
            deactivate_plugins( __FILE__ );
            exit('"WP human resource management" plugin is not installed. <a target="__blank" href="https://wordpress.org/plugins/hrm/">Install</a> the plugin first.');
            return;
        }

        $pages_id  = array();

        $pages = hrm_frontend_pages();
        
        foreach ( $pages as $key => $page ) {
            $pages_id = hrm_frontend_create_page( esc_sql( $page['name'] ), $page['option'], $page['title'], $page['content'] );
            update_option( $page['option'], $pages_id );
        }
    }


    function hrm_employee_profile( $admin_url, $page, $tab, $employer_id ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $admin_url;
        }
        $page_id = get_option( hrm_profile_page_id() );
        $url = add_query_arg( array( 'tab' => $tab, 'employee_id' => $employer_id ), get_permalink($page_id) );

        return $url;
    }

    function hrm_search_redirect( $query_arg, $data ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }

        $page_id = hrm_get_option( $page, 'hrm_page' );
        $url = add_query_arg( $data, get_permalink($page_id) );

        return $url;
    }

    function hrm_pagination_redirect( $query_arg, $data ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }
        $page_id = hrm_get_option( $page, 'hrm_page' );
        $url = add_query_arg( $data, get_permalink( $page_id ) );
        return $url;
    }

    function hrm_redirect_url( $url, $page, $tab, $subtab ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }
        $page_id = hrm_get_option( $page, 'hrm_page' );
        $url = get_permalink($page_id) . $tab .'/'. $subtab;
        return $url;
    }

    function hrm_tab_menu_url( $url, $page, $tab ) {
        global $hrm_is_admin;
        if ( $hrm_is_admin ) {
            return $url;
        }

        $page_id = hrm_get_option( $page, 'hrm_page' );
        $url = add_query_arg( array( 'tab' => $tab ), get_permalink($page_id) );
        return $url;
    }

    function hrm_subtab_menu_url( $url, $page, $tab, $subtab ) {
        global $hrm_is_admin;

        if ( $hrm_is_admin ) {
            return $url;
        }
        $page_id = hrm_get_option( $page, 'hrm_page' );
        $url = add_query_arg( array( 'tab' => $tab, 'sub_tab' => $subtab ), get_permalink($page_id) );
        return $url;
    }

    function hrm_subtab_path( $path, $page, $tab, $subtab ) {
        $menu = hrm_page();
        if ( !isset( $menu[$page][$tab]['submenu'] ) ) {
           return $path;
        }
        $slug = $menu[$page][$tab]['submenu'][$subtab]['file_slug'];
        $subtab_template = locate_template( array( hrm_template_path() . $slug. '.php' ) );

        if ( $subtab_template ) {
            return $subtab_template;
        }

        return $path;
    }

    function hrm_header_path( $path, $folder ) {
        $header_template = locate_template( array( hrm_template_path() . $folder .'/header.php' ) );
        if ( $header_template ) {
            return $header_template;
        }

        return $path;
    }





}
add_action( 'plugins_loaded', function() {
    if ( !class_exists( 'Wp_Hrm' ) ) {
        return;
    }

    $hrm = new hrm_front();
});

register_activation_hook( __FILE__, array( 'hrm_front', 'init' ) );


function hrm_template_path() {
    return apply_filters( 'hrm_template_path', 'hrm/' );
}

/**
 * Retrieve or display list of posts as a dropdown (select list).
 *
 * @return string HTML content, if not displaying.
 */
function hrm_get_pages( $post_type = 'page' ) {
    global $wpdb;

    $array = array( '' => __( '-- select --', 'wpuf' ) );
    $pages = get_posts( array('post_type' => $post_type, 'numberposts' => -1) );
    if ( $pages ) {
        foreach ($pages as $page) {
            $array[$page->ID] = esc_attr( $page->post_title );
        }
    }

    return $array;
}

/**
 * Get the value of a settings field
 *
 * @param string  $option  settings field name
 * @param string  $section the section name this field belongs to
 * @param string  $default default text if it's not found
 * @return string
 */
function hrm_get_option( $option, $section, $default = '' ) {

    $options = get_option( $section );

    if ( isset( $options[$option] ) ) {
        return $options[$option];
    }

    return $default;
}

