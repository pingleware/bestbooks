<?php
namespace HRM\Models;

use HRM\Core\Database\Model as Eloquent;


class Recruitment extends Eloquent {
	protected $primaryKey = 'id';
    protected $table      = 'hrm_recruitment';
    public $timestamps    = true;
    protected $dates = ['open', 'close'];

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    protected $fillable = [
        'position',
        'description',
        'jobtype',
        'department',
        'designation',
        'location',
        'status',
        'open',
        'close',
        'questions',
        'created_by',
        'updated_by'
    ];

    public static $status = [
        1 => 'open',
        2 => 'closed'
    ];

    public static $jobtype = [
        0 => 'Full Time',
        1 => 'Part Time',
        2 => 'Freelncing',
        3 => 'Internship',
        4 => 'Temporary'
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

    public function getStatusAttribute( $value ) {
        $value = (int) $value;
        if ( array_key_exists( $value, self::$status ) ) {
            return self::$status[(int) $value];
        }

        return self::$status[1];
    }

    public function setStatusAttribute( $value ) {
        $value = strtolower( $value );
        $key   = array_search( $value, self::$status );

        if ( array_key_exists( $value, self::$status ) ) {
            $this->attributes['status'] = $value;
        } else {
            $this->attributes['status'] = $key;
        }
    }

    public function getJobtypeAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$jobtype ) ) {
            return self::$jobtype[(int) $value];
        }

        return self::$jobtype[0];
    }

    public function setJobtypeAttribute( $value ) {
        $key   = array_search( $value, self::$jobtype );

        if ( array_key_exists( $value, self::$jobtype ) ) {
            $this->attributes['jobtype'] = $value;
        } else {
            $this->attributes['jobtype'] = $key;
        }
    }

    public function getQuestionsAttribute( $value ) {
        return unserialize( $value );
    }

    public function setQuestionsAttribute( $value ) {
        $this->attributes['questions'] = serialize( $value );
    }

    public function setOpenAttribute( $date ) {
        $this->attributes['open'] = ( !empty( $date ) ) ? date( 'Y-m-d', strtotime(  $date ) ) : date( 'Y-m-d', time() );
    }

    public function setCloseAttribute( $date ) {
        $this->attributes['close'] = ( !empty( $date ) ) ? date( 'Y-m-d', strtotime(  $date ) ) : null;
    }

    public function department() {
        return $this->belongsTo( 'HRM\Models\Department', 'department');
    }

    public function designation() {
        return $this->belongsTo( 'HRM\Models\Designation', 'designation');
    }

    public function location() {
        return $this->belongsTo( 'HRM\Models\Location', 'location');
    }

    public function applications() {
        return $this->hasMany( 'HRM\Models\Application', 'recruitment_id' );
    }

    public function creator() {
        return $this->belongsTo( 'HRM\Models\User', 'created_by' );
    }

    public function updater() {
        return $this->belongsTo( 'HRM\Models\User', 'updated_by' );
    }

    protected function fireModelEvent($event, $halt = true) {
        $user = wp_get_current_user();

        switch ( $event ) {
            case 'creating':
                    $this->created_by = $user->ID;
                    $this->updated_by = $user->ID;
                break;
            
            case 'updating': 
                    $this->updated_by = $user->ID;
                break;
        }
        //Do not remove this line
        return parent::fireModelEvent($event, $halt);
    }
}

