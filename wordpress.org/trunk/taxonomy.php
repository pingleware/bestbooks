<?php
/**
 * Extra Fields for bestbooks_payment_method taxonomy
 */
if (!function_exists('bestbooks_payment_method_add_form_fields')) {
    function bestbooks_payment_method_add_form_fields($taxonomy) {
        $external_function = apply_filters('bestbooks_external_payment_methods','');
        $_external_functions = "";
        if (is_array($external_function)) {
            foreach($external_function as $function) {
                $_external_functions .= '<option value="'.$function.'"/>';
            }
        }
        echo '<div class="form-field">
        <label for="bestbooks-action-hook">BestBooks Action Hook</label>
        <input type="text" name="bestbooks-action-hook" id="bestbooks-action-hook" list="bestbooks_action_hooks" />
        <p>Choose a BestBook Action Hook? <i>(Choose a built-in payment hook from the list, or create your own by using the bestbooks_external_payment_methods filter and provide the name in this field?)</i></p>
        <datalist id="bestbooks_action_hooks">
        <option value="bestbooks_payexpensebycash"/>
        <option value="bestbooks_payexpensebycheck"/>
        <option value="bestbooks_payexpensebycard"/>
        '.$_external_functions.'
        </datalist>
        </div>';
    }    

    add_action('bestbooks_payment_method_add_form_fields','bestbooks_payment_method_add_form_fields');
}

if (!function_exists('bestbooks_payment_method_edit_term_fields')) {
    function bestbooks_payment_method_edit_term_fields( $term, $taxonomy ) {
        $value = get_term_meta( $term->term_id, 'bestbooks-action-hook', true );
        $external_function = apply_filters('bestbooks_external_payment_methods','');
        $_external_functions = "";
        if (is_array($external_function)) {
            foreach($external_function as $function) {
                $_external_functions .= '<option value="'.$function.'"/>';
            }
        }
        echo '<tr class="form-field">
        <th>
            <label for="bestbooks-action-hook">BestBooks Action Hook</label>
        </th>
        <td>
            <input name="bestbooks-action-hook" id="bestbooks-action-hook" type="text" value="' . esc_attr( $value ) .'"  list="bestbooks_action_hooks" />
            <p class="description">Choose a BestBook Action Hook? <i>(Choose a built-in payment hook from the list, or create your own by using the bestbooks_external_payment_methods filter and provide the name in this field?)</i></p>
            <datalist id="bestbooks_action_hooks">
                <option value="bestbooks_payexpensebycash"/>
                <option value="bestbooks_payexpensebycheck"/>
                <option value="bestbooks_payexpensebycard"/>
                '.$_external_functions.'
            </datalist>
        </td>
        </tr>';
    }
    
    add_action( 'bestbooks_payment_method_edit_form_fields', 'bestbooks_payment_method_edit_term_fields', 10, 2 );    
}

if (!function_exists('bestbooks_payment_method_save_term_fields')) {
    function bestbooks_payment_method_save_term_fields( $term_id ) {
        update_term_meta(
            $term_id,
            'bestbooks-action-hook',
            sanitize_text_field($_POST['bestbooks-action-hook'])
        );
    }
    
    add_action( 'created_bestbooks_payment_method', 'bestbooks_payment_method_save_term_fields' );
    add_action( 'edited_bestbooks_payment_method', 'bestbooks_payment_method_save_term_fields' );    
}

if (!function_exists('bestbooks_payment_method_custom_post_column')) {
    function bestbooks_payment_method_custom_post_column($columns) {
        unset($columns['posts']);
        unset($columns['slug']);
        $columns['bestbooks-action-hook'] = 'BestBooks Action Hook';
        return $columns;
    }
    
    add_filter( 'manage_edit-bestbooks_payment_method_columns', 'bestbooks_payment_method_custom_post_column');    
}

if (!function_exists('bestbooks_payment_method_add_column_content')) {
    function bestbooks_payment_method_add_column_content($content,$column_name,$term_id){
        $term= get_term($term_id,'bestbooks_payment_method');
        switch ($column_name) {
            case 'bestbooks-action-hook':
                //do your stuff here with $term or $term_id
                $content = get_term_meta( $term_id, 'bestbooks-action-hook', true );
                break;
            default:
                break;
        }
        return $content;
    }

    add_filter('manage_bestbooks_payment_method_custom_column', 'bestbooks_payment_method_add_column_content',10,3);        
}

/**
 * Extra fields for bestbooks_state
 */
