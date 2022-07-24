<?php
function bestbooks_dashboard_settings() {
    if (isset($_POST['submit'])) {
        update_option("bestbooks_customer", $_POST['customer-role']);
		update_option("bestbooks_vendor", $_POST['vendor-role']);
		update_option("bestbooks_timezone", $_POST['timezone']);
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

	$zones = timezone_identifiers_list();
	?>
    <form method="post">
        <div class="wrap">
			<h2>BestBooks - Settings</h2>
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
				<tr><td colspan="2"> <?php submit_button(); ?></td></tr>
			</table>
        </div>
    </form>
	<?php
}
?>