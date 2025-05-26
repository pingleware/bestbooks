<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
  <html>
  <body>
    <table>
        <tr>
            <td><h3><xsl:value-of select="//company/name" /></h3></td>
            <td><h1>Purchase Order</h1></td>
        </tr>
        <tr>
            <td style="width:50%;"><xsl:value-of select="//company/billing/address1" />, <xsl:value-of select="//company/billing/address2" /></td>
            <td style="text-align: right; width:50%;">Date: <xsl:value-of select="//date" /></td>
        </tr>
        <tr>
            <td><xsl:value-of select="//company/billing/city" />, <xsl:value-of select="//company/billing/state" /> <xsl:value-of select="//company/billing/Zip" /></td>
            <td style="text-align: right;">PO #: <xsl:value-of select="//number" /></td>
        </tr>
        <tr>
            <td>
            Phone: <xsl:value-of select="//company/billing/phone" /><br/>
            Fax: <xsl:value-of select="//company/billing/fax" /><br/>
            Website: <xsl:value-of select="//company/website" /><br/>
            </td>
            <td style="text-align: right; border:1px solid black;">
            <h1 style="color:red; text-align:center;">
                <xsl:value-of select="//payment/method" />
            </h1>
            <h3 style="text-align: center;">Confirmation: <xsl:value-of select="//payment/confirmation" /></h3>
            <h3 style="text-align: center;">Amount: <xsl:value-of select="//payment/amount" /></h3>
            </td>
        </tr>
        <tr>
            <td colspan="2"><hr/></td>
        </tr>
        <tr>
            <td>
                <h2 style="text-decoration: underline;">VENDOR</h2>
                <p><xsl:value-of select="//vendor/name" /></p>
                <p><xsl:value-of select="//vendor/contact" /></p>
                <p><xsl:value-of select="//vendor/address1" />, <xsl:value-of select="//vendor/address2" /></p>
                <p><xsl:value-of select="//vendor/city" />, <xsl:value-of select="//vendor/state" /> <xsl:value-of select="//vendor/zipcode" /></p>
                <p>phone: <xsl:value-of select="//vendor/phone" /></p>
                <p>fax: <xsl:value-of select="//vendor/fax" /></p>
            </td>
            <td>
                <h2 style="text-decoration: underline;">SHIP TO</h2>
                <p><xsl:value-of select="//company/shipping/contact" /></p>
                <p><xsl:value-of select="//company/name" /></p>
                <p><xsl:value-of select="//company/shipping/address1" />, <xsl:value-of select="//company/shipping/address2" /></p>
                <p><xsl:value-of select="//company/shipping/city" />, <xsl:value-of select="//company/shipping/state" /> <xsl:value-of select="//company/shipping/zipcode" /></p>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <table class="w3-table" style="width: 100%;">
                    <tr>
                        <th style="text-align: center;">SHIPPING SERVICE</th>
                        <th style="text-align: center;">SHIP VIA</th>
                        <th style="text-align: center;">DELIVERY DATE</th>
                    </tr>
                        <tr>
                            <td style="text-align: center; background-color: #EBEBEB;"><xsl:value-of select="//shipping/service" /></td>
                            <td style="text-align: center; background-color: #EBEBEB;"><xsl:value-of select="//shipping/method" /></td>
                            <td style="text-align: center; background-color: #EBEBEB;"><xsl:value-of select="//shipping/deliverydate" /></td>
                        </tr>
                        <tr>
                            <td colspan="4"><hr/></td>
                        </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <table class="w3-table" style="table-layout: fixed; width:100%;">
                    <tr>
                        <th style="text-align: center; width:25%;">QUANTITY</th>
                        <th style="text-align: center; width:25%;">DESCRIPTION</th>
                        <th style="text-align: center; width:25%;">UNIT PRICE</th>
                        <th style="text-align: center; width:25%;">AMOUNT</th>
                    </tr>
                    <xsl:for-each select="//lineItems/lineitem">
                    <tr><td colspan="5"><hr/></td></tr>
                        <tr>
                            <td style="text-align: center;"><xsl:value-of select="quantity" /></td>
                            <td style="text-align: center;"><xsl:value-of select="description" /></td>
                            <td style="text-align: center;"><xsl:value-of select="unitprice" /></td>
                            <td style="text-align: center;"><xsl:value-of select="amount" /></td>
                        </tr>
                    </xsl:for-each>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: right;">
                Subtotal: <xsl:value-of select="//prices/subtotal" /><br/>
                Tax: <xsl:value-of select="//prices/tax" /><br/>
                Shipping: <xsl:value-of select="//prices/shipping" /><br/>
                Other: <xsl:value-of select="//prices/other" />
                <hr/>
                Total: <xsl:value-of select="//prices/total" />
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <span stlye="text-align: center;">COMMENTS</span><br/>
                <textarea rows="5" cols="100" style="width:100%;"><xsl:value-of select="//comments" /></textarea>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center;">
                If you have any questions about this Purchase Order, please contact:
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center;">
                <xsl:value-of select="//company/contact" />, <xsl:value-of select="//company/email" />, or <xsl:value-of select="//company/phone" />
            </td>
        </tr>
    </table>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>