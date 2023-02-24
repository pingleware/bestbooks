<?php
/**
 * Template Name: Vendor Purchase Order
 * Description: Allows a vendor to view and update a specific purchase order
 */
?>
<?php get_header(); ?>

<?php if (isset($_GET['id'])) : ?>

    <?php
    $post_id = $_GET['id'];
    $purchaseorder = get_post($post_id);
    $purchaseorder->metadata = get_post_meta($post_id);
    if (isset($purchaseorder->post_type) && $purchaseorder->post_type === "bestbooks_purchase") {
        $type = get_post_meta($purchaseorder->ID,'bill_type',true);
        if ($type === 'purchase_order') {
            $content = json_decode($purchaseorder->post_content,true);

            $xml_content = bestbooks_prepare_xml_purchase_order($content);

            print(bestbooks_transform_xml_xslt($xml_content->saveXML(), file_get_contents(dirname(__FILE__)."/purchaseOrder.xslt")));
        } else {
            ?>
            <div style="text-align:center;" ><img src="<?php echo plugins_url(); ?>/bestbooks/images/not-valid.jpg" width="100%" height="100%" alt="Not Valid!" /></div>
            <?php
        }
    } else {
        ?>
        <div style="text-align:center;" ><img src="<?php echo plugins_url(); ?>/bestbooks/images/access-denied.jpg" width="100%" height="100%" alt="Access Denied!" /></div>
        <?php
    }

    ?>
<?php else: ?>
    <div style="text-align:center;" ><img src="<?php echo plugins_url(); ?>/bestbooks/images/404.jpg" width="100%" height="100%" alt="Not Found!" /></div>
<?php endif; ?>


<?php get_footer(); ?>