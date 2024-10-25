<?php
use HRM\Core\Common\Traits\Transformer_Manager;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use HRM\Models\Loan;
use HRM\Transformers\Loan_Transformer;
use HRM\Models\Payment;
use Illuminate\Pagination\Paginator;

class HRM_Action {
	use Transformer_Manager;
	
	private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

	function __construct() {
		add_action( 'wp_ajax_hrm_check_employee_loan_status', array( $this, 'ajax_get_loan' ) );
        add_action( 'wp_ajax_hrm_loan_filter', array( $this, 'ajax_get_loan' ) );
        add_filter( 'hrm_before_salary_generator', array( $this, 'salary_generator' ), 10, 2 );
        add_filter( 'hrm_group_salary_generator', array( $this, 'group_salary_generator' ) );
        add_filter( 'hrm_after_create_salary', array( $this, 'after_create_salary' ), 10, 2 );
        add_action( 'hrm_after_delete_salary', array( $this, 'after_delete_salary' ) );
        add_action( 'hrm_before_update_salary', array( $this, 'before_update_salary' ), 10, 2 );
	}

    function before_update_salary( $update_data, $salary ) {
        $payment = Payment::where('type_id', $salary->id)->get()->toArray();
        $loan = 0;
        
        if ( $payment ) {
            $loan = wp_list_pluck( $payment, 'amount' );
            $loan = array_sum( $loan );
        }

        $info = maybe_unserialize( $update_data['info'] );
        
        if ( $loan > 0 ) {
            $info['data'][] = array(
                'name'        => 'loan',
                'description' => 'Loan',
                'type'        => 'deduction',
                'amount'      => $loan
            );
        }
        
        $update_data['info'] = maybe_serialize( $info );

        return $update_data;
    }

    function after_delete_salary( $postdata ) {
        $ids = $postdata['delete'];
        foreach ( $ids as $key => $id) {
            $payment = Payment::where( 'type_id', $id );

            if ( $payment ) {
                $payment->delete();
            }
        }
    }

    function after_create_salary( $salary, $record ) {

        $args = array(
            'deduct_date' => date( 'Y-m-d', strtotime( $salary['month'] ) ),
            'employee_id' => $salary['employee_id'],
            'status'      => 2
        );
       
        $loans = $this->get_loan($args);
        
        foreach ( $loans['data'] as $key => $loan) {
            $loan_amount = $this->calculate_single_loan( $loan );
            
            $_POST['class']        = 'Payment';
            $_POST['method']       = 'create';
            $_POST['transformers'] = 'Payment_Transformer';
            $_POST['loan_id']      = $loan['id'];
            $_POST['status']       = 1;
            $_POST['amount']       = $this->calculate_single_loan( $loan );
            $_POST['type_id']      = $record->id;
            $_POST['created_by']   = get_current_user_id();
            $_POST['updated_by']   = get_current_user_id();
            
            if ( $loan_amount > 0 ) {
                hrm_insert_records();  
            }
        }
    }

    function group_salary_generator( $formulas ) {
        $info = maybe_unserialize( $formulas['info'] );

        $args = array(
            'deduct_date' => date( 'Y-m-d', strtotime( $formulas['month'] ) ),
            'employee_id' => $formulas['employee_id'],
            'status'      => 2
        );
       
        $loans = $this->get_loan($args);
        $loan = $this->loan_calculate( $loans['data'] );

        if ( $loan > 0 ) {
            $info['data'][] = array(
                'name'        => 'loan',
                'description' => 'Loan',
                'type'        => 'deduction',
                'amount'      => $loan
            );
        }
        
        $formulas['info'] = maybe_serialize( $info );
        
        return $formulas;
    }

    function salary_generator( $formulas, $postdata ) {

        $type = $postdata['category'] == 'employee' ? 'employee' : 'group'; 
        $type_id = $postdata['category_id'];
        $is_update = $postdata['isUpdate'] == 'true' ? true : false;
        $salary_id = $postdata['salary_id'];

        if( $type == 'employee' ) {
            
            $args = array(
                'deduct_date' => date( 'Y-m-d', strtotime( $postdata['month'] ) ),
                'employee_id' => $type_id,
                'status'      => 2
            );
            
            if( $is_update ) {
                $loan = $this->get_employee_salary_lone( $salary_id );
            } else {
                $loans = $this->get_loan($args);
                $loan = $this->loan_calculate( $loans['data'] );
            }
            
            if ( $loan > 0 ) {
                $formulas['data'][] = array(
                    'name'        => 'loan',
                    'description' => 'Loan',
                    'type'        => 'deduction',
                    'amount'      => $loan
                ); 
            }
        }
        
        return $formulas;
    }

