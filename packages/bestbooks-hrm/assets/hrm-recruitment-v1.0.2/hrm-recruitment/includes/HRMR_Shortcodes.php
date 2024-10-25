<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


class HRMR_Shortcodes {

	/**
	 * Init shortcodes.
	 */
	public static function init() {
		if ( is_admin() ) {
			return;
		}
		$shortcodes = array(
			'hrm-recruitment' => __CLASS__ . '::recruitment_shortcode',
		);

		foreach ( $shortcodes as $shortcode => $function ) {
			add_shortcode( apply_filters( "{$shortcode}_shortcode_tag", $shortcode ), $function );
		}
	}

	/**
	 * Shortcode Wrapper.
	 *
	 * @param string[] $function
	 * @param array $atts (default: array())
	 * @return string
	 */
	public static function shortcode_wrapper(
		$function,
		$atts    = array(),
		$wrapper = array(
			'class'  => 'hrm-recruitment-wrap',
			'before' => null,
			'after'  => null
		)
	) {
		ob_start();

		echo empty( $wrapper['before'] ) ? '<div class="' . esc_attr( $wrapper['class'] ) . '">' : $wrapper['before'];
		call_user_func( $function, $atts );
		echo empty( $wrapper['after'] ) ? '</div>' : $wrapper['after'];

		return ob_get_clean();
	}

	/**
	 * shortcode.
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function recruitment_shortcode( $atts ) {
		return self::shortcode_wrapper( 'HRMR_Shortcodes::output', $atts);
	}

	public static function output( $atts = array() ) {
		$settings = get_site_option('hrm_recruitment_settings',  [ 'required_login' => 1 ]);
		$required_login = isset($settings['required_login'])? $settings['required_login']: 1;

		if ( intval( $required_login ) && !is_user_logged_in() ) {
			wp_login_form( array( 'echo' => true ) );
            return;
		}
		
		echo '<div id="hrm-recruitment"></div>';
		self::scripts();
        
	}

	public static function scripts () {
		$scripts = [
			'hrm-config',
			'hrm-tiny-mce',
			'hrm-time-picke',
			'hrm-jed',
			'hrm-i18n',
			'hrm-vue',
			'hrm-vuex',
			'hrm-vue-router',
			'hrm-vue-multiselect',
			'hrm-preloader',
			'hrm-uploader',
			'hrm-moment',
			'hrm-vue-library',
			'hrm-const'
		];

		foreach ( $scripts as $script ) {
			wp_enqueue_script( $script );
		}

		wp_enqueue_script( 'refrontend', HRM_RECRUITMRNT_URL . '/assets/js/recruitment-frontend.js', ['hrm-const'], '1.0.0', true );
		wp_enqueue_style( 'refrontend-css', HRM_RECRUITMRNT_URL . '/assets/css/recruitment-frontend.css', false, '1.0.0');
		wp_enqueue_style( 'hrm-jquery-ui', HRM_URL . '/assets/css/jquery-ui.css', false, false, 'all' );
        wp_enqueue_style( 'hrm-jquery-ui-timepicker', HRM_URL . '/assets/css/jquery-ui-timepicker-addon.css', false, false, 'all' );

		$country_lists = hrm_Settings::getInstance()->country_list();
		 $lists         = [];
        
        foreach ( $country_lists as $key => $value ) {
            $lists[] = ['iso' => $key, 'country' => $value];
        }
        
		wp_localize_script( 'refrontend', 'HRMR_Frontend_Vars', [
			'nonce'    => wp_create_nonce( 'hrm_nonce' ),
			'ajax_url' => admin_url('admin-ajax.php'),
			'countries' => $lists
		] );

		wp_localize_script( 'refrontend', 'HRM_Vars', [
			'plupload'      => array(
                'browse_button'       => 'hrm-upload-pickfiles',
                'container'           => 'hrm-upload-container',
                'max_file_size'       => '10485760b',
                'url'                 => admin_url( 'admin-ajax.php' ) . '?action=hrm_ajax_upload&nonce=' . wp_create_nonce( 'hrm_ajax_upload' ),
                'flash_swf_url'       => includes_url( 'js/plupload/plupload.flash.swf' ),
                'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
                'filters'             => array( array( 'title' => __( 'Allowed Files' ), 'extensions' => '*' ) ),
                'resize'              => array( 'width' => ( int ) get_option( 'large_size_w' ), 'height' => ( int ) get_option( 'large_size_h' ), 'quality' => 100 )
            )
		]);
	}
}
