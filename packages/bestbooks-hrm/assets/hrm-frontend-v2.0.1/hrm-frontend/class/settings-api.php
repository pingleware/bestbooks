<?php

require_once dirname( __FILE__ ) . '/class.settings-api.php';

/**
 * WordPress settings API demo class
 *
 * @author Tareq Hasan
 */
if ( !class_exists('WeDevs_Settings_API_Test' ) ):
class WeDevs_Settings_API_Test {

    private $settings_api;

    function __construct() {

        $this->settings_api = new WeDevs_Settings_API;
        $this->admin_init();
        //add_action( 'admin_init', array($this, 'admin_init') );
        //add_filter( 'hrm_menu_lable', array( $this, 'menu_lable' ) );
        //add_action( 'admin_menu', array($this, 'admin_menu') );

    }

    function admin_init() {

        //set the settings
        $this->settings_api->set_sections( $this->get_settings_sections() );
        $this->settings_api->set_fields( $this->get_settings_fields() );

        //initialize settings
        $this->settings_api->admin_init();

    }

    /*function admin_menu() {
        $hrm_page_slug = hrm_page_slug();
        add_submenu_page( $hrm_page_slug, __( 'Settings', 'hrm' ), __( 'Settings', 'hrm' ), 'read', 'hrm_settings', array($this, 'plugin_page') );
    }*/

    function get_settings_sections() {
        $sections = array(
            array(
                'id' => 'hrm_page',
                'title' => __( 'Page', 'wedevs' )
            ),
        );
        return $sections;
    }

    /**
     * Returns all the settings fields
     *
     * @return array settings fields
     */
    function get_settings_fields() {

        $admin      = hrm_admin_page();
        $pim        = hrm_pim_page();
        $leave      = hrm_leave_page();
        $time       = hrm_time_page();
        $evaluation = hrm_evaluation_page();
        $file       = hrm_file_page();
        $project    = hrm_project_page();
        $salary     = hrm_salary_page();
        $my_info    = hrm_employee_page();
        $client     = hrm_client_page();
        $permission = hrm_permission_page();

        $settings_fields = array(
            'hrm_page' => array(

                array(
                    'name'    => $admin,
                    'label'   => __( 'Admin', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $admin ),
                    'options' => hrm_get_pages()
                ),

                array(
                    'name'    => $pim,
                    'label'   => __( 'Employee', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $pim ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $project,
                    'label'   => __( 'Projects', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $project ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $leave,
                    'label'   => __( 'Leave', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $leave ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $time,
                    'label'   => __( 'Attendance', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $time ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $evaluation,
                    'label'   => __( 'Evaluation', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $evaluation ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $file,
                    'label'   => __( 'File', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $file ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $salary,
                    'label'   => __( 'Salary', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $salary ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $my_info,
                    'label'   => __( 'My information', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $my_info ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $client,
                    'label'   => __( 'Client', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $client ),
                    'options' => hrm_get_pages()
                ),
                array(
                    'name'    => $permission,
                    'label'   => __( 'Permission', 'hrm' ),
                    //'desc'  => __( 'Dropdown description', 'hrm' ),
                    'type'    => 'select',
                    'default' => hrm_get_option( 'hrm_page', $permission ),
                    'options' => hrm_get_pages()
                ),

            )
        );

        return $settings_fields;
    }

    function plugin_page() {
        echo '<div class="wrap">';
        $this->settings_api->show_navigation();
        $this->settings_api->show_forms();

        echo '</div>';
    }

    /**
     * Get all the pages
     *
     * @return array page names with key value pairs
     */
    function get_pages() {
        $pages = get_pages();
        $pages_options = array();
        if ( $pages ) {
            foreach ($pages as $page) {
                $pages_options[$page->ID] = $page->post_title;
            }
        }

        return $pages_options;
    }

}
endif;
/*add_action( 'plugins_loaded', function() {
    if ( !class_exists( 'Wp_Hrm' ) ) {
        return;
    }
    $settings = new WeDevs_Settings_API_Test();
} );*/