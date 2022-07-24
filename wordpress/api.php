<?php

/* 
 * When adding new class files in the betsbooks/class/src path, must regenerate the classmap for composer,
 * change to the wp-contents/plugins/bestbooks path
 * 
 * php composer.phar dump-autoload
 * 
 * of if composer installed on windows
 * 
 * composer dump-autoload
 * 
 * @api {get} /employees : This will use to define rest end points.
 * @apiVersion : This will use to define API version.
 * @apiName : This will use to define controller method name that will handle by endpoint.
 * @apiGroup : This will use to define rest api group name.
 * @apiSuccess : This will use to define response varaible name with type.
 * @apiError : This will use to define error response varaible with type.
 * @apiParam /employees : This will use to define parameter for rest api.
 * @apiSampleRequest : This is use to enable tryout feature.
 * 
 */

add_action( 'rest_api_init', 'add_bestbooks_api');

function add_bestbooks_api() {
    register_rest_route('bestbooks/v2', '/version/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_version',
            'permission_callback' => 'bestbooks_api_version',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true)
						)
        )
    );

    register_rest_route('bestbooks/v2', '/settings/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_settings',
            'permission_callback' => 'bestbooks_api_settings',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true)
						)
        )
    );

    register_rest_route('bestbooks/v2', '/chartofaccounts/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_chartofaccounts',
            'permission_callback' => 'bestbooks_api_chartofaccounts',
			'args' => array(
						'user' => array('required' => true),
						'pass' => array('required' => true),
						'name' => array('required' => false),
						'type' => array('required' => false)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/account_types/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_get_acctypes',
            'permission_callback' => 'bestbooks_api_get_acctypes',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/debit/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_debit',
            'permission_callback' => 'bestbooks_api_debit',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true),
							'name' => array('required' => true),
							'date' => array('required' => true),
							'desc' => array('required' => true),
							'amount' => array('required' => true)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/credit/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_credit',
            'permission_callback' => 'bestbooks_api_credit',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true),
							'name' => array('required' => true),
							'date' => array('required' => true),
							'desc' => array('required' => true),
							'amount' => array('required' => true)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/balance/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_balance',
            'permission_callback' => 'bestbooks_api_balance',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true),
							'name' => array('required' => true),
							'balance' => array('required' => false)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/add/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_add',
            'permission_callback' => 'bestbooks_api_add',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true),
							'name' => array('required' => true),
							'date' => array('required' => true),
							'desc' => array('required' => true),
							'amount' => array('required' => true)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/subtract/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_subtract',
            'permission_callback' => 'bestbooks_api_subtract',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true),
							'name' => array('required' => true),
							'date' => array('required' => true),
							'desc' => array('required' => true),
							'amount' => array('required' => true)
						)
        )
    );
    
    register_rest_route('bestbooks/v2', '/headers/',
        array(
            'methods' => array('GET','POST'),
            'callback' => 'bestbooks_api_headers',
            'permission_callback' => 'bestbooks_api_headers',
			'args' => array(
							'user' => array('required' => true),
							'pass' => array('required' => true)
						)
        )
    );
    
    wp_localize_script( 
        'wp-api', 
        'wpApiSettings', 
        array(
            'root' => esc_url_raw( rest_url() ),
            'nonce' => wp_create_nonce( 'wp_rest' )
        ) 
    );
}

/**
 * @api {get} /version Get current BestBooks version
 */
function bestbooks_api_version() {
    return new WP_REST_Response( BESTBOOKS_VERSION, 200 );
}

/**
 * @api {get} /settings Get current settings
 */
