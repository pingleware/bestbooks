<?php
namespace HRM\Models;

use HRM\Core\Database\Model as Eloquent;
use HRM\Models\Payment;

class Loan extends Eloquent {

    protected $table      = 'hrm_loan';
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
        'loan_date',
        'deduct_date',
        'amount',
        //'interest_rate',
        //'interest_type',
        'installment',
        'monthly_installment',
        //'principal_balance',
        //'interest_balance',
        'account',
        'status',
        'employee_id'
    ];

    public function payment() {
        return $this->hasMany('HRM\Models\Payment', 'loan_id');
    }

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
