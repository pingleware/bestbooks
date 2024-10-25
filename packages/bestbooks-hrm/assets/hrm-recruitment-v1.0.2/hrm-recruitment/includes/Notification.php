<?php 

/**
 * Notification
 */
class HRMR_Notification extends HRM_Email
{
	private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
	
	function applicant_email ($to, $data) {

		$template = apply_filters( 'hrmr_applicant_email_template', HRM_RECRUITMRNT_PATH . '/views/emails/applicant_email.php' );
		$subject = __( 'Your Application is recieved', 'hrmr' );
		$data['subject'] = $subject;

		$message = $this->get_content_html($template, $data);
		$this->send( $to, $subject, $message);
	}

	function custom_email ($to, $subject, $message) {
		$template = apply_filters( 'hrmr_custom_email_template', HRM_RECRUITMRNT_PATH . '/views/emails/custom_email.php' );
		
		$messages = $this->get_content_html($template, ['message' => $message, 'subject' => $subject ]);
		return $this->send( $to, $subject, $messages);
	}
}