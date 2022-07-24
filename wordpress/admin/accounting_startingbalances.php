<?php
function bestbooks_dashboard_accounting_startingbalances() {
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_accounting'); ?>">Accounting</a> - Starting Balances</h2>
		Description: <input type="text" size="80" id="description" value="" /><br/>
		Date: <input type="date" id="transdate" value="<?php echo date('Y-m-d'); ?>" />
		<br/>
		<table class="w3-table w3-block">
			<tr class="w3-grey">
				<th>Account</th>
				<th>Debit</th>
				<th>Credit</th>
			</tr>
			<?php $coa = get_coa_instance(); ?>
			<?php foreach($coa->account as $name => $type) : ?>
				<?php 
				$ledger = new Ledger($name, $type);
				$debit_balance = number_format(0.00, 2);
				$credit_balance = number_format(0.00, 2);
				if ($type === "Liability" || $type === "Revenue" || $type === "Expense") {
					$credit_balance = $ledger->balance;
				} elseif ($type === "Asset" || $type === "Cash") {
					$debit_balance = $ledger->balance;
				}
				?>
				<tr>
					<td><?php echo $name; ?></td>
					<td><input type="number" id="debit_<?php echo $name;?>" value="<?php echo $debit_balance; ?>" /></td>
					<td><input type="number" id="credit_<?php echo $name;?>" value="<?php echo $credit_balance; ?>" /></td>
				</tr>
			<?php endforeach; ?>
			<!--
			<tr>
				<td>&nbsp;</td>
				<td align="center"><input type="button" class="w3-button w3-blue" id="save_balances" value="Save" /></td>
				<td>&nbsp;</td>
			</tr>
			-->
		</table>
	</div>
	<?php	
}
