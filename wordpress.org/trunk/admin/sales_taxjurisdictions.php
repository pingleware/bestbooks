<?php
require 'inc/SalesTaxJurisdictions_List_Table.inc.php';

function bestbooks_dashboard_sales_taxjurisdictions() {
	$timezone = get_option("bestbooks_timezone");
	date_default_timezone_set($timezone);

	$bestbooks_customer = get_option("bestbooks_customer");
    if (isset($bestbooks_customer) === false) {
        $bestbooks_customer = "bestbooks_customer";
	}
	
	if (is_multisite()) {
		$blog_id = get_current_blog_id();
	}
    ?>
	<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url(__FILE__) ?>/../../css/w3.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<div class="wrap">
		<h2>
			BestBooks<sup>&reg;&trade;</sup> - <a href="<?php echo admin_url('admin.php?page=bestbooks_sales'); ?>">Sales</a> - Tax Jurisdictions&nbsp;
			<a href="<?php echo admin_url('edit-tags.php?taxonomy=bestbooks_taxjurisdiction'); ?>" class="w3-button w3-green">Add Tax Juirsdiction</a>
		</h2>
        <?php
			$sales_taxjurisdictions_list_table = new SalesTaxJurisdictions_List_Table();
			$sales_taxjurisdictions_list_table->prepare_items();
			$sales_taxjurisdictions_list_table->display();
		?>
    </div>
	<!-- JavaScript -->
	<script type="text/javascript">
		function taxAction(obj) {
			var action = obj.value;

			switch(action) {
				case 'delete':
					var term_id = obj.getAttribute('data-id');
					var taxonomy = obj.getAttribute('data-taxonomy');
					window.location.href = "<?php echo admin_url('term.php?taxonomy='); ?>" + taxonomy + "<?php echo '&tag_ID='; ?>" + term_id;
					break;
			}
		}
	</script>
    <?php
}
?>