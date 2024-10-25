<?php
/**
 * Plugin Name: HRM Attendance report
 * Description: HR manager can check each and every employee attendance report and customize punch in/out
 * Module URI: https://wpspear.com
 * Thumbnail URL: https://image.flaticon.com/icons/png/512/138/138361.png
 * Author: WP Spear
 * Version: 1.3.1
 * Author URI: https://wpspear.com/hrm/attendance-report/
 */


class HRM_Attendance_Report {
    public static $version = '1.3.1';

	function __construct() {
		$this->define_constants();
		$this->includes();
        $this->instantiate();
		$this->actions();
		$this->filters();
	}

	function define_constants() {
		$this->define( 'HRM_CUSTOMIZE_VERSION', self::$version );
        $this->define( 'HRM_CUSTOMIZE_DB_VERSION', '0.1' );
        $this->define( 'HRM_CUSTOMIZE_PATH', dirname( __FILE__ ) );
        $this->define( 'HRM_CUSTOMIZE_URL', plugins_url( '', __FILE__ ) );

        //Item name should be same as the product post title
        //Exa. From you website the product title is 'WooCommerce Product Feed' so WOOGOOL_ITEM_NAME should be 'WooCommerce Product Feed'
        $this->define( 'HRM_SHIFT_ITEM_NAME', 'Attendance Report' );
	}

	/**
     * Define constant if not already set
     *
     * @since 1.1
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

    public static function init() {
        if ( !class_exists( 'Wp_Hrm' ) ) {
            deactivate_plugins( __FILE__ );
            exit('"WP human resource management" plugin is not installed. <a target="__blank" href="https://wordpress.org/plugins/hrm/">Install</a> the plugin first.');
            return;
        }

        require_once dirname(__FILE__) . '/db/migrations/create_time_shift_table.php';
    }

	function includes() {
		$this->shift_libs();
        require_once HRM_CUSTOMIZE_PATH . '/core/license-handler/EDD_License_Handler.php';
		require_once HRM_CUSTOMIZE_PATH . '/core/shift_action.php';
        //require_once HRM_CUSTOMIZE_PATH . '/Models/shift.php';
        //require_once HRM_CUSTOMIZE_PATH . '/Transformers/shift_transformer.php';
        //require_once HRM_CUSTOMIZE_PATH . '/Models/attendance.php';
        //require_once HRM_CUSTOMIZE_PATH . '/Transformers/attendance_transformer.php';
	}

    function instantiate() {
        (new HRM_Shift_License)->init( __FILE__, HRM_SHIFT_ITEM_NAME, self::$version, 'Asaquzzaman' );
    }

	function actions() {

		add_action( 'hrm_addons_content', array( $this, 'update_license' ) );
		add_action( 'hrm_before_load_script', array( $this, 'scripts' ) );
	}

	function filters() {
		add_filter( 'hrm_addons', array( $this, 'shift_addon' ) );
        add_filter( 'hrm_addons_license', array( $this, 'license' ) );
		add_filter('hrm_load_schema_files', array( $this, 'create_table' ), 10, 1 );
	}

    function license( $licenses ) {
        $licenses[] = array (
            'id'          => HRM_SHIFT_ITEM_NAME,
            'item_name'   => HRM_SHIFT_ITEM_NAME,
            'name'        => sprintf( __( '%1$s License Key', 'hrm-frontend' ), 'HRM Shift' ),
            'desc'        => '',
            'type'        => 'license_key',
            'size'        => 'regular',
            'field_class' => 'hrm-shift-license-class', 
            'class_name'  => 'HRM_Shift_License'
        );

        return $licenses;
    }

	function shift_addon( $addons ) {

        $addons[] = array(
            'label' => 'Shift',
            'key'  => 'shift'
        );

        return $addons;
	}

	function create_table( $files ) {

		include_once  HRM_CUSTOMIZE_PATH . '/db/migrations/create_time_shift_table.php';
		//include_once  HRM_CUSTOMIZE_PATH . '/db/migrations/create_shift_payment_table.php';

		$schema_path = array(
			HRM_CUSTOMIZE_PATH . '/db/migrations/create_time_shift_table.php',
			//HRM_CUSTOMIZE_PATH . '/db/migrations/create_shift_payment_table.php'
		);

		return array_merge( $files, $schema_path );
	}

	function shift_libs() {
	    $files = glob( __DIR__ . "/libs/*.php" );
	    
	    if ( $files === false ) {
	        throw new RuntimeException( "Failed to glob for lib files" );
	    }

	    foreach ($files as $file) {
	        require_once $file;
	    }

	    unset( $file );
	    unset( $files );
	}

	function shift_menu() {
		global $submenu;
        $capability    = hrm_employee_role_key(); 
        $hrm_page_slug = hrm_page_slug();
        
        if ( ! $hrm_page_slug ) {
            return;
        }

        $submenu[$hrm_page_slug][] = [__( 'Shift', 'hrm' ), $capability, 'admin.php?page=hr_management#/shift'];
	}

	function scripts() {

	    wp_enqueue_script( 
            'hrm-shift',
            plugins_url( '', __FILE__ ) . '/views/assets/js/shift.js',
            ['hrm-const'], 
            HRM_VERSION, 
            true
        );

        wp_localize_script( 'hrm-shift', 'HRM_Shift_Vars', array(
            'dir_url' => HRM_CUSTOMIZE_URL,
            'hrm_attendance_report' => 'active'
        ));
	}
}

add_action( 'plugins_loaded', 'hrm_shift_init' );

function hrm_shift_init() {
	if ( !class_exists( 'Wp_Hrm' ) ) {
        return;
    }
	new HRM_Attendance_Report();
}

register_activation_hook( __FILE__, array( 'HRM_Attendance_Report', 'init' ) );