function bestbooks_api_settings(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        $bestbooks_customer = get_option("bestbooks_customer");
        if (isset($bestbooks_customer) === false) {
            $bestbooks_customer = "bestbooks_customer";
        }
        $bestbooks_vendor = get_option("bestbooks_vendor");
        if (isset($bestbooks_vendor) === false) {
            $bestbooks_vendor = "bestbooks_vendor";
        }
        $bestbooks_timezone = get_option("bestbooks_timezone");
        if (isset($bestbooks_timezone) === false) {
            $bestbooks_timezone = date_default_timezone_get();
        }

        $results = array(
            'customer' => $bestbooks_customer,
            'vendor' => $bestbooks_vendor,
            'timezone' => $bestbooks_timezone,
        );

        $response = new WP_REST_Response( $results );
    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

/**
 * @api {get} /chartofaccounts Get the current chart of accounts
 */
function bestbooks_api_chartofaccounts(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require_once dirname(__FILE__).'/vendor/autoload.php';

        $results = array();
        $coa = new ChartOfAccounts();
        $results = $coa->getList();
        $response = new WP_REST_Response( $results );
    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

function bestbooks_api_get_acctypes(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require_once dirname(__FILE__).'/vendor/autoload.php';

        $results = array();
        
        $_acctypes = new AccountTypes();
        $results[] = $_acctypes::getConstList();
        
        $response = new WP_REST_Response( $results );
    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;    
}

function bestbooks_api_debit(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require_once dirname(__FILE__).'/vendor/autoload.php';

        $results = array();
        
        if (isset($request['name'])) {
            try {
                $coa = new ChartOfAccounts();
                $coaList = $coa->getList();
                $account = new $coaList[$request['name']]($request['name']);
                if (isset($request['date']) && isset($request['desc']) && isset($request['amount'])) {
                    $results = $account->addDebit($request['date'],$request['desc'],$request['amount']);
                } else {
                    $results = $account->getDebit();
                }
            } catch (Exception $ex) {
                $results = $ex;
            }
        } else {
            $results = new BestBooksException('missing account name');
        }
        
        $response = new WP_REST_Response( $results );

    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

function bestbooks_api_credit(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require dirname(__FILE__).'/vendor/autoload.php';
        $results = array();
        
        if (isset($request['name'])) {
            try {
                $coa = new ChartOfAccounts();
                $coaList = $coa->getList();
                $account = new $coaList[$request['name']]($request['name']);
                if (isset($request['date']) && isset($request['desc']) && isset($request['amount'])) {
                    $results = $account->addCredit($request['date'],$request['desc'],$request['amount']);
                } else {
                    $results = $account->getCredit();
                }
            } catch (Exception $ex) {
                $results = $ex;
            }
        } else {
            $results = new BestBooksException('missing account name');
        }

        $response = new WP_REST_Response( $results );

    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

function bestbooks_api_balance(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require_once dirname(__FILE__).'/vendor/autoload.php';
        $results = array();
        
        if (isset($request['name'])) {
            try {
                $coa = new ChartOfAccounts();
                $coaList = $coa->getList();
                $account = new $coaList[$request['name']]($request['name']);
                if (isset($request['balance'])) {
                    $results = $account->setBalance($request['balance']);
                } else {
                    $results = $account->getBalance();
					if (is_null($result) || empty($result)) {
						$result = 0.00;
					}
                }
            } catch (Exception $ex) {
                $results = $ex;
            }
        } else {
            $results = new BestBooksException('missing account name');
        }

        $response = new WP_REST_Response( $results );

    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}
/**
 * Asset & Expense INCREASE on debit
 * Libaility, Equity & Revenue INCREASE on credit
 */
function bestbooks_api_add(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require_once dirname(__FILE__).'/vendor/autoload.php';
        $results = array();
        
        if (isset($request['name'])) {
            if (isset($request['date']) && isset($request['desc']) && isset($request['amount'])) {
                $coa = new ChartOfAccounts();
                $coaList = $coa->getList();
                $account = new $coaList[$request['name']]($request['name']);
                $results = $account->increase($request['date'],$request['desc'],$request['amount']);
            } else {
                $results = new BestBooksException('missing parameters');
            }
        } else {
            $results = new BestBooksException('missing account name');
        }
        
        $response = new WP_REST_Response( $results );

    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

/**
 * Asset & Expense DECREASE on credit
 * Libaility, Equity & Revenue DECREASE on debit
 */
function bestbooks_api_subtract(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        require_once dirname(__FILE__).'/vendor/autoload.php';
        $results = array();
        
        if (isset($request['name'])) {
            if (isset($request['date']) && isset($request['desc']) && isset($request['amount'])) {
                $coa = new ChartOfAccounts();
                $coaList = $coa->getList();
                $account = new $coaList[$request['name']]($request['name']);
                $results = $account->decrease($request['date'],$request['desc'],$request['amount']);
            } else {
                $results = new BestBooksException('missing parameters');
            }
        } else {
            $results = new BestBooksException('missing account name');
        }
        
        $response = new WP_REST_Response( $results );

    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

function bestbooks_api_headers(WP_REST_Request $request) {
    if (($error = bestbooks_authenticate($request)) === true) {
        $results = array(__FILE__=>__METHOD__);
    
        $results[] = apache_request_headers();
        $results[] = $request['user'];
        
        $response = new WP_REST_Response( $results );

    } else {
        $response = new WP_REST_Response($error->get_error_message());
    }
    return $response;
}

function bestbooks_authenticate($request) {
    if (isset($request['user']) && isset($request['pass'])) {
        $user = $request['user'];
        $pass = $request['pass'];

        $result = wp_authenticate_username_password(NULL, $user, $pass);

        if ($result instanceof WP_Error) {
            return $result;
        }
    } else {
        $result = new WP_Error('401', 'Only authroized users can access this API');
        return $result;
    }
    return true;
}

/**
 * From: https://www.wp-tweaks.com/hackers-can-find-your-wordpress-username/
 * To prevent Hackers from knowing your user name.
 */
function bestbooks_disable_rest_endpoints ( $endpoints ) {
    if ( isset( $endpoints['/wp/v2/users'] ) ) {
        unset( $endpoints['/wp/v2/users'] );
    }
    if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    return $endpoints;
}
add_filter( 'rest_endpoints', 'bestbooks_disable_rest_endpoints');
?>