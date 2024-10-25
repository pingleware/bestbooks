<?php
/**
 * License handler for Easy Digital Downloads
 *
 * This class should simplify the process of adding license information
 * to new EDD extensions.
 *
 * @version 1.1
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * EDD_License Class
 */
class HRM_Frontend_License {
	private $file;
	private $license;
	private $item_name;
	private $item_shortname;
	private $version;
	private $author;
	private $prefix = 'wpspear_';
	private $api_url = 'http://wpspear.com/';

	/**
	 * Class constructor
	 *
	 * @global  array $edd_options
	 * @param string  $_file
	 * @param string  $_item_name
	 * @param string  $_version
	 * @param string  $_author
	 * @param string  $_optname
	 * @param string  $_api_url
	 */
	function init( $_file, $_item_name, $_version, $_author ) {

		$this->file           = $_file;
		$this->item_name      = $_item_name;
		$this->item_shortname = $this->get_item_short_name( $_item_name );
		$this->version        = $_version;
		$this->license        = $this->get_license_key( $_item_name );
		$this->author         = $_author;

		// Setup hooks
		$this->includes();
		$this->hooks();
		$this->auto_updater();
	}

	function get_license_key( $item_name ) {
		$active_license_key = $this->active_license_key( $item_name );
		$license            = get_option( $active_license_key ) ? get_option( $active_license_key ) : '';
		
		if ( is_object( $license ) && !empty( $license->license_key ) ) {
			return $license->license_key;
		} 
		
		return '';
	}

	function get_item_short_name( $item_name ) {
		return $this->prefix . preg_replace( '/[^a-zA-Z0-9_\s]/', '', str_replace( ' ', '_', strtolower( $item_name ) ) );
	}

	/**
	 * Include the updater class
	 *
	 * @access  private
	 * @return  void
	 */
	private function includes() {
		require_once 'EDD_SL_Plugin_Updater.php';
	}

	/**
	 * Setup hooks
	 *
	 * @access  private
	 * @return  void
	 */
	private function hooks() {
		add_filter( 'edd_settings_licenses', array( $this, 'settings' ), 1 );
		// Register settings
		add_filter( 'wpspear_settings_licenses', array( $this, 'settings' ), 1 );

		// Activate license key on settings save
		add_action( 'admin_init', array( $this, 'activate_license' ) );

		// Deactivate license key
		add_action( 'admin_init', array( $this, 'deactivate_license' ) );
	}

	/**
	 * Auto updater
	 *
	 * @access  private
	 * @global  array $edd_options
	 * @return  void
	 */
	private function auto_updater() {
		// Setup the updater
		$edd_updater = new HRM_Frontend_SL_Plugin_Updater(
			$this->api_url,
			$this->file,
			array(
				'version'   => $this->version,
				'license'   => $this->license,
				'item_name' => $this->item_name,
				'author'    => $this->author
			)
		);
	}


	/**
	 * Add license field to settings
	 *
	 * @access  public
	 * @param array   $settings
	 * @return  array
	 */
	public function settings( $settings ) {
		$edd_license_settings = array(
			array(
				'id'      => $this->item_shortname,
				'name'    => sprintf( __( '%1$s License Key', 'edd' ), $this->item_name ),
				'desc'    => '',
				'type'    => 'license_key',
				'options' => array( 'is_valid_license_option' => $this->item_shortname . '_license_active' ),
				'size'    => 'regular'
			)
		);

		return array_merge( $settings, $edd_license_settings );
	}

	function active_license_key( $item_name ) {
		$short_name = $this->get_item_short_name( $item_name );

		return $short_name . '_license_active';
	}

	/**
	 * Activate the license key
	 *
	 * @access  public
	 * @return  void
	 */
	public function activate_license() {
		
		if ( ! isset( $_POST['wpspear_settings'] ) )
			return;
		
		$item_field_name = $this->sanitize_key( $this->item_name );
		if ( ! isset( $_POST['wpspear_settings'][$item_field_name] ) )
			return;

		$active_license_key = $this->active_license_key( $this->item_name );

		$details = get_option( $active_license_key );

		if ( is_object( $details ) && 'valid' === $details->license ) {
			//return;
		}

		$license = sanitize_text_field( $_POST['wpspear_settings'][$item_field_name] );

		if( empty( $license ) ) {
			return;
		}

		// Data to send to the API
		$api_params = array(
			'edd_action' => 'activate_license',
			'license'    => $license,
			'item_name'  => urlencode( $this->item_name )
		);

		// Call the API
		$response = wp_remote_get(
			esc_url_raw( add_query_arg( $api_params, $this->api_url ) ),
			array(
				'timeout'   => 15,
				'body'      => $api_params,
				'sslverify' => false
			)
		);

		// Make sure there are no errors
		if ( is_wp_error( $response ) )
			return;

		// Tell WordPress to look for updates
		set_site_transient( 'update_plugins', null );

		// Decode license data
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		if ( is_object( $license_data ) ) {
			$license_data->license_key = $license;
		}
		
		update_option( $active_license_key, $license_data );
	}

