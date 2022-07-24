<?php
function bestbooks_dashboard_page() {
	?>
    <div class="wrap">
        <h2>BestBooks Accounting Application Framework</h2>
        <p>You have made a sale and now you need to add that sale to your accounting books?</p>
        <p>Before Bestbooks, the process was manual and tedious!</p>
        <p>
            BestBooks allows you to update your accounting books and ledger/journal automatically by
    using the straightforward API's and hooks.
        </p>
        <figure>
            <img src="<?php echo plugins_url('bestbooks/images/hierarchy.png'); ?>" width="512" height="512" alt="BestBooks hierarchy" />
            <figcaption>The BestBooks Hierarchy
                <br/>
                <div class="w3-small">
                    *The object model is the class definitions derived from accounting objects: T-Account, Ledger, Journal, etc. (see class directory)<br/>
                    *The hook actions are complex accoounting operations simplified using the WordPress Hook Action interface (see hoooks.php)<br/>
                    Direct manipulation of the data outside the object model should be avoided. The object model handles data manipulation.<br/>
                    The action hooks invoke the object model for data manipulation.<br/>
                    AJAX operations (see ajax.php) invoke hooks and the object model.<br/>
                    Data presentation is built extending the core WP_List_Table object.<br/>
                    REST API is made available and requires user authentication to access (see api.php).
                </div>
            </figcaption>
        </figure>

	<fieldset class='options'>
            <legend><h2><u>Wordpress Development</u></h2></legend>
            <p>
                <a href="https://pingleware.work" target="_blank">PressPage Entertainment Inc</a> 
                is available for custom Wordpress development which includes development of new plugins, modification of existing plugins, migration of HTML/PSD/Smarty themes to wordpress-compliant <b>seamless</b> themes.
            </p>
            <p>Please email at <a href="mailto:presspage.entertainment@gmail.com">presspage.entertainment@gmail.com</a> or <a href="tel:12128790758" target="_blank">Call us</a> with your programming requirements.</p>
	</fieldset>
                        
	</div>
	<?php
}
?>