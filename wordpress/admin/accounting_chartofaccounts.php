<?php
require 'inc/ChartOfAccounts_List_Table.inc.php';

function bestbooks_dashboard_accounting_chartofaccounts() {
	$chartofaccounts_list_table = new ChartOfAccounts_List_Table();
	?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>BestBooks - <a href="<?php echo admin_url('admin.php?page=bestbooks_accounting'); ?>">Accounting</a> - Chart of Accounts&nbsp;
			<input type="button" id="add_account" value="Add Account" class="w3-button w3-blue" />
		</h2>
		<?php
		$coa = get_coa_instance();
		$results = array();
    	$results = AccountTypes::getConstList();
		$chartofaccounts_list_table->prepare_items(); 
		$chartofaccounts_list_table->display(); 		
		?>
	</div>
	<div id="add-account-dialog" title="Add New Account" style="display:none;">
		<label for="account_name">Name</label>
		<input type="text" class="w3-input w3-block" id="account_name" name="account_name" value="" />
		<label for="account_type">Type</label>
		<select class="w3-input w3-block" id="account_type" name="account_type">
			<option value="">Select</option>
			<?php foreach ($results as $type => $name) : ?>
				<option value="<?php echo $type; ?>"><?php echo $name; ?></option>
			<?php endforeach; ?>
		</select>
		<br/>
		<input type="button" class="w3-input w3-block w3-black" id="add_account_action" name="add_account_action" value="Add" />
		<br/>
	</div>		
	<script>
		jQuery(document).ready(function($){
			$("#add-account-dialog").dialog({
    			autoOpen : false, modal : true, show : "blind", hide : "blind"
  			});
			$('#add_account').bind('click', function(){
				$('#account_type').val("");
				$('#account_name').val("");
				$("#add-account-dialog").dialog("open");
				return false;
			});
			$('#add_account_action').bind('click', function(){
				if ($('#account_type').val() == "") {
					alert("Missing Account Type!");
					return false;
				}
				if ($('#account_name').val() == "") {
					alert("Missing Account name");
					return false;
				}
				$.ajax({
					url: "<?php echo admin_url('admin-ajax.php'); ?>",
					type: "post",
					data: {
						action: "bestbooks_add_chartofaccount",
						aname: $('#account_name').val(),
						atype: $('#account_type').val()
					},
					success: function(results) {
						alert(results);
						$("#add-account-dialog").dialog("close");
						location.reload();
					}
				});
			});
			$('.delete-button').bind('click', function(){
				if (confirm("Delete account " + $(this).data('id'))) {
					$.ajax({
						url: "<?php echo admin_url('admin-ajax.php'); ?>",
						type: "post",
						data: {
							action: "bestbooks_delete_chartofaccount",
							aname: $(this).data('id')
						},
						success: function(results) {
							alert(results);
							location.reload();
						}
					});					
				}
			});
		});
	</script>
	<?php	
}
?>