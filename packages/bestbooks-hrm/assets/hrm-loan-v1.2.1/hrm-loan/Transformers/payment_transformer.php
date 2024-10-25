<?php

namespace HRM\Transformers;

use League\Fractal\TransformerAbstract;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use HRM\Core\Common\Traits\Transformer_Manager;
use HRM\Core\Common\Resource_Editors;
use League\Fractal\Resource\Item;
use HRM\Models\Payment;


class Payment_Transformer extends TransformerAbstract {

    use Resource_Editors;

    public function transform( Payment $item ) {
        
        return [
            'id'              => $item->id,
            'loan_id'         => $item->loan_id,
            'amount'          => $item->amount,
            'interest_amount' => $item->interest_amount,
            'status'          => $item->status,
            'created_at'      => hrm_get_date( $item->created_at ),
        ];
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