if (!function_exists('bestbooks_taxjurisdiction_add_form_fields')) {
    function bestbooks_taxjurisdiction_add_form_fields($taxonomy) {
        ?>
        <div class="form-field">
            <label for="bestbooks-state-taxrate">Tax Rate</label>
            <input type="number" step="any" name="bestbooks-state-taxrate" id="bestbooks-state-taxrate" />
            <label for="bestbooks-tax-url">Tax Jurisdiction URL</label>
            <input type="url" name="bestbooks-tax-url" id="bestbooks-tax-url" />
            <label for="duedate">Next Tax Payment Due Date</label>
            <input type="date" name="bestbooks-tax-duedate" id="bestbooks-tax-duedate" />
        </div>
        <?php
    }    

    add_action('bestbooks_taxjurisdiction_add_form_fields','bestbooks_taxjurisdiction_add_form_fields');
}

if (!function_exists('bestbooks_taxjurisdiction_edit_term_fields')) {
    function bestbooks_taxjurisdiction_edit_term_fields( $term, $taxonomy ) {
        $taxrate = get_term_meta( $term->term_id, 'bestbooks-state-taxrate', true );
        $taxurl = get_term_meta( $term->term_id, 'bestbooks-tax-url', true);
        $duedate = get_term_meta( $term->term_id, 'bestbooks-tax-duedate', true);
        ?>
        <tr class="form-field">
            <th>
                <label for="bestbooks-action-hook">Tax Rate</label>
            </th>
            <td>
                <input type="number" step="any" name="bestbooks-state-taxrate" id="bestbooks-state-taxrate" value="<?php echo esc_attr($taxrate); ?>" />
            </td>
        </tr>
        <tr class="form-field">
            <th><label for="bestbooks-tax-url">Tax Jurisdiction URL</label></th>
            <td><input type="url" name="bestbooks-tax-url" id="bestbooks-tax-url" value="<?php echo $taxurl; ?>" /></td>
        </tr>
        <tr class="form-field">
            <td><label for="bestbooks-tax-duedate">Next Tax Payment Due Date</label></td>
            <td><input type="date" name="bestbooks-tax-duedate" id="bestbooks-tax-duedate" value="<?php echo $duedate; ?>" /></td>
        </tr>
        <?php
    }
    
    add_action( 'bestbooks_taxjurisdiction_edit_form_fields', 'bestbooks_taxjurisdiction_edit_term_fields', 10, 2 );    
}

if (!function_exists('bestbooks_taxjurisdiction_save_term_fields')) {
    function bestbooks_taxjurisdiction_save_term_fields( $term_id ) {
        update_term_meta(
            $term_id,
            'bestbooks-state-taxrate',
            sanitize_text_field($_POST['bestbooks-state-taxrate'])
        );
        update_term_meta(
            $term_id,
            'bestbooks-tax-url',
            sanitize_text_field($_POST['bestbooks-tax-url'])
        );
        update_term_meta(
            $term_id,
            'bestbooks-tax-duedate',
            sanitize_text_field($_POST['bestbooks-tax-duedate'])
        );
    }
    
    add_action( 'created_bestbooks_taxjurisdiction', 'bestbooks_taxjurisdiction_save_term_fields' );
    add_action( 'edited_bestbooks_taxjurisdiction', 'bestbooks_taxjurisdiction_save_term_fields' );    
}

if (!function_exists('bestbooks_taxjurisdiction_custom_post_column')) {
    function bestbooks_taxjurisdiction_custom_post_column($columns) {
        unset($columns['posts']);
        unset($columns['slug']);
        $columns['bestbooks-state-taxrate'] = 'Tax Rate';
        $columns['bestbooks-tax-url'] = 'Tax URL';
        $columns['bestbooks-tax-duedate'] = 'Next Tax Payment Date';
        return $columns;
    }
    
    add_filter( 'manage_edit-bestbooks_taxjurisdiction_columns', 'bestbooks_taxjurisdiction_custom_post_column');    
}

if (!function_exists('bestbooks_taxjurisdiction_add_column_content')) {
    function bestbooks_taxjurisdiction_add_column_content($content,$column_name,$term_id){
        $term= get_term($term_id,'bestbooks_taxjurisdiction');
        switch ($column_name) {
            case 'bestbooks-state-taxrate':
                //do your stuff here with $term or $term_id
                $content = get_term_meta( $term_id, 'bestbooks-state-taxrate', true );
                break;
            case 'bestbooks-tax-url':
                $content = '<a href="'.get_term_meta( $term_id, 'bestbooks-tax-url', true).'" target="_blank">'.get_term_meta( $term_id, 'bestbooks-tax-url', true).'</a>';
                break;
            case 'bestbooks-tax-duedate':
                $content = get_term_meta( $term_id, 'bestbooks-tax-duedate', true);
                break;
            default:
                break;
        }
        return $content;
    }

    add_filter('manage_bestbooks_taxjurisdiction_custom_column', 'bestbooks_taxjurisdiction_add_column_content',10,3);        
}

?>