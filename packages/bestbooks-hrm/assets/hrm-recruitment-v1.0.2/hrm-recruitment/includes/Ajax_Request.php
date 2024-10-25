<?php

/**
* 
*/
use HRM\Core\Common\Traits\Transformer_Manager;
use HRM\Models\Recruitment;
use HRM\Models\Application;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use HRM\Transformers\Recruitment_Transformer;
use HRM\Transformers\Application_Transformer;
use Illuminate\Pagination\Paginator;
use HRM\Core\File_System\File_System;

class Ajax_Request
{
	use Transformer_Manager;
	function __construct() {
		add_action( 'wp_ajax_hrm_recruitment_filter', array( $this, 'hrm_recruitment_filter' ) );
		add_action( 'wp_ajax_nopriv_hrm_recruitment_filter', array( $this, 'hrm_recruitment_filter' ) );
		add_action( 'wp_ajax_hrmr_add_application', array( $this, 'hrmr_add_application' ) );
		add_action( 'wp_ajax_nopriv_hrmr_add_application', array( $this, 'hrmr_add_application' ) );
		add_action( 'wp_ajax_hrm_add_as_employee', array( $this, 'add_as_employee' ) );
		add_action( 'wp_ajax_hrm_recruitment_single_record', array( $this, 'hrm_recruitment_single_record' ) );
		add_action( 'after_hrm_applications_create', array($this, 'send_applicant_email'), 10, 2);
		add_filter( 'wp_ajax_hrm_send_applicant_mail', array($this, 'hrm_send_applicant_mail'));
		add_filter( 'wp_ajax_hrm_recruitment_settings', array($this, 'recruitment_settings'));
		add_filter( 'wp_ajax_hrmr_get_wp_pages', array($this, 'hrmr_get_wp_pages'));
		add_filter( 'before_hrm_recruitment_get', array( $this, 'recruitment_filter_get'), 10, 2);
	}
	public function hrm_recruitment_filter() {
		$postdata = $_POST;

		$page     = empty( $postdata['page'] ) ? 1 : intval( $postdata['page'] );
		$per_page = empty( $postdata['per_page'] ) ? hrm_per_page() : $postdata['per_page'];
		$open     = !empty( $postdata['open'] ) ? date( 'Y-m-d', strtotime( $postdata['open'] ) ) : false;
		$close    = !empty( $postdata['close'] )? date( 'Y-m-d', strtotime( $postdata['close'] ) ): false;


		if ( !empty( $postdata['id'] ) ) {
			$data = Recruitment::find( $postdata['id'] );
			if ( !$data ) {
				wp_send_json_error( ['error' => __('Recruitment Not Found')] );
				return;
			}
			$resource = new Item( $data, new Recruitment_Transformer );
			$response = $this->get_response( $resource );
			wp_send_json_success( $response );
			return;
		}

		Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

		$recruitment = Recruitment::orderBy( 'created_at', 'DESC' );
		if ( !empty( $postdata['position'] ) ) {
			$recruitment = $recruitment->where( 'position', 'like', '%'. $postdata['position']  .'%');
		}

		if ( $open && $close ) {
			$recruitment = $recruitment->where(function ($q) use ($open, $close) {
				$q->where('open', '>=', $open)->where('close', '<=', $close);
			});
		} else if ( $open ) {
			$recruitment = $recruitment->whereDate('open', '>=', $open);
		}  else if ( $close ) {
			$recruitment = $recruitment->where('close', '<=', $close);
		}
		$recruitment = apply_filters('before_hrm_recruitment_get', $recruitment, $postdata );
		$recruitment = $recruitment->paginate( $per_page );
		$collection = $recruitment->getCollection();

		$resource = new Collection( $collection, new Recruitment_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $recruitment ) );

		$response = $this->get_response( $resource );