    function get_employee_salary_lone( $salary_id ) {
        $payment = Payment::where( 'type_id', $salary_id )->get()->first();

        if ( $payment ) {
            return $payment->amount;
        }

        return 0;
    }

    function loan_calculate( $loans ) {
       
        $deduct = 0;
        foreach ( $loans as $key => $loan ) {
            $total_payment = wp_list_pluck( $loan['payment']['data'], 'amount' );
            $total_payment = array_sum( $total_payment );

            if ( $loan['amount'] <= $total_payment ) {
                break;
            }

            $extra = $total_payment + $loan['monthly_installment'];

            if ( $loan['amount'] < $extra ) {
                $net_pay = $extra - $loan['amount'];
                $net_pay = $loan['monthly_installment'] - $net_pay;
                $deduct  = $deduct + $net_pay;
            } else {
                $deduct  = $deduct + $loan['monthly_installment'];
            }

        }
        
        return $deduct;
    }

    function calculate_single_loan( $loan ) {
        
        $deduct = 0;
        $total_payment = wp_list_pluck( $loan['payment']['data'], 'amount' );
        
        $total_payment = array_sum( $total_payment );

        if ( $loan['amount'] <= $total_payment ) {
            return 0;
        }

        $extra = $total_payment + $loan['monthly_installment'];

        if ( $loan['amount'] < $extra ) {
            $net_pay = $extra - $loan['amount'];
            $net_pay = $loan['monthly_installment'] - $net_pay;
            $deduct  = $deduct + $net_pay;
        } else {
            $deduct  = $deduct + $loan['monthly_installment'];
        }

        return $deduct;
    }

	function ajax_get_loan() {
		check_ajax_referer('hrm_nonce');
        $salary = self::getInstance()->get_loan( $_POST );

        wp_send_json_success( $salary );
	}

	function get_loan( $postData ) {
        $parent      = empty( $postData['parent'] ) ? false : $postData['parent'];
        $status      = empty( $postData['status'] ) ? false : $postData['status'];
        $employee_id = empty( $postData['employee_id'] ) ? get_current_user_id() : $postData['employee_id'];
        $page        = empty( $postData['page'] ) ? 1 : intval( $postData['page'] );
        $from        = empty( $postData['start_date'] ) ? '' : $postData['start_date'];
        $to          = empty( $postData['end_date'] ) ? '' : $postData['end_date'];
        $deduct_date = empty( $postData['deduct_date'] ) ? '' : $postData['deduct_date'];
        $per_page    = hrm_per_page();

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });
        
		$loan = Loan::where( function($q) use( $employee_id, $parent, $status, $from, $to, $deduct_date ) {
            if ( ! empty(  $employee_id ) ) {
                $q->where( 'employee_id', $employee_id );
            }

            if ( ! empty(  $parent ) ) {
                $q->where( 'parent', $parent );
            }

            if ( ! empty(  $status ) ) {
                $q->where( 'status', $status );
            }

            if ( ! empty( $from ) ) {
                $from = date( 'Y-m-d', strtotime( $from ) );
                $q->where( 'loan_date', '>=', $from);
            }

            if ( ! empty( $to ) ) {
                $to = date( 'Y-m-d', strtotime( $to ) );
                $q->where( 'loan_date', '<=', $to);
            }

            if ( ! empty( $deduct_date ) ) {
                $deduct_date = date( 'Y-m-d', strtotime( $deduct_date ) );
                $q->where( 'deduct_date', '<=', $deduct_date);
            }
        })
        ->orderBy( 'id', 'DESC' )
        ->paginate( $per_page );

        $collection = $loan->getCollection();

        $resource = new Collection( $collection, new Loan_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $loan ) );

        return $this->get_response( $resource );
	}
}

new HRM_Action();