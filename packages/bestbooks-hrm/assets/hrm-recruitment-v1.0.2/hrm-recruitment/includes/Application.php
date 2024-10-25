<?php
namespace HRM\Models;

use HRM\Core\Database\Model as Eloquent;


class Application extends Eloquent {
	protected $primaryKey = 'id';
    protected $table      = 'hrm_applications';
    public $timestamps    = true;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    protected $fillable = [
        'recruitment_id',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'gender',
        'marital_status',
        'date_of_birth',
        'address1' ,
        'address2',
        'city' ,
        'state',
        'zip_code',
        'country' ,
        'profile',
        'mobile',
        'educations',
        'skills',
        'experiences',
        'questions',
        'resume',
    ];

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

    public function setCountryAttribute( $value ) {
        $this->attributes['country'] = serialize( $value );
    }

    public function getCountryAttribute( $value ) {
        return unserialize( $value );
    }

    public function setEducationsAttribute( $value ) {
        $this->attributes['educations'] = serialize( $value );
    }

    public function getEducationsAttribute( $value ) {
        return unserialize( $value );
    }

    public function setSkillsAttribute( $value ) {
        $this->attributes['skills'] = serialize( $value );
    }

    public function getSkillsAttribute( $value ) {
        return unserialize( $value );
    }

    public function setExperiencesAttribute( $value ) {
        $this->attributes['experiences'] = serialize( $value );
    }

    public function getExperiencesAttribute( $value ) {
        return unserialize( $value );
    }

    public function setQuestionsAttribute( $value ) {
        $this->attributes['questions'] = serialize( $value );
    }

    public function getQuestionsAttribute( $value ) {
        return unserialize( $value );
    }

    public function recruitment() {
        return $this->belongsTo( 'HRM\Models\Recruitment', 'recruitment_id');
    }

}

