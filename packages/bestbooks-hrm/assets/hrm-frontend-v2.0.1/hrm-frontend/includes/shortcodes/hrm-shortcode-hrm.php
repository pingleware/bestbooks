<?php
/**
 */
class HRM_Shortcode_hrm {

	/**
	 * Get the shortcode content.
	 *
	 * @param array $atts
	 * @return string
	 */
	public static function get( $atts ) {
		return HRM_Shortcodes::shortcode_wrapper( array( __CLASS__, 'output' ), $atts );
	}

	/**
	 * Output the shortcode.
	 *
	 * @param array $atts
	 */
	public static function output( $atts = array() ) {
		if ( ! is_user_logged_in() ) {
			wp_login_form();
			return;
		}
		
		echo '<div id="wpspear-hrm"></div>';

		hrm_front::enqueue_scripts();
		Hrm_Scripts::footer_tag();
	}

}