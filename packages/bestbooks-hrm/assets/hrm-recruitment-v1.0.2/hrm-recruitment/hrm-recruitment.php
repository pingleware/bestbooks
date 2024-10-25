<?php
/**
 * Plugin Name: WP human resource management employee recruitment
 * Plugin URI: http://mishubd.com/plugin/human-resource-management-hrm/
 * Description: post jobs and add employee in your organigation 
 * Author: asaquzzaman
 * Version: 1.0.2
 * Author URI: http://mishubd.com
 * License: GPL2
 * TextDomain: hrm-rc
 */


//require_once dirname (__FILE__) . '/vendor/autoload.php';
class Hrm_Recruitment {

    public static $version = '1.0.2';
	
	function __construct()
	{
		$this->define_constants();
        return $this;
	}

    function init () {
        $this->includes();
        $this->instantiate();
        $this->init_actions();
        $this->init_filters();

    }

	function includes() {
        require_once HRM_RECRUITMRNT_PATH . '/includes/Recruitment.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/Recruitment_Transformer.php';        
        require_once HRM_RECRUITMRNT_PATH . '/includes/Application.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/Application_Transformer.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/Ajax_Request.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/HRMR_Shortcodes.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/HRMR_Active.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/Notification.php';
        require_once HRM_RECRUITMRNT_PATH . '/includes/license-handler/EDD_License_Handler.php';

        new Ajax_Request();
        HRMR_Shortcodes::init();
        //$this->migrate_db();
    }

    function migrate_db() {
        $migrater = new \HRMR\Core\Database\Migrater();
        
        $migrater->build_schema();
    }

    function instantiate() {
        (new HRM_Recruitment_License)->init( __FILE__, HRM_RECTUITMENT_ITEM_NAME, self::$version, 'Asaquzzaman' );
    }

	public function init_actions() {
		add_action( 'hrm_menu_before_load_scripts', array( $this, 'load_menu_item' ) );
	}

	public function init_filters() {
		add_filter('database_schema_files', array( $this, 'load_database_files') );
        add_filter( 'hrm_addons', array( $this, 'recruitment_addon' ) );
        add_filter( 'hrm_addons_license', array( $this, 'license' ) );
	}

    function license( $licenses ) {
        $licenses[] = array (
            'id'          => HRM_RECTUITMENT_ITEM_NAME,
            'item_name'   => HRM_RECTUITMENT_ITEM_NAME,
            'name'        => sprintf( __( '%1$s License Key', 'hrm-frontend' ), 'HRM Recruitment' ),
            'desc'        => '',
            'type'        => 'license_key',
            'size'        => 'regular',
            'field_class' => 'hrm-recruitment-license-class',
            'class_name'  => 'HRM_Recruitment_License'
        );

        return $licenses;
    }

    function recruitment_addon( $addons ) {

        $addons[] = array(
            'label' => 'Recruitment',
            'key'  => 'recruitment'
        );

        return $addons;
    }

	public function load_menu_item( $home ) {
		global $submenu;
		$hrm_page_slug = hrm_page_slug();

        $submenu[$hrm_page_slug]['recruitment'] = [ __( 'Recruitment', 'hrm' ), 'read', 'admin.php?page=hr_management#/recruitment' ];

        // Script and style should load after menu register
        add_action( 'admin_print_styles-' . $home, array($this, 'hrm_recruitment_load_scripts') );
	}

	public function hrm_recruitment_load_scripts() {
        wp_enqueue_script( 'hrm-er', plugins_url( '', __FILE__ ). '/assets/js/hrmrc.js', array('jquery','hrm-config'), false, true );
		wp_enqueue_style( 'hrm-er', plugins_url( '', __FILE__ ). '/assets/css/hrmrc.css', false );
		wp_localize_script( 'hrm-er', 'HRM_ER_Vars', [
			'hrm_er_url'         => HRM_RECRUITMRNT_URL,
            'settings'          => $this->get_hrmr_settings(),
            'hrm_recruitment' => 'active'
		]);
    }
    
    public function get_hrmr_settings ()  {
        $settings = get_option( 'hrm_recruitment_settings', [] );
        if ( !empty( $settings['page'] ) ) {
            $settings['page'] = get_page( intval( $settings['page'] ) );
        }
        return $settings;
    }

	 /**
     * Define cpmrp Constants
     *
     * @since 1.0
     * @return type
     */
    private function define_constants() {
        $this->define( 'HRM_RECRUITMRNT_VERSION', '1.0.0' );
        $this->define( 'HRM_RECRUITMRNT_DB_VERSION', '1.0' );
        $this->define( 'HRM_RECRUITMRNT_PATH', dirname( __FILE__ ) );
        $this->define( 'HRM_RECRUITMRNT_URL', plugins_url( '', __FILE__ ) );
        $this->define( 'HRM_RECTUITMENT_ITEM_NAME', 'HRM Recruitment' );
    }

    /**
     * Define constant if not already set
     *
     * @since 1.0
     *
     * @param  string $name
     * @param  string|bool $value
     * @return type
     */
    private function define( $name, $value ) {
        if ( ! defined( $name ) ) {
            define( $name, $value );
        }
    }
}

$recruitment = new Hrm_Recruitment();

add_action( 'plugins_loaded', function () use ($recruitment) {
    if ( class_exists('WP_Hrm') ) {
        $recruitment->init();
    }
}, 99 );


register_activation_hook( __FILE__, function() {
    require_once  __DIR__ . '/includes/HRMR_Active.php';
    new HRMR_Active();
});


