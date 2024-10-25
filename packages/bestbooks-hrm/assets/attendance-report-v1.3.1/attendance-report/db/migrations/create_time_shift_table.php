<?php

class Hrm_Time_Shift {
    function __construct() {
        $this->create_time_shift_table();
    }

    public function create_time_shift_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'hrm_time_shift';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `name` varchar(255) DEFAULT NULL,
          `status` tinyint(4) DEFAULT NULL,
          `department` int(11) NOT NULL,
          `puch_start` timestamp NULL DEFAULT NULL,
          `times` text,
          `created_at` datetime NOT NULL,
          `updated_at` datetime NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }

}

new Hrm_Time_Shift();