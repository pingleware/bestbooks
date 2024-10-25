<?php

namespace HRM\Transformers;

use League\Fractal\TransformerAbstract;
use HRM\Models\Application;
use HRM\Core\File_System\File_System;
    
class Application_Transformer extends TransformerAbstract
{

    public function transform( Application $item ) {
        return [
            'id'             => $item->id,
            'first_name'     => $item->first_name,
            'last_name'      => $item->last_name,
            'email'          => $item->email,
            'gender'         => $item->gender == 1 ? __('Male', 'hrmr') : __('Female', 'hrmr'),
            'marital_status' => ucfirst($item->marital_status),
            'date_of_birth'  => $item->date_of_birth,
            'address1'       => $item->address1,
            'address2'       => $item->address2,
            'city'           => $item->city,
            'state'          => $item->state,
            'zip_code'       => $item->zip_code,
            'country'        => $item->country,
            'mobile'         => $item->mobile,
            'profile'         => File_System::get_file( $item->profile ),
            'educations'     => $item->educations,
            'skills'         => $item->skills,
            'experiences'    => $item->experiences,
            'questions'      => $item->questions,
            'resume'         => File_System::get_file( $item->resume )
        ];

    }

}