		wp_send_json_success( $response );
	}

	function hrmr_add_application () {
		$postdata       = $_POST;
		$recruitment_id = $postdata['recruitment_id'];
		$email          = $postdata['email'];
		
		$app = Application::where('recruitment_id', $recruitment_id)->where('email', $email)->first();

		if ($app) {
			wp_send_json_error( ['error' => __( 'You have already applied on this recruitment', 'hrmr' ) ] );
			return;
		}

		$files = isset( $postdata['resume'])? $postdata['resume']: [] ;
		$postdata['resume'] = null;
		if (is_array($files)) {
			foreach ( $files as $meta_name => $filesObj) {
				$file_ids = File_System::upload_base64_file( $filesObj );
			}
	
			if ( isset( $file_ids ) ) {
				$postdata['resume'] = $file_ids;
			}
		}
		

        $profile = isset( $postdata['profile'] )? $postdata['profile']: [];
		$postdata['profile'] = null;

		if ( is_array($profile) ) {
			foreach ( $profile as $meta_name => $filesObj) {
				$file_ids = File_System::upload_base64_file( $filesObj );
			}
	
			if ( isset( $file_ids ) ) {
				$postdata['profile'] = $file_ids;
			}
		}
		

		$application = Application::create($postdata);
		do_action('after_hrm_applications_create', $application, $postdata);

		$resource = new Item( $application, new Application_Transformer );
		$response = $this->get_response( $resource );
		$response['message'] = __("Your application successfully submited", 'hrmr' );
		wp_send_json_success(  $response );
	}

	function hrm_recruitment_single_record () {
		$postdata = $_POST;
		$id = empty( $postdata['id'] ) ? 0 : intval( $postdata['id'] );

		if ( !$id ) {
			wp_send_json_error( ['error' => __("Require a recruitment id.") ] );
			return;
		}

		$recruitment = Recruitment::find($id);
		$resource = New Item( $recruitment, (new Recruitment_Transformer)->setDefaultIncludes(['creator', 'updater', 'department', 'designation', 'location', 'applications'])  );

		$response = $this->get_response( $resource );

		wp_send_json_success( $response );
	}

	function save_resume_before_save ( $postdata ) {
		$files = $postdata['resume'];
		$postdata['resume'] = null;
		foreach ( $files as $meta_name => $filesObj) {
            
            $file_ids = File_System::upload_base64_file( $filesObj );
        }

        if ( isset( $file_ids ) ) {
			$postdata['resume'] = $file_ids;
        }
        return $postdata;
	}

	public function recruitment_settings() {
		$postdata = $_POST;
		$data = [
			'hide_application' => empty( $postdata['hide_application'] ) ? 0 : $postdata['hide_application'] ,
			'required_login' => empty( $postdata['required_login'] ) ? 0 : $postdata['required_login'] ,
			'page' 			=> empty( $postdata['page'] )? '' : $postdata['page']
		];

		update_option( 'hrm_recruitment_settings', $data );
		wp_send_json_success( [
			'message' => __( 'Udpate settings successfully!', 'hrm' ), 
			'data' => $data
		] );

	}
	public function recruitment_filter_get( $query, $request ) {
		if ( is_admin() ) {
			return $query;
		}
		
		$settings = get_option('hrm_recruitment_settings');
		if ( isset( $settings['hide_application'] ) && intval( $settings['hide_application'] ) ) {
			$today = date( 'Y-m-d', strtotime( current_time('mysql') ) );
			$query = $query->where('close', '>=', $today);
		}
		return $query;
	}

	public function add_as_employee() {
		$postdata = $_POST;
		$id = absint($postdata['application']);
		$application = HRM\Models\Application::with( 
			'recruitment'
		)->find($id)->toArray();
		// return wp_send_json_success ($application);
		if (!$application) {
			wp_send_json_error( [ 'success' => false,'error' => __("Application Info not found.") ] );
			return;
		}

		$employee = [
			'userName' => $this->generate_unique_username(  $application['first_name'],  $application['last_name'],  $application['email'] ),
			'email' => $application['email'],
			'firstName' => $application['first_name'],
			'lastName' => $application['last_name'],
			'role' => 'hrm_employee',
			'department' => $application['recruitment']['department'],
			'designation' =>  $application['recruitment']['designation'],
			'location' => $application['recruitment']['location'],
			'status' => 1,
			'gender' => $application['gender'],
			'mobileNumber' => $application['mobile'],
		];

		$user_id = \Hrm_Employee::getInstance()->add_new_employee( $employee );
		if ( is_wp_error( $user_id ) ) {
            return wp_send_json_error( [ 'success' => false, 'error' => $user_id->get_error_message()  ] );
        }
		$personal = [
			"hrm_gender" => $application['gender'],
			"_marital_status" => $application['marital_status'],
			"_national_code" => $application['country'],
			"_birthday" => $application['date_of_birth'],
			"_street1" => $application['address1'],
			"_street2" => $application['address2'],
			"_city_code" => $application['city'],
			"_state" => $application['state'],
			"_zip" => $application['zip_code'],
			"_work_mobile" => $application['mobile'],
			"_country_code" => $application['country'],
		];
		\Hrm_Employee::getInstance()->save_personal_info( $personal, [], $user_id );

		//add skills
		if ( is_array( $application['skills'] ) ) {
			foreach ( $application['skills'] as $skill ) {
				\HRM\Models\Skill::create( [
					'employee_id' => $user_id,
					'skill' => $skill['title'],
					'years_of_exp' => absint( $skill['year_of_experience'] ),
					'comments' => $skill['comment'],
				] );
			}
		}

		if ( is_array( $application['educations'] ) ) {
			foreach ( $application['educations'] as $education ) {
				\HRM\Models\Education::create( [
					'employee_id' => $user_id,
					'education'   => $education['title'],
					'institute'   => $education['institute'],
					'major'       => $education['major'],
					'year'        => $education['end'],
					'score'       => $education['score'],
					'start_date'  => $education['start'],
					'end_date'    => $education['end']
				] );
			}
		}

		if ( is_array( $application['experiences'] ) ) {
			foreach ( $application['experiences'] as $experience ) {
				\HRM\Models\Work_Experience::create( [
					'employee_id' => $user_id,
					'title'       => $experience['title'],
					'start'       => $experience['from'],
					'end'         => $experience['to'],
					'description' => $experience['description'],
					'created_at'  => date('Y-m-d', strtotime( current_time( 'mysql' ) ) ),
					'updated_at'  => date('Y-m-d', strtotime( current_time( 'mysql' ) ) ),
				] );
			}
		}
		
		wp_send_json_success( [
			'success' => true,
			'message'	=> "successfully added as employee",
		] );
	}

	public function generate_unique_username( $firstName, $lastName, $email ) {

		$firstName = sanitize_user( $firstName );
		$lastName  = sanitize_user( $lastName );
		$email     = sanitize_email( $email );
		$email     = explode('@', $email);
		$email     = $email[0];

		static $i;
		if ( null === $i ) {
			$i = 1;
		} else {
			$i ++;
		}
		if ( ! username_exists( $firstName ) ) {
			return $firstName;
		} else if ( ! username_exists( $lastName ) ) {
			return $lastName;
		} else if ( ! username_exists( $email ) ) {
			return $email;
		} else if ( ! username_exists( $firstName .'_'. $lastName ) ) {
			return $firstName .'_'. $lastName;
		}

		$new_username = sprintf( '%s-%s', $username, $i );
		if ( ! username_exists( $new_username ) ) {
			return $new_username;
		} else {
			return call_user_func( __FUNCTION__, $username );
		}
	}

	function send_applicant_email ( $model, $postdata ) { 
		$personal_info = $model->toArray();
		$to = $personal_info['email'];
		$personal_info['position'] = $model->recruitment->position;

		\HRMR_Notification::getInstance()->applicant_email( $to, $personal_info );

		return $model;
	}

	function hrm_send_applicant_mail () {
		check_ajax_referer('hrm_nonce');

		$subject = esc_attr( $_POST['subject'] );
		$massages = $_POST['massages'];
		$applicant_id = absint($_POST['applicant_id']);
		$recruitment_id = absint($_POST['recruitment_id']);
		$applicant = Application::with('recruitment')->find($applicant_id);
		$apparray = $applicant->toArray();

		if ( empty( $apparray ) ){
			return ;
		}

		$message =  preg_replace_callback('/{(.*?)}/', function( $match ) use( $apparray ) {
			$m = preg_replace("/\s*|(&nbsp;)*/", '', $match[1]);			
			return $apparray[$m];
		},  $massages);

		$send = \HRMR_Notification::getInstance()->custom_email( $apparray['email'], $subject, $message );
		
		if ( $send ) {

			wp_send_json_success([
				"message" => __( "Message Successfully send", 'hrmr' ) 
			]);
		}
		
	}

	function hrmr_get_wp_pages () {
		check_ajax_referer('hrm_nonce');
		global $wpdb;
		$pages = $wpdb->get_results( $wpdb->prepare( "SELECT post_title, ID FROM $wpdb->posts WHERE post_type=%s AND post_status=%s", 'page', 'publish' ), ARRAY_A );

		wp_send_json_success(['data' => $pages]);
	}
}