	function deactivate_license_key( $item_name ) {
		$short_name = $this->get_item_short_name( $item_name );

		return $short_name . '_license_key_deactivate';
	}


	/**
	 * Deactivate the license key
	 *
	 * @access  public
	 * @return  void
	 */
	public function deactivate_license() {
		if ( ! isset( $_POST['wpspear_settings'] ) )
			return;

		$item_name = $this->sanitize_key( $this->item_name );

		if ( ! isset( $_POST['wpspear_settings'][$item_name] ) )
			return;

		$deactivate_license_key = $this->deactivate_license_key( $this->item_name );

		// Run on deactivate button press
		if ( isset( $_POST[$deactivate_license_key] ) ) {

			// Data to send to the API
			$api_params = array(
				'edd_action' => 'deactivate_license',
				'license'    => $this->license,
				'item_name'  => urlencode( $this->item_name )
			);

			// Call the API
			$response = wp_remote_get(
				esc_url_raw( add_query_arg( $api_params, $this->api_url ) ),
				array(
					'timeout'   => 15,
					'sslverify' => false
				)
			);

			// Make sure there are no errors
			if ( is_wp_error( $response ) )
				return;

			// Decode the license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );
			
			if ( $license_data->license == 'deactivated' ) {
				$active_license_key = $this->active_license_key( $this->item_name );
				delete_option( $active_license_key );
			}
		}
	}

