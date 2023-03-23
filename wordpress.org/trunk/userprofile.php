<?php

function bestbooks_user_profile_custom_fields($user)
{
    if ($user->ID == 1 || ($user->roles[0] ==='bestbooks_company')) :
    ?>
    <h3>BestBooks Company Fields</h3>
    <table class="form-table">
        <tr>
            <th>
                <label for="starting_year">Starting Year</label>
            </th>
            <td>
                <input type="number"
                       class="regular-text ltr"
                       id="starting_year"
                       name="starting_year"
                       value="<?php echo esc_attr( get_user_meta( $user->ID, 'starting_year', true ) ) ?>"
                       title="Please use YYYY as the year format."
                       pattern="(19[0-9][0-9]|20[0-9][0-9])"
                       required>
                <p class="description">
                    Please enter the year this company was formed or began operations?
                </p>
            </td>
        </tr>
        <tr>
            <th>
                <label for="profitnon_profit">Profit/Non-Profit</label>
            </th>
            <td>
                <?php
                $type = esc_attr(get_user_meta($user->ID,'profitnon_profit',true));
                $selected = array('selected','');
                if ($type === 'profit') {
                    $selected = array('','selected');
                }
                ?>
                <select class="regular-text ltr" id="profitnon_profit" name="profitnon_profit">
                    <option value="non-profit" <?php echo $selected[0]; ?>>Non-Profit</option>
                    <option value="profit" <?php echo $selected[1]; ?>>Profit</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>
                <label for="tax_exempt">Tax Exempt</label>
            </th>
            <td>
                <?php 
                $checked = "";
                if (get_user_meta($user->ID,'tax_exempt',true) == 1) {
                    $checked = "checked";
                }
                ?>
                <input type="checkbox" class="regular-text ltr" id="tax_exempt" name="tax_exempt" <?php echo $checked; ?> />&nbsp;Yes
            </td>
        </tr>
        <tr>
            <th>
                <label for="fein">FEIN</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="fein" name="fein" value="<?php echo esc_attr(get_user_meta($user->ID,'fein',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="address_1">Address 1</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="address_1" name="address_1" value="<?php echo esc_attr(get_user_meta($user->ID,'address_1',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="address_2">Address 2</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="address_2" name="address_2" value="<?php echo esc_attr(get_user_meta($user->ID,'address_2',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="city">City</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="city" name="city" value="<?php echo esc_attr(get_user_meta($user->ID,'city',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="state">State</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="state" name="state" value="<?php echo esc_attr(get_user_meta($user->ID,'state',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="zip-code">Zip Code</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="zip_code" name="zip_code" value="<?php echo esc_attr(get_user_meta($user->ID,'zip_code',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="country">Country</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="country" name="country" value="<?php echo esc_attr(get_user_meta($user->ID,'country',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="phone">Phone</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="phone" name="phone" value="<?php echo esc_attr(get_user_meta($user->ID,'phone1',true)); ?>" />
            </td>
        </tr>
        <tr>
            <th>
                <label for="fax">FAX</label>
            </th>
            <td>
                <input type="text" class="regular-text ltr" id="fax" name="fax" value="<?php echo esc_attr(get_user_meta($user->ID,'fax',true)); ?>" />
            </td>
        </tr>
    </table>
    <?php
    endif;
}

function bestbooks_user_profile_custom_fields_update($user_id) {
    // check that the current user have the capability to edit the $user_id
    if ( ! current_user_can( 'edit_user', $user_id ) ) {
        return false;
    }

    $user = get_user_by('id', $user_id);
    if (($user->roles[0] ==='bestbooks_company') || $user_id == 1) {
        // create/update user meta for the $user_id
        update_user_meta($user_id,'starting_year',$_POST['starting_year']);
        update_user_meta($user_id,'profitnon_profit',$_POST['profitnon_profit']);
        update_user_meta($user_id,'tax_exempt',isset($_POST['tax_exempt']) ? true : false);
        update_user_meta($user_id,'fein',$_POST['fein']);
        update_user_meta($user_id,'address_1',$_POST['address_1']);
        update_user_meta($user_id,'address_2',$_POST['address_2']);
        update_user_meta($user_id,'city',$_POST['city']);
        update_user_meta($user_id,'state',$_POST['state']);
        update_user_meta($user_id,'zip_code',$_POST['zip_code']);
        update_user_meta($user_id,'country',$_POST['country']);
        update_user_meta($user_id,'phone1',$_POST['phone']);
        update_user_meta($user_id,'fax',$_POST['fax']);
    }
    return true;
}

// Add the field to user's own profile editing screen.
add_action(
    'show_user_profile',
    'bestbooks_user_profile_custom_fields'
);
  
// Add the field to user profile editing screen.
add_action(
    'edit_user_profile',
    'bestbooks_user_profile_custom_fields'
);
  
// Add the save action to user's own profile editing screen update.
add_action(
    'personal_options_update',
    'bestbooks_user_profile_custom_fields_update'
);
  
// Add the save action to user profile editing screen update.
add_action(
    'edit_user_profile_update',
    'bestbooks_user_profile_custom_fields_update'
);
?>