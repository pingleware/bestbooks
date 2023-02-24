<?php
function bestbooks_dashboard_settings() {
    if (isset($_POST['submit'])) {
        update_option("bestbooks_customer", $_POST['customer-role']);
		update_option("bestbooks_vendor", $_POST['vendor-role']);
		update_option("bestbooks_timezone", $_POST['timezone']);
		update_option("bestbooks_privacy", $_POST['privacy']);
		update_option("bestbooks_active_company", $_POST['active-company']);
		
		ChartOfAccounts::createTable();
		Journal::createTable();
		Ledger::createTable();
		ChartOfAccounts::alterTable();
		Ledger::alterTable();
		Journal::alterTable();
    }
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
	$bestbooks_privacy = get_option('bestbooks_privacy');
	if (isset($bestbooks_privacy) === false) {
		$bestbooks_privacy = "no";
		update_option('bestbooks_privacy',$bestbooks_privacy);
	}
	$active_company = get_option('bestbooks_active_company');
	if (isset($active_company) === false) {
		$active_company = 0;
	}

	$zones = timezone_identifiers_list();
	?>
    <form method="post">
        <div class="wrap">
			<h2>BestBooks<sup>&reg;&trade;</sup> - Settings</h2>
			<table>
				<tr>
					<td><label for="customer-role">Customer Role</label></td>
					<td>
						<select name="customer-role" id="customer-role">
							<option value="">Select</option>
							<?php wp_dropdown_roles($bestbooks_customer); ?>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="vendor-role">Vendor Role</label></td>
					<td>
						<select name="vendor-role" id="vendor-role">
							<option value="">Select</option>
							<?php wp_dropdown_roles($bestbooks_vendor); ?>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="timezone">Current Timezone</label></td>
					<td><input type="text" id="timezone" name="timezone" value="<?php echo $bestbooks_timezone; ?>" readonly /></td>
				</tr>
				<tr>
					<td><label for="timezones">Change Time Zone</label></td>
					<td>
						<select name="timezone" id="timezone">
						<option value="">Select</option>
						<?php
							foreach ($zones as $k => $zone) {
								$selected = '';
								if ($zone == $bestbooks_timezone) {
									$selected = 'selected';
								}
								echo '<option value="'.$zone.'" '.$selected.'>'.$zone.'</option>';
							}
						?>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="privacy">Enable Privacy Settings</label></td>
					<td>
						<select class="w3-input w3-block" name="privacy" id="privacy">
							<option value="no" <?php echo ($bestbooks_privacy === "no" ? "selected" : ""); ?>>No</option>
							<option value="yes" <?php echo ($bestbooks_privacy === "yes" ? "selected" : ""); ?>>Yes</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="active-company">Active Company</label></td>
					<td>
						<select class="w3-input w3-block" name="active-company" id="active-company">
							<option value="0" <?php echo ($active_company == 0) ? "selected" : ""; ?>>Default</option>
							<?php 
							$companies = get_users(array('role__in' => array('bestbooks_company')));
							foreach($companies as $company) {
								echo '<option value="'.$company->ID.'" '.($company->ID == $active_company ? "selected" : "").'>'.$company->display_name.' ['.$company->user_email.']</option>';
							}
							?>
						</select>
					</td>
				</tr>
				<tr><td colspan="2"> <?php submit_button(); ?></td></tr>
			</table>
        </div>
    </form>
	<?php
}
?>