	function license_key_callback( $args ) {
		$active_license_key = $this->active_license_key( $args['item_name'] );

		$license            = get_option( $active_license_key ) ? get_option( $active_license_key ) : '';
		$messages           = array();
		
		if ( is_object( $license ) && !empty( $license->license_key ) ) {
			$value = $license->license_key;
		} else {
			$value = '';
		}

		if( ! empty( $license ) && is_object( $license ) ) {

			// activate_license 'invalid' on anything other than valid, so if there was an error capture it
			if ( false === $license->success ) {

				switch( $license->error ) {

					case 'expired' :

						$class = 'expired';
						$messages[] = sprintf(
							__( 'Your license key expired on %s. Please <a href="%s" target="_blank">renew your license key</a>.', 'easy-digital-downloads' ),
							date_i18n( get_option( 'date_format' ), strtotime( $license->expires, current_time( 'timestamp' ) ) ),
							$this->api_url . 'checkout/?edd_license_key=' . $value . '&utm_campaign=admin&utm_source=licenses&utm_medium=expired'
						);

						$license_status = 'license-' . $class . '-notice';

						break;

					case 'revoked' :

						$class = 'error';
						$messages[] = sprintf(
							__( 'Your license key has been disabled. Please <a href="%s" target="_blank">contact support</a> for more information.', 'easy-digital-downloads' ),
							$this->api_url . 'support?utm_campaign=admin&utm_source=licenses&utm_medium=revoked'
						);

						$license_status = 'license-' . $class . '-notice';

						break;

					case 'missing' :

						$class = 'error';
						$messages[] = sprintf(
							__( 'Invalid license. Please <a href="%s" target="_blank">visit your account page</a> and verify it.', 'easy-digital-downloads' ),
							$this->api_url . 'your-account?utm_campaign=admin&utm_source=licenses&utm_medium=missing'
						);

						$license_status = 'license-' . $class . '-notice';

						break;

					case 'invalid' :
					case 'site_inactive' :

						$class = 'error';
						$messages[] = sprintf(
							__( 'Your %s is not active for this URL. Please <a href="%s" target="_blank">visit your account page</a> to manage your license key URLs.', 'easy-digital-downloads' ),
							$args['name'],
							$this->api_url . 'your-account?utm_campaign=admin&utm_source=licenses&utm_medium=invalid'
						);

						$license_status = 'license-' . $class . '-notice';

						break;

					case 'item_name_mismatch' :

						$class = 'error';
						$messages[] = sprintf( __( 'This appears to be an invalid license key for %s.', 'easy-digital-downloads' ), $args['name'] );

						$license_status = 'license-' . $class . '-notice';

						break;

					case 'no_activations_left':

						$class = 'error';
						$messages[] = sprintf( __( 'Your license key has reached its activation limit. <a href="%s">View possible upgrades</a> now.', 'easy-digital-downloads' ), $this->api_url . 'your-account/' );

						$license_status = 'license-' . $class . '-notice';

						break;

					case 'license_not_activable':

						$class = 'error';
						$messages[] = __( 'The key you entered belongs to a bundle, please use the product specific license key.', 'easy-digital-downloads' );

						$license_status = 'license-' . $class . '-notice';
						break;

					default :

						$class = 'error';
						$error = ! empty(  $license->error ) ?  $license->error : __( 'unknown_error', 'easy-digital-downloads' );
						$messages[] = sprintf( __( 'There was an error with this license key: %s. Please <a href="%s">contact our support team</a>.', 'easy-digital-downloads' ), $error, $this->api_url . 'support' );

						$license_status = 'license-' . $class . '-notice';
						break;
				}

			} else {

				switch( $license->license ) {

					case 'valid' :
					default:

						$class = 'valid';

						$now        = current_time( 'timestamp' );
						$expiration = strtotime( $license->expires, current_time( 'timestamp' ) );

						if( 'lifetime' === $license->expires ) {

							$messages[] = __( 'License key never expires.', 'easy-digital-downloads' );

							$license_status = 'license-lifetime-notice';

						} elseif( $expiration > $now && $expiration - $now < ( DAY_IN_SECONDS * 30 ) ) {

							$messages[] = sprintf(
								__( 'Your license key expires soon! It expires on %s. <a href="%s" target="_blank">Renew your license key</a>.', 'easy-digital-downloads' ),
								date_i18n( get_option( 'date_format' ), strtotime( $license->expires, current_time( 'timestamp' ) ) ),
								$this->api_url . 'checkout/?edd_license_key=' . $value . '&utm_campaign=admin&utm_source=licenses&utm_medium=renew'
							);

							$license_status = 'license-expires-soon-notice';

						} else {

							$messages[] = sprintf(
								__( 'Your license key expires on %s.', 'easy-digital-downloads' ),
								date_i18n( get_option( 'date_format' ), strtotime( $license->expires, current_time( 'timestamp' ) ) )
							);

							$license_status = 'license-expiration-date-notice';

						}

						break;

				}

			}

		} else {
			$class = 'empty';

			$messages[] = sprintf(
				__( 'To receive updates, please enter your valid %s license key.', 'easy-digital-downloads' ),
				$args['name']
			);

			$license_status = null;
		}

		$class .= ' ' . $this->sanitize_html_class( $args['field_class'] );

		$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html = '<input type="text" class="' . sanitize_html_class( $size ) . '-text" id="wpspear_settings[' . $this->sanitize_key( $args['id'] ) . ']" name="wpspear_settings[' . $this->sanitize_key( $args['id'] ) . ']" value="' . esc_attr( $value ) . '"/>';

		if ( ( is_object( $license ) && 'valid' == $license->license ) || 'valid' == $license ) {
			$deactivate_license_key = $this->deactivate_license_key( $args['item_name'] );
			$html .= '<input type="submit" class="button-secondary" name="' . $deactivate_license_key . '" value="' . __( 'Deactivate License',  'easy-digital-downloads' ) . '"/>';
		}

		$html .= '<label for="wpspear_settings[' . $this->sanitize_key( $args['id'] ) . ']"> '  . wp_kses_post( $args['desc'] ) . '</label>';

		if ( ! empty( $messages ) ) {
			foreach( $messages as $message ) {

				$html .= '<div class="edd-license-data edd-license-' . $class . ' ' . $license_status . '">';
					$html .= '<p>' . $message . '</p>';
				$html .= '</div>';

			}
		}

		wp_nonce_field( $this->sanitize_key( $args['id'] ) . '-nonce', $this->sanitize_key( $args['id'] ) . '-nonce' );

		echo $html;
	}

	function sanitize_key( $key ) {
		$raw_key = $key;
		$key = preg_replace( '/[^a-zA-Z0-9_\-\.\:\/]/', '', $key );

		/**
		 * Filter a sanitized key string.
		 *
		 * @since 2.5.8
		 * @param string $key     Sanitized key.
		 * @param string $raw_key The key prior to sanitization.
		 */
		return $key;
	}

	/**
	 * Sanitize HTML Class Names
	 *
	 * @since 2.6.11
	 * @param  string|array $class HTML Class Name(s)
	 * @return string $class
	 */
	function sanitize_html_class( $class = '' ) {

		if ( is_string( $class ) ) {
			$class = sanitize_html_class( $class );
		} else if ( is_array( $class ) ) {
			$class = array_values( array_map( 'sanitize_html_class', $class ) );
			$class = implode( ' ', array_unique( $class ) );
		}

		return $class;

	}


}






