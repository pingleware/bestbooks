<?php
/**
 * Shortcode routines
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2009-2019 PressPage Entertainment Inc.
 */
?>
<?php
if (!function_exists('bestbooks_sample_1')) {
    function bestbooks_sample_1($atts, $content=null, $code="")
    {
        $coa = get_coa_instance();
    
        $coa->add("Cash","Asset");
        $coa->add("Livery","Revenue");
        $coa->add("Gas","Expense");
    
        $cash = get_asset_instance("Cash");
        $livery = get_revenue_instance("Livery");
        $gas = get_expense_instance("Gas");
    
        $livery->addcredit("2007-03-31","Taxi Transportation Daily Bookout",137.00);
        $cash->adddebit("2007-03-31","Tax Transportation Daily Bookout",137.00);
        $cash->addcredit("2007-03-31","Gas for Taxi Transportation Daily",37.00);
        $gas->adddebit("2007-03-31","Gas for Taxi Transportation Daily",37.00);
    }

    add_shortcode('bestbooks-sample-1', 'bestbooks_sample_1');
}

if (!function_exists('bestbooks_sample_2')) {
    function bestbooks_sample_2($atts, $content=null, $code="")
    {
        extract(
            shortcode_atts(
                array(
                    'choice' => '#',
                    'value' => '0',
                ), 
                $atts
            )
        );
        $choice  = "{$choice}";
        $value = "{$value}";
    }

    add_shortcode('bestbooks-sample-2', 'bestbooks_sample_2');
}

if (!function_exists('bestbooks_add_coa_account')) {
    function bestbooks_add_coa_account($atts, $content=null, $code="")
    {
         extract(
            shortcode_atts(
                array(
                    'name' => '#',
                    'type' => '0',
                ), 
                $atts
            )
        );
        $name  = "{$name}";
        $type = "{$type}";
    
        $coa = get_coa_instance();
        $coa->add($name,$type);
    }        
}

?>