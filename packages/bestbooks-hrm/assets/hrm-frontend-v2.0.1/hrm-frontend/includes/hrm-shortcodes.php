<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * HRM_Shortcodes class
 *
 * @class       HRM_Shortcodes
 * @version     0.1
 */
class HRM_Shortcodes {

	/**
	 * Init shortcodes.
	 */
	public static function init() {
		$shortcodes = array(

			'wpSpear_hrm'      => __CLASS__ . '::hrm',
			// 'hrm_organization' => __CLASS__ . '::organization',
			// 'hrm_department'   => __CLASS__ . '::department',
			// 'hrm_employee'     => __CLASS__ . '::employee',
			// 'hrm_attendance'   => __CLASS__ . '::attendance',
			// 'hrm_leave'        => __CLASS__ . '::leave',
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
			'class'  => 'hrm',
			'before' => null,
			'after'  => null
		)
	) {
		ob_start();

		echo empty( $wrapper['before'] ) ? '<div id="hrm" class="' . esc_attr( $wrapper['class'] ) . '">' : $wrapper['before'];
		call_user_func( $function, $atts );
		echo empty( $wrapper['after'] ) ? '</div>' : $wrapper['after'];

		return ob_get_clean();
	}

	/**
	 * hrm builder shortcode.
	 *
	 * @since  1.0
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function hrm( $atts ) {
		return self::shortcode_wrapper( array( 'HRM_Shortcode_hrm', 'output' ), $atts );
	}

	/**
	 * building form views shortcode.
	 *
	 * @since  1.0
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function organization( $atts ) {
		return self::shortcode_wrapper( array( 'HRM_Shortcode_Organization', 'output' ), $atts );
	}

	/**
	 * building form views shortcode.
	 *
	 * @since  1.0
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function department( $atts ) {
		return self::shortcode_wrapper( array( 'HRM_Shortcode_Department', 'output' ), $atts );
	}

	/**
	 * building form views shortcode.
	 *
	 * @since  1.0
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function employee( $atts ) {
		return self::shortcode_wrapper( array( 'HRM_Shortcode_Employee', 'output' ), $atts );
	}

	/**
	 * building form views shortcode.
	 *
	 * @since  1.0
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function attendance( $atts ) {
		return self::shortcode_wrapper( array( 'HRM_Shortcode_Attendance', 'output' ), $atts );
	}

	/**
	 * building form views shortcode.
	 *
	 * @since  1.0
	 *
	 * @param mixed $atts
	 * 
	 * @return string
	 */
	public static function leave( $atts ) {
		return self::shortcode_wrapper( array( 'HRM_Shortcode_Leave', 'output' ), $atts );
	}

}
