<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WPUP Class Autoloader.
 *
 * @since   0.1
 *
 * @return  void
 */
class HRM_Autoloader {

	/**
	 * The Constructor.
	 */
	public function __construct() {
		spl_autoload_register( array( $this, 'autoload' ) );
	}

	/**
	 * Take a class name and turn it into a file name.
	 *
	 * @param  string $class
	 *
	 * @since  0.1
	 * 
	 * @return string
	 */
	private function get_file_name_from_class( $class ) {
		return str_replace( '_', '-', $class ) . '.php';
	}

	/**
	 * Include a class file.
	 *
	 * @param  string $path
	 *
	 * @since  0.1
	 * 
	 * @return bool successful or not
	 */
	private function load_file( $path ) {

		if ( file_exists( $path ) ) {
			include_once( $path );
			return true;
		}

		return false;
	}

	/**
	 * Auto-load WPUP classes.
	 *
	 * @param string $class
	 */
	public function autoload( $class ) {
		$class = strtolower( $class );
		$file  = $this->get_file_name_from_class( $class );
		$path  = '';

		if ( strpos( $class, 'hrm_addons_gateway_' ) === 0 ) {
			$path = 'gateways/' . substr( str_replace( '_', '-', $class ), 18 ) . '/';
		} elseif ( strpos( $class, 'hrm_gateway_' ) === 0 ) {
			$path = 'gateways/' . substr( str_replace( '_', '-', $class ), 11 ) . '/';
		} elseif ( strpos( $class, 'hrm_shipping_' ) === 0 ) {
			$path = 'shipping/' . substr( str_replace( '_', '-', $class ), 12 ) . '/';
		} elseif ( strpos( $class, 'hrm_shortcode_' ) === 0 ) {
			$path = 'shortcodes/';
		} elseif ( strpos( $class, 'hrm_meta_box' ) === 0 ) {
			$path = 'admin/meta-boxes/';
		} elseif ( strpos( $class, 'hrm_admin' ) === 0 ) {
			$path = 'admin/';
		} elseif ( strpos( $class, 'hrm_cli_' ) === 0 ) {
			$path = 'cli/';
		} elseif ( strpos( $class, 'hrm_payment_token_' ) === 0 ) {
			$path = 'payment-tokens/';
		}
		
		$full_path = HRM_FRONTEND_INCLUDES . '/' . $path . $file;
		
		$this->load_file( $full_path );
	}
}

new HRM_Autoloader();
