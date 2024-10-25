<?php


class HRMR_Active {
	function __construct () {
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		$this->recruitment_table();
		$this->application_table();
		$this->create_pages();
		$this->save_plugin_version();
	}

	function recruitment_table () {
		global $wpdb;
		$table_name = $wpdb->prefix . 'hrm_recruitment';
		// COMMENT '0: fullTime; 1: parttime; 2:freelncing; 3: internship; 4: temporary'

		$sql = "CREATE TABLE IF NOT EXISTS  `{$table_name}` (
			  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			  `position` varchar(255) NOT NULL,
			  `description` text,
			  `jobtype` tinyint(4) NOT NULL DEFAULT '0',
			  `department` int(10) unsigned DEFAULT NULL,
			  `designation` int(10) unsigned DEFAULT NULL,
			  `location` int(10) unsigned DEFAULT NULL,
			  `status` tinyint(4) NOT NULL DEFAULT '1' ,
			  `open` timestamp NULL DEFAULT NULL,
			  `close` timestamp NULL DEFAULT NULL,
			  `questions` text,
			  `created_by` int(10) unsigned DEFAULT NULL,
			  `updated_by` int(10) unsigned DEFAULT NULL,
			  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
			  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
			  PRIMARY KEY (`id`),
			  KEY `department_designation` (`department`,`designation`),
			  KEY `jobtype` (`jobtype`)
			);";

		dbDelta( $sql );
	}

	function application_table () {
		global $wpdb;
		$table = $wpdb->prefix . 'hrm_applications';

		$sql = "CREATE TABLE IF NOT EXISTS  `{$table}` (
			  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			  `recruitment_id` int(10) unsigned NOT NULL,
			  `user_id` tinyint(10) DEFAULT NULL,
			  `first_name` varchar(50) DEFAULT NULL,
			  `last_name` varchar(50) DEFAULT NULL,
			  `email` varchar(50) DEFAULT NULL,
			  `gender` tinyint(2) DEFAULT NULL,
			  `marital_status` tinyint(2) DEFAULT NULL,
			  `date_of_birth` datetime DEFAULT NULL,
			  `address1` varchar(255) DEFAULT NULL,
			  `address2` varchar(255) DEFAULT NULL,
			  `city` varchar(50) DEFAULT NULL,
			  `state` varchar(50) DEFAULT NULL,
			  `zip_code` varchar(10) DEFAULT NULL,
			  `country` varchar(255) DEFAULT NULL,
			  `mobile` varchar(20) DEFAULT NULL,
			  `profile` varchar(10) DEFAULT NULL,
			  `educations` longtext,
			  `skills` longtext,
			  `experiences` longtext,
			  `questions` longtext,
			  `resume` longtext,
			  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
			  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
			  PRIMARY KEY (`id`),
			  KEY `recruitment_id` (`recruitment_id`)
			);";

		dbDelta( $sql );
	}

	/**
     * Create Frontend Page if they not exist
     *
     */
    public function create_pages() {
        global $wpdb;
        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            return;
        }
        $page_data = array(
            'post_status'    => 'publish',
            'post_author'    => get_current_user_id(),
            'comment_status' => 'close',
            'ping_status'    => 'close',
            'post_type'      => 'page',
            'post_parent'    => 0,
        );

        // Create Project Page
        $page = get_option( 'hrm_recruitment_settings', [] );

        if ( empty( $page['page'] ) ) {

            $page_title = __( 'Recruitment', 'hrmr' );

            $page_data['post_title']   = $page_title;
            $page_data['post_content'] = "[hrm-recruitment]";

            $e = wp_insert_post( $page_data, true );

            if ( ! is_wp_error( $e ) ) {
                $page['page'] = $e;
            }
        	update_option( 'hrm_recruitment_settings', $page );
        }
    }

	function save_plugin_version () {
		update_option('HRM_RECRUITMRNT_VERSION', HRM_RECRUITMRNT_VERSION);
		update_option('HRM_RECRUITMRNT_DB_VERSION', HRM_RECRUITMRNT_DB_VERSION);
	}
}