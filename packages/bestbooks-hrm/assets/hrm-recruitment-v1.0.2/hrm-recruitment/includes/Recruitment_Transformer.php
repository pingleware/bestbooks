<?php

namespace HRM\Transformers;

use League\Fractal\TransformerAbstract;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use HRM\Transformers\Department_Transformer;
use HRM\Transformers\Designation_Transformer;
use HRM\Transformers\Location_Transformer;
use HRM\Transformers\Application_Transformer;
use HRM\Transformers\User_Transformer;
use HRM\Models\Recruitment;
    
class Recruitment_Transformer extends TransformerAbstract
{

   	protected $defaultIncludes = [
        'creator', 'updater', 'department', 'designation', 'location'
    ];

    protected $availableIncludes = [
        'applications'
    ];

    public function transform( Recruitment $item ) {
    
        return [
            'id'          => $item->id,
            'position'    => $item->position,
            'description' => $item->description,
            'jobtype'     => $item->jobtype,
            'status'      => $item->status,
            'questions'   => $item->questions,
            'open'        => hrm_get_date( $item->open ),
            'close'       => hrm_get_date( $item->close )
        ];

    }

    public function includeDepartment( Recruitment $item ) {
        $department = $item->department()->first();

        if ( $department ) {
            return $this->item( $department, new Department_Transformer );
        }

        return null;
    }

    public function includeDesignation( Recruitment $item ) {
        $designation = $item->designation()->first();

        if ( $designation ) {
            return $this->item( $designation, new Designation_Transformer );
        }

        return null;
    }

    public function includeLocation( Recruitment $item ) {
        $location = $item->location()->get()->first();

        if ( $location ) {
            return $this->item( $location, new Location_Transformer );
        }

        return null;
    }
    public function includeCreator( Recruitment $item ) {
        $creator = $item->creator;
        return $this->item( $creator, new User_Transformer );
    }

    public function includeUpdater( Recruitment $item ) {
        $updater = $item->updater;

        return $this->item ( $updater, new User_Transformer );
    }

    public function includeApplications( Recruitment $item ) {
        $applications = $item->applications;

        return $this->collection( $applications, new Application_Transformer );
    }

}
