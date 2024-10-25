<?php

class HRM_LON_Create_Table {
    function __construct() {
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        $this->loan_table();
        $this->loan_payment_table();
    }

    public function loan_payment_table() {

        global $wpdb;
        $table_name = $wpdb->prefix . 'hrm_loan_payment';
        //status 0=inactive, 1=active, 2=deleted
        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
          `id` bigint(20) NOT NULL AUTO_INCREMENT,
          `loan_id` bigint(20) DEFAULT 0,
          `type_id` bigint(20) DEFAULT 0 COMMENT 'Exa: Salary_id',
          `amount` float DEFAULT NULL,
          `interest_amount` float DEFAULT NULL,
          `status` varchar(255) DEFAULT NULL COMMENT '1:complete, 2:incomplete',
          `created_by` int(10) unsigned DEFAULT NULL,
          `updated_by` int(10) unsigned DEFAULT NULL,
          `updated_at` timestamp DEFAULT '0000-00-00 00:00:00',
          `created_at` timestamp DEFAULT '0000-00-00 00:00:00',

          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

        dbDelta( $sql );
    }

    public function loan_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'hrm_loan';
        //status 0=inactive, 1=active, 2=deleted
        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
          `id` bigint(20) NOT NULL AUTO_INCREMENT,
          `employee_id` bigint(20) NOT NULL,
          `parent` bigint(20) DEFAULT 0,
          `loan_date` timestamp DEFAULT '0000-00-00 00:00:00',
          `deduct_date` timestamp DEFAULT '0000-00-00 00:00:00',
          `created_date` timestamp DEFAULT '0000-00-00 00:00:00',
          `amount` float DEFAULT NULL,
          `interest_rate` float DEFAULT NULL,
          `interest_type` varchar(255) DEFAULT NULL,
          `installment` int(10) unsigned DEFAULT NULL,
          `monthly_installment` float DEFAULT NULL,
          `principal_balance` float DEFAULT NULL,
          `interest_balance` float DEFAULT NULL,
          `account` varchar(255) DEFAULT NULL,
          `status` varchar(255) DEFAULT NULL COMMENT '1:complete, 2:incomplete',
          `created_by` int(10) unsigned DEFAULT NULL,
          `updated_by` int(10) unsigned DEFAULT NULL,
          `updated_at` timestamp DEFAULT '0000-00-00 00:00:00',
          `created_at` timestamp DEFAULT '0000-00-00 00:00:00',

          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

        dbDelta( $sql );
    }
    // public function schema() {
    //     $table = 'hrm_loan';
        
    //     if (!Capsule::schema()->hasTable( $table )) {
    //         Capsule::schema()->create( $table, function( $table ) {
    //             $table->increments( 'id' );
    //             $table->bigInteger( 'employee_id' )->nullable();
    //             $table->bigInteger( 'parent' )->default('0');
    //             $table->timestamp( 'loan_date' )->nullable();
    //             $table->timestamp( 'deduct_date' )->nullable();
    //             $table->timestamp( 'created_date' )->nullable();
    //             $table->float( 'amount' )->nullable();
    //             $table->float( 'interest_rate' )->nullable();
    //             $table->string( 'interest_type' )->nullable()->comment('1:=, 2:%');
    //             $table->integer( 'installment' )->nullable();
    //             $table->float( 'monthly_installment' )->nullable();
    //             $table->float( 'principal_balance' )->nullable();
    //             $table->float( 'interest_balance' )->nullable();
    //             $table->string( 'account' )->nullable();
    //             $table->string( 'status' )->nullable()->comment('1:complete, 2:incomplete');

    //             $table->unsignedInteger( 'created_by' )->nullable();
    //             $table->unsignedInteger( 'updated_by' )->nullable();
    //             $table->timestamps();
    //         } );
    //     }
    // }
    // 
    // public function schema() {
    //     $table = 'hrm_loan_payment';
        
    //     if (!Capsule::schema()->hasTable( $table )) {
    //         Capsule::schema()->create( $table, function( $table ) {
    //             $table->increments( 'id' );
    //             $table->bigInteger( 'loan_id' );
    //             $table->bigInteger( 'type_id' )->comment('Exa: Salary_id');
    //             $table->integer( 'amount' )->nullable();
    //             $table->integer( 'interest_amount' )->nullable();
    //             $table->string( 'status' )->nullable()->comment('1:complete, 2:incomplete');
    //             $table->unsignedInteger( 'created_by' )->nullable();
    //             $table->unsignedInteger( 'updated_by' )->nullable();
    //             $table->timestamps();
    //         } );
    //     }
    // }
}