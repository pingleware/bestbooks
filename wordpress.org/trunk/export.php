<?php
// File: export.php
if (!function_exists('bestbooks_export_filters')) {
	function bestbooks_export_filters() {
		?>
		<p><label><input type="radio" name="content" value="bestbooks" /> <?php _e( 'BestBooks' ); ?></label></p>
		<?php
	}

	add_filter('export_filters', 'bestbooks_export_filters');
}


if (!function_exists('bestbooks_export_args')) {
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

	add_filter('export_args', 'bestbooks_export_args', 10, 1);
}

if (!function_exists('bestbooks_export_add_js')) {
	function bestbooks_export_add_js() {
	
	}

	add_action('export_add_js','bestbooks_export_add_js');
}

if (!function_exists('bestbooks_export_wp')) {
	function bestbooks_export_wp($args) {
	}

	add_action('export_wp', 'bestbooks_export_wp', 10, 1);
}

if (!function_exists('bestbooks_export_to_filename')) {
	function bestbooks_export_to_filename($wp_filename, $sitename, $date) {
		return $wp_filename;
	}

	add_filter('export_wp_filename','bestbooks_export_to_filename',10,3);		
}
?>