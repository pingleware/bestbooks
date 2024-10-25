<?php
namespace HRM\Models;

use HRM\Core\Database\Model as Eloquent;

class Payment extends Eloquent {

    protected $table      = 'hrm_loan_payment';
    protected $primaryKey = 'id';
    public $timestamps    = true;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    protected $fillable = [
        'loan_id',
        'type_id',
        'amount',
        'interest_amount',
        'status',
        'created_at',
        'updated_at'
    ];

    public static function sanitize() {
        $instance = self::getInstance();
        $postdata = [];

        foreach ( $instance->fillable as $key => $fillable ) {
            
            if ( isset( $_POST[$fillable] ) ) {
                $postdata[$fillable] = hrm_clean( $_POST[$fillable] );
            }
        }

        return $postdata;
    }
}
