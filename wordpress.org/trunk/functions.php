<?php
/**
 * Helper routines
 * 
 * @package bestbooks
 * @author PINGLEWARE.WORK [phkcorp2005@gmail.com]
 * @copyright 2009-2019 PressPage Entertainment Inc.
 */
?>
<?php
if (!function_exists('get_coa_instance')) {
    function get_coa_instance()
    {
        return new ChartOfAccounts();
    }        
}

if (!function_exists('get_asset_instance')) {
    function get_asset_instance($name)
    {
        return new Asset($name);
    }        
}

if (!function_exists('get_revenue_instance')) {
    function get_revenue_instance($name)
    {
        return new Revenue($name);
    }        
}

if (!function_exists('get_expense_instance')) {
    function get_expense_instance($name)
    {
        return new Expense($name);
    }        
}

if (!function_exists('array_to_xml')) {
    // XML BUILD RECURSIVE FUNCTION
    function array_to_xml($array, &$xml) {        
        foreach($array as $key => $value) {               
            if(is_array($value)) {            
                if(!is_numeric($key)){
                    $subnode = $xml->addChild($key);
                    array_to_xml($value, $subnode);
                } else {
                    array_to_xml($value, $subnode);
                }
            } else {
                $xml->addChild($key, $value);
            }
        }        
    }
}

if (!function_exists('bestbooks_update_term_meta')) {
    /**
     * @param term_id
     * @param meta_key 
     * @param meta_value
     * 
     * @return meta_id
     */
    function bestbooks_update_term_meta($term_id,$meta_key,$meta_value) {
        global $wpdb;
    
        $sql = "SELECT * FROM {$wpdb->prefix}termmeta WHERE term_id=$term_id;";
        $results = $wpdb->get_results($sql, ARRAY_A);
    
        if (count($results) == 0) {
            $sql = "INSERT INTO {$wpdb->prefix}termmeta (term_id,meta_key,meta_value) VALUES ($term_id,'$meta_key','$meta_value');";
        } else {
            $sql = "UPDATE {$wpdb->prefix}termmeta SET meta_key='$meta_key', meta_value='$meta_value' WHERE term_id=$term_id;";
        }
        $wpdb->get_results($sql);
    
        $sql = "SELECT meta_id FROM {$wpdb->prefix}termmeta WHERE term_id=$term_id;";
        $results = $wpdb->get_results($sql, ARRAY_A);
        return $results[0]['meta_id'];
    }    
}

if (!function_exists('bestbooks_transform_xml_xslt')) {
    /**
     * $xml_content = is the string representation of the XML, e.g. $xml_content = $xml->saveXML();
     */
    function bestbooks_transform_xml_xslt($xml_content, $xslt_content) {
        $xml = new DOMDocument();
        $xml->loadXML($xml_content);
                
        // XSL
        $xsl = new DOMDocument();
        $xsl->loadXML($xslt_content);

        // Proc
        $proc = new XSLTProcessor();
        $proc->importStylesheet($xsl);
        $newdom = $proc->transformToDoc($xml);

        return $newdom->saveXML();
    }
}

if (!function_exists('bestbooks_prepare_xml_purchase_order')) {
    function bestbooks_prepare_xml_purchase_order($content = array()) {
        if (is_array($content) && isset($content['lineitems'])) {
            $lineitems = $content['lineitems'];
            unset($content['lineitems']);
    
            $lineitems_xml = "<lineitems>";
            foreach($lineitems as $lineitem) {
                $lineitems_xml .= '<lineitem>';
                $lineitems_xml .= '<quantity>'.$lineitem['quantity'].'</quantity>';
                $lineitems_xml .= '<description>'.$lineitem['description'].'</description>';
                $lineitems_xml .= '<unitprice>'.$lineitem['unitprice'].'</unitprice>';
                $lineitems_xml .= '<amount>'.$lineitem['amount'].'</amount>';
                $lineitems_xml .= '</lineitem>';
            }
            $lineitems_xml .= "</lineitems>";
            $xml_content = new SimpleXMLElement('<purchaseorder>'.$lineitems_xml.'</purchaseorder>');
            array_to_xml($content,$xml_content);
            return $xml_content;    
        }
        return false;
    }    
}

function to_xml(SimpleXMLElement $object, array $data)
{   
    foreach ($data as $key => $value) {
        if (is_array($value)) {
            $new_object = $object->addChild($key);
            to_xml($new_object, $value);
        } else {
            // if the key is an integer, it needs text with it to actually work.
            if ($key != 0 && $key == (int) $key) {
                $key = "key_$key";
            }

            $object->addChild($key, $value);
        }   
    }   
}   

if (!function_exists('bestbooks_prepare_xml_customer_estimate')) {
    function bestbooks_prepare_xml_customer_estimate($content = array(), $lineitems_xml) {
        if (is_array($content)) {
            $xml_content = new SimpleXMLElement('<estimate>'.$lineitems_xml.'</estimate>');
            array_to_xml($content,$xml_content);
            return $xml_content;    
        }
        return false;
    }
}

if (!function_exists('bestbooks_get_wpdb_prefix')) {
    function bestbooks_get_wpdb_prefix($company_id=0) {
        global $wpdb;
    
        $active_company = bestbooks_get_active_company();
    
        $prefix = $wpdb->prefix;
        if (function_exists("is_plugin_active_for_network")) {
            if (is_plugin_active_for_network('bestbooks/bestbooks.php')) {
                $prefix = $wpdb->base_prefix;
            }
            if ($company_id == 0) {
                if ($active_company > 1) {
                    $prefix .= $active_company . '_';
                }    
            } else {
                $prefix .= $company_id . '_';
            }
        } else {
            if ($company_id == 0) {
                if ($active_company > 1) {
                    $prefix .= $active_company . '_';
                }			    
            } else {
                $prefix .= $company_id . '_';
            }
        }
        return $prefix;
    }    
}

if (!function_exists('bestbooks_get_active_company')) {
    function bestbooks_get_active_company() {
        $active_company = get_option('bestbooks_active_company');
        if (isset($active_company) === false) {
            $active_company = 1;
        }
        return $active_company;
    }
}

if (!function_exists('bestbooks_wp_mail_html')) {
    function bestbooks_wp_mail_html(){
        return "text/html";
    }
    add_filter( 'wp_mail_content_type','bestbooks_wp_mail_html' );    
}

if (!function_exists('bestbooks_phpmailer_init')) {
    add_action('phpmailer_init','bestbooks_phpmailer_init',10,1);
    function bestbooks_phpmailer_init($phpmailer) {
        $phpmailer->addCustomHeader('X-GENERATED-BY', 'BestBooks for WordPress (https://wordpress.org/plugins/bestbooks)');    
    }    
}

/**
 * Add 'Reject' post status.
 */
if (!function_exists('bestbooks_custom_post_status')) {
    function bestbooks_custom_post_status() {
        register_post_status( 'reject', array(
            'label'                     => _x( 'Reject', 'post' ),
            'public'                    => true,
            'exclude_from_search'       => false,
            'show_in_admin_all_list'    => true,
            'show_in_admin_status_list' => true,
            'label_count'               => _n_noop( 'Reject <span class="count">(%s)</span>', 'Reject <span class="count">(%s)</span>' ),
        ) );
    }
    
    add_action( 'init', 'bestbooks_custom_post_status' );    
}
?>