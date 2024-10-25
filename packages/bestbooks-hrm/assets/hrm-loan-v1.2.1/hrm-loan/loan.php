<?php
/**
 * Plugin Name: LOAN 
 * Description: Loan add-on for HRM.
 * Module URI: https://wpspear.com
 * Thumbnail URL: https://image.flaticon.com/icons/png/512/138/138361.png
 * Author: WP Spear
 * Version: 1.2.1
 * Author URI: https://wpspear.com/hrm/payroll-loan/
 */


class HRM_Loan {
    public static $version = '1.2.1';
    public static $db_version = '0.1';

	function __construct() {
		$this->define_constants();
		$this->includes();
        $this->instantiate();
		$this->actions();
		$this->filters();
	}

	function define_constants() {
		$this->define( 'HRM_LOAN_VERSION', self::$version );
        $this->define( 'HRM_LOAN_DB_VERSION', self::$db_version );
        $this->define( 'HRM_LOAN_PATH', dirname( __FILE__ ) );
        $this->define( 'HRM_LOAN_URL', plugins_url( '', __FILE__ ) );

        //Item name should be same as the product post title
        //Exa. From you website the product title is 'WooCommerce Product Feed' so WOOGOOL_ITEM_NAME should be 'WooCommerce Product Feed'
        $this->define( 'HRM_LOAN_ITEM_NAME', 'HRM Loan' );
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

        self::install();
    }

    public static function install() {

        require_once  __DIR__ . '/db/create_table.php';
        new HRM_LON_Create_Table();
    }

	function includes() {
		$this->loan_libs();
        require_once HRM_LOAN_PATH . '/core/license-handler/EDD_License_Handler.php';
		require_once HRM_LOAN_PATH . '/core/action.php';
		require_once HRM_LOAN_PATH . '/Models/loan.php';
		require_once HRM_LOAN_PATH . '/Models/payment.php';
		require_once HRM_LOAN_PATH . '/Transformers/loan_transformer.php';
		require_once HRM_LOAN_PATH . '/Transformers/payment_transformer.php';

	}

    function instantiate() {
        (new HRM_Loan_License)->init( __FILE__, HRM_LOAN_ITEM_NAME, self::$version, 'Asaquzzaman' );
    }

	function actions() {
		add_action( 'hrm_addons_content', array( $this, 'update_license' ) );
		add_action( 'hrm_before_load_script', array( $this, 'scripts' ) );
	}

	function filters() {
		add_filter( 'hrm_addons', array( $this, 'loan_addon' ) );
        add_filter( 'hrm_addons_license', array( $this, 'license' ) );
		add_filter('hrm_load_schema_files', array( $this, 'create_table' ), 10, 1 );
	}

    function license( $licenses ) {
        $licenses[] = array (
            'id'          => HRM_LOAN_ITEM_NAME,
            'item_name'   => HRM_LOAN_ITEM_NAME,
            'name'        => sprintf( __( '%1$s License Key', 'hrm-frontend' ), 'HRM Loan' ),
            'desc'        => '',
            'type'        => 'license_key',
            'size'        => 'regular',
            'field_class' => 'hrm-loan-license-class', 
            'class_name'  => 'HRM_Loan_License'
        );

        return $licenses;
    }

	function loan_addon( $addons ) {

        $addons[] = array(
            'label' => 'Loan',
            'key'  => 'loan'
        );

        return $addons;
	}

	function create_table( $files ) {
		include_once  HRM_LOAN_PATH . '/db/migrations/create_loan_table.php';
		include_once  HRM_LOAN_PATH . '/db/migrations/create_loan_payment_table.php';

		$schema_path = array(
			HRM_LOAN_PATH . '/db/migrations/create_loan_table.php',
			HRM_LOAN_PATH . '/db/migrations/create_loan_payment_table.php'
		);

		return array_merge( $files, $schema_path );
	}

	function loan_libs() {
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

	function loan_menu() {
		global $submenu;
        $capability    = hrm_employee_role_key(); 
        $hrm_page_slug = hrm_page_slug();
        
        if ( ! $hrm_page_slug ) {
            return;
        }

        $submenu[$hrm_page_slug][] = [__( 'Loan', 'hrm' ), $capability, 'admin.php?page=hr_management#/loan'];
	}

	function scripts() {
	    wp_enqueue_script( 
            'hrm-loan',
            plugins_url( '', __FILE__ ) . '/views/assets/js/loan.js',
            ['hrm-const'], 
            HRM_VERSION, 
            true
        );

        wp_localize_script( 'hrm-loan', 'HRM_Loan_Vars', array(
    
            'dir_url' => HRM_LOAN_URL,
        ));
	}
}

add_action( 'plugins_loaded', 'hrm_loan_init' );

function hrm_loan_init() {
	if ( !class_exists( 'Wp_Hrm' ) ) {
        return;
    }
	new HRM_Loan();
}

register_activation_hook( __FILE__, array( 'HRM_Loan', 'init' ) );

