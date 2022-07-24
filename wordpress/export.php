<?php
// File: export.php

add_filter('export_filters', 'bestbooks_export_filters');

function bestbooks_export_filters() {
	?>
	<p><label><input type="radio" name="content" value="bestbooks" /> <?php _e( 'BestBooks' ); ?></label></p>
	<?php
}

add_filter('export_args', 'bestbooks_export_args', 10, 1);
function bestbooks_export_args($args) {
	if ($args['content'] === 'bestbooks') {
		$sitename = sanitize_key( get_bloginfo( 'name' ) );
		if ( ! empty( $sitename ) ) {
			$sitename .= '.';
		}
		$date = date( 'Y-m-d' );
		$wp_filename = $sitename . 'bestbooks.' . $date . '.csv';
		/**
		 * Filters the export filename.
		 *
		 * @since 4.4.0
		 *
		 * @param string $wp_filename The name of the file for download.
		 * @param string $sitename    The site name.
		 * @param string $date        Today's date, formatted.
		 */
		$filename = apply_filters( 'export_wp_filename', $wp_filename, $sitename, $date );

		header( 'Content-Description: File Transfer' );
		header( 'Content-Disposition: attachment; filename=' . $filename );
		header( 'Content-Type: text/xml; charset=' . get_option( 'blog_charset' ), true );
		
	}
}

add_action('export_add_js','bestbooks_export_add_js');
function bestbooks_export_add_js() {
	
}

add_action('export_wp', 'bestbooks_export_wp', 10, 1);
function bestbooks_export_wp($args) {
	//echo '<pre>'; print_r($args); echo '</pre>'; exit;
}

add_filter('export_wp_filename','bestbooks_export_to_filename',10,3);
function bestbooks_export_to_filename($wp_filename, $sitename, $date) {
	//echo '<pre>'; print_r(array($wp_filename, $sitename, $date)); echo '</pre>'; exit;
	return $wp_filename;
}

?>