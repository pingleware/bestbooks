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
            'shift_id'         => $item->shift_id,
            'amount'          => $item->amount,
            'interest_amount' => $item->interest_amount,
            'status'          => $item->status,
            'created_at'      => hrm_get_date( $item->created_at ),
        ];
    }

}