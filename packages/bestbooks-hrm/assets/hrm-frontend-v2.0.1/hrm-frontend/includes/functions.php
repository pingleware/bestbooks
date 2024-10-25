<?php

/**
 * Get other templates (e.g. product attributes) passing attributes and including the file.
 *
 * @access public
 * @param string $template_name
 * @param array $args (default: array())
 * @param string $template_path (default: '')
 * @param string $default_path (default: '')
 */
function hrm_get_template( $template_name, $args = array(), $template_path = '', $default_path = '' ) {
    if ( ! empty( $args ) && is_array( $args ) ) {
        extract( $args );
    }

    $located = hrm_locate_template( $template_name, $template_path, $default_path );

    if ( ! file_exists( $located ) ) {
        //_doing_it_wrong( __FUNCTION__, sprintf( '<code>%s</code> does not exist.', $located ), '0.1' );
        //return;
    }

    // Allow 3rd party plugin filter template file from their plugin.
    $located = apply_filters( 'hrm_get_template', $located, $template_name, $args, $template_path, $default_path );

    do_action( 'hrm_before_template_part', $template_name, $template_path, $located, $args );

    include( $located );

    do_action( 'hrm_after_template_part', $template_name, $template_path, $located, $args );
}

/**
 * Locate a template and return the path for inclusion.
 *
 * This is the load order:
 *
 *      yourtheme       /   $template_path  /   $template_name
 *      yourtheme       /   $template_name
 *      $default_path   /   $template_name
 *
 * @access public
 * @param string $template_name
 * @param string $template_path (default: '')
 * @param string $default_path (default: '')
 * @return string
 */
function hrm_locate_template( $template_name, $template_path = '', $default_path = '' ) {
    if ( ! $template_path ) {
        $template_path = hrm_frontend_template_path();
    }

    if ( ! $default_path ) {
        $default_path = HRM_FRONTEND_PATH . '/templates/';
    }

    // Look within passed path within the theme - this is priority.
    $template = locate_template(
        array(
            trailingslashit( $template_path ) . $template_name,
            $template_name
        )
    );

    // Get default template/
    if ( ! $template  ) {
        $template = $default_path . $template_name;
    }

    // Return what we found.
    return apply_filters( 'hrm_locate_template', $template, $template_name, $template_path );
}

/**
 * Get the template path.
 * @return string
 */
function hrm_frontend_template_path() {
    return apply_filters( 'hrm_template_path', 'hrm/' );
}

/**
 * Create a page and store the ID in an option.
 *
 * @param string $slug 
 * @param string $option 
 * @param string $page_title 
 * @param string $page_content 
 * @param int $post_parent (default: 0) Parent for the new page
 *
 * @since  0.1
 * 
 * @return int page ID
 */
function hrm_frontend_create_page( $slug, $option = '', $page_title = '', $page_content = '', $post_parent = 0 ) {
    global $wpdb;

    $option_value = get_option( $option );

    if ( $option_value > 0 ) {
        $page_object = get_post( $option_value );
        
        if ( $page_object && 'page' === $page_object->post_type && ! in_array( $page_object->post_status, array( 'pending', 'trash', 'future', 'auto-draft' ) ) ) {
            // Valid page is already in place
            return $page_object->ID;
        }
    }
    
    if ( strlen( $page_content ) > 0 ) {
        // Search for an existing page with the specified page content (typically a shortcode)
        $valid_page_found = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status NOT IN ( 'pending', 'trash', 'future', 'auto-draft' ) AND post_content LIKE %s LIMIT 1;", "%{$page_content}%" ) );
    } else {
        // Search for an existing page with the specified page slug
        $valid_page_found = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status NOT IN ( 'pending', 'trash', 'future', 'auto-draft' )  AND post_name = %s LIMIT 1;", $slug ) );
    }

    if ( $valid_page_found ) {
        if ( $option ) {
            update_option( $option, $valid_page_found );
        }

        return $valid_page_found;
    }

    // Search for a matching valid trashed page
    if ( strlen( $page_content ) > 0 ) {
        // Search for an existing page with the specified page content (typically a shortcode)
        $trashed_page_found = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status = 'trash' AND post_content LIKE %s LIMIT 1;", "%{$page_content}%" ) );
    } else {
        // Search for an existing page with the specified page slug
        $trashed_page_found = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status = 'trash' AND post_name = %s LIMIT 1;", $slug ) );
    }

    if ( $trashed_page_found ) {
        $page_id   = $trashed_page_found;
        $page_data = array(
            'ID'             => $page_id,
            'post_status'    => 'publish',
        );
        
        wp_update_post( $page_data );
    
    } else {
        $page_data = array(
            'post_status'    => 'publish',
            'post_type'      => 'page',
            'post_author'    => 1,
            'post_name'      => $slug,
            'post_title'     => $page_title,
            'post_content'   => $page_content,
            'post_parent'    => $post_parent,
            'comment_status' => 'closed'
        );
        
        $page_id = wp_insert_post( $page_data );
    }

    if ( $option ) {

        update_option( $option, $page_id );
    }

    return $page_id;
}

function hrm_profile_page_id() {
    return 'wpSpear_hrm';
}

function hrm_organization_page_id() {
    return 'hrm_organization_page_id';
}

function hrm_employee_page_id() {
    return 'hrm_employee_page_id';
}

function hrm_departments_page_id() {
    return 'hrm_departments_page_id';
}

function hrm_attendance_page_id() {
    return 'hrm_attendance_page_id';
}

function hrm_leave_page_id() {
    return 'hrm_leave_page_id';
}


function hrm_frontend_pages() {
    return apply_filters( 'hrm_frontend_page', array(
        array(
            'name'    => 'hrm',
            'title'   => 'HRM',
            'content' => '[wpSpear_hrm]',
            'option'  => hrm_profile_page_id()
        ),
        // array(
        //     'name'    => 'organization',
        //     'title'   => 'Organization',
        //     'content' => '[hrm_organization]',
        //     'option'  => hrm_organization_page_id()
        // ),
        // array(
        //     'name'    => 'employee',
        //     'title'   => 'Employee',
        //     'content' => '[hrm_employee]',
        //     'option'  => hrm_employee_page_id()
        // ),
        // array(
        //     'name'    => 'departments',
        //     'title'   => 'Departments',
        //     'content' => '[hrm_department]',
        //     'option'  => hrm_departments_page_id()
        // ),
        // array(
        //     'name'    => 'attendance',
        //     'title'   => 'Attendance',
        //     'content' => '[hrm_attendance]',
        //     'option'  => hrm_attendance_page_id()
        // ),
        // array(
        //     'name'    => 'leave',
        //     'title'   => 'Leave',
        //     'content' => '[hrm_leave]',
        //     'option'  => hrm_leave_page_id()
        // ),
    ));
}
