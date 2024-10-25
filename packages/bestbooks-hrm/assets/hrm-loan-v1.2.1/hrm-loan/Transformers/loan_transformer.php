<?php

namespace HRM\Transformers;

use League\Fractal\TransformerAbstract;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use HRM\Core\Common\Traits\Transformer_Manager;
use HRM\Core\Common\Resource_Editors;
use League\Fractal\Resource\Item;
use HRM\Models\Loan;
use HRM\Models\Payment;
use HRM\Transformers\Payment_Transformer;


class Loan_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'payment'
    ];

    public function transform( Loan $item ) {
        
        return [
            'id'                  => $item->id,
            'loan_date'           => $item->loan_date,
            'deduct_date'         => $item->deduct_date,
            'created_date'        => $item->created_date,
            'amount'              => $item->amount,
            'interest_rate'       => $item->interest_rate,
            'interest_type'       => $item->interest_type,
            'installment'         => $item->installment,
            'monthly_installment' => $item->monthly_installment,
            'principal_balance'   => $item->principal_balance,
            'interest_balance'    => $item->interest_balance,
            'account'             => $item->account,
            'status'              => $item->status,
            'employee_id'         => $item->employee_id
        ];
    }

    public function includePayment( Loan $item ) {
        $payment = $item->payment;

        return new Collection( $payment, new Payment_Transformer );
    }
}