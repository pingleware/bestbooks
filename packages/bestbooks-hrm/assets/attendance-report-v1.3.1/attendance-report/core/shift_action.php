<?php
use HRM\Core\Common\Traits\Transformer_Manager;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use HRM\Models\Shift;
use HRM\Transformers\Shift_Transformer;
use HRM\Models\Attendance;
use HRM\Transformers\Attendance_Transformer;
use Illuminate\Pagination\Paginator;
use HRM\Models\Relation;
use HRM\Models\Department;


class HRM_Shift_Action {
	use Transformer_Manager;
	
	private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

	function __construct() {
		//add_action( 'wp_ajax_hrm_shift_filter', array( $this, 'ajax_get_shift' ) );
        add_action( 'wp_ajax_hrm_insert_custom_attendance', array( $this, 'ajax_add_shift' ) );
        add_action( 'wp_ajax_hrm_customize_attendance', array( $this, 'ajax_hrm_get_attendance' ) );
       


	}

    function ajax_hrm_get_attendance() {
        check_ajax_referer('hrm_nonce');
        $attendance = self::getInstance()->get_attendance( $_POST );
        
        if ( $attendance ) {
            wp_send_json_success( $attendance );
        }
        
        wp_send_json_error( $attendance );
    }

    function get_attendance( $postdata ) {

        $from        = empty( $postdata['from'] ) ? '' : $postdata['from'];
        $to          = empty( $postdata['to'] ) ? '' : $postdata['to'];
        $employee_id = empty( $postdata['employee_id'] ) ? get_current_user_id() : $postdata['employee_id'];
        $page        = empty( $postdata['page'] ) ? 1 : intval( $postdata['page'] );
        $per_page    = hrm_per_page();

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $experiance = Attendance::where( 'user_id', $employee_id )
            ->where( function($q) use( $from, $to ) {
                if ( ! empty( $from ) ) {
                    $from = date( 'Y-m-d', strtotime( $from ) );
                    $q->where( 'date', '>=', $from);
                }

                if ( ! empty( $to ) ) {
                    $to = date( 'Y-m-d', strtotime( $to ) );
                    $q->where( 'date', '<=', $to);
                }
            }
        )
        ->orderBy( 'id', 'DESC' )
        ->paginate( $per_page );
    
        $collection = $experiance->getCollection();

        $resource = new Collection( $collection, new Attendance_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $experiance ) );

        return $this->get_response( $resource );
    }

    function ajax_add_shift() {
        check_ajax_referer('hrm_nonce');
        $shift = self::getInstance()->add_shift( $_POST );
        
        if ( ! empty( $shift['success'] ) ) {
            wp_send_json_success( $shift );
        }
        
        wp_send_json_error( $shift );
    }

    function add_shift( $postData ) {

        if( !empty($postData['punch_out']) && !empty($postData['punch_in']) ) {
            $_POST['total'] = absint( strtotime( $postData['punch_out'] ) - strtotime( $postData['punch_in'] ) );
        } else {
            $_POST['total'] = 0;
        }

        $store = hrm_insert_records( $postData );
            
        return [
            'success' => true,
            'message' => 'Attendance add successfully',
            'data' => $store['data']
        ];

    }

    function validation( $postData ) {
        global $wpdb;
        $departments = $postData['departments'];

        $time_shift = hrm_tb_prefix() . 'hrm_time_shift';
        $relation_tb = hrm_tb_prefix() . 'hrm_relation';

        $hasDepts = Shift::with([
                'departments'=> function($q) use( $relation_tb, $departments )  {
                        $q->whereIn($relation_tb.'.to', $departments)
                          ->where($relation_tb.'.type', 'time_shift_department');
                    }
            ])
            ->where('status', '1')
            ->get()
            ->toArray();
        
        foreach ( $hasDepts as $key => $hasDept ) {
            if ( count( $hasDept['departments'] ) ) {
                $message = $hasDept['departments'][0]['name'] . ' department already exist in ' . $hasDept['name'];
                return new WP_Error('time', $message );
            }
        }
        
        return true;
    }

	function ajax_get_shift() {

		check_ajax_referer('hrm_nonce');
        $shift = self::getInstance()->get_shift( $_POST );

        wp_send_json_success( $shift );
	}

	function get_shift( $postData ) {
        
        $status      = empty( $postData['status'] ) ? 1 : $postData['status'];
        $per_page    = hrm_per_page();

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });
        
		$shift = Shift::where( function($q) use( $status ) {
            if ( ! empty(  $status ) ) {
                $q->where( 'status', $status );
            }
        })
        ->orderBy( 'id', 'DESC' )
        ->paginate( $per_page );

        $collection = $shift->getCollection();

        $resource = new Collection( $collection, new Shift_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $shift ) );

        return $this->get_response( $resource );
	}
}

new HRM_Shift_Action();