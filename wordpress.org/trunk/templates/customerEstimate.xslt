<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table class="w3-table" border="1">
                <tr>
                    <td><h3><xsl:value-of select="estimate/company/name" /></h3></td>
                    <td><h1>Estimate</h1></td>
                </tr>
                <tr>
                    <td style="width:50%;"><xsl:value-of select="estimate/company/address1" />, <xsl:value-of select="estimate/company/address2" /></td>
                    <td style="text-align: right; width:50%;">Date: <xsl:value-of select="estimate/date" /></td>
                </tr>
                <tr>
                    <td><xsl:value-of select="estimate/company/city" />, <xsl:value-of select="estimate/company/state" />  <xsl:value-of select="estimate/company/zip" /></td>
                    <td style="text-align: right;">Estimate #: <xsl:value-of select="estimate/number" /></td>
                </tr>
                <tr>
                    <td colspan="2"><hr/></td>
                </tr>
                <tr>
                    <td>
                        <h2 style="text-decoration: underline;">CUSTOMER</h2>
                        <p><xsl:value-of select="estimate/customer/company" /></p>
                        <p><xsl:value-of select="estimate/customer/contact" /></p>
                        <p><xsl:value-of select="estimate/customer/address1" /> <xsl:value-of select="estimate/customer/address2" /></p>
                        <p><xsl:value-of select="estimate/customer/city" />, <xsl:value-of select="estimate/customer/state" />  <xsl:value-of select="estimate/customer/zip" /></p>
                        <p>EMail: <xsl:value-of select="estimate/customer/email" /></p>
                        <p>Phone: <xsl:value-of select="estimate/customer/phone" />, FAX: <xsl:value-of select="estimate/customer/fax" /></p>
                    </td>
                    <td>
                        <h2 style="text-decoration: underline;">SHIP TO</h2>
                        <p><xsl:value-of select="estimate/customer/contact" /></p>
                        <p><xsl:value-of select="estimate/customer/company" /></p>
                        <p><xsl:value-of select="estimate/customer/shipping/address1" />,  <xsl:value-of select="estimate/customer/shipping/address2" /></p>
                        <p><xsl:value-of select="estimate/customer/shipping/city" />, <xsl:value-of select="estimate/customer/shipping/state" /> <xsl:value-of select="estimate/customer/shipping/zip" /></p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <table class="w3-table" style="width: 100%;">
                            <tr>
                                <th style="text-align: center;">NET TERMS</th>
                                <th style="text-align: center;">TAX JURISDICTION</th>
                                <th style="text-align: center;">DUE DATE</th>
                            </tr>
                                <tr>
                                    <td style="text-align: center; background-color: #EBEBEB;"><xsl:value-of select="estimate/terms" /></td>
                                    <td style="text-align: center; background-color: #EBEBEB;"><xsl:value-of select="estimate/tax" /></td>
                                    <td style="text-align: center; background-color: #EBEBEB;"><xsl:value-of select="estimate/duedate" /></td>
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
                                <th style="text-align: center; width:16%;">QUANTITY</th>
                                <th style="text-align: center; width:16%;">DESCRIPTION</th>
                                <th style="text-align: center; width:16%;">UNIT PRICE</th>
                                <th style="text-align: center; width:16%;">DISCOUNT</th>
                                <th style="text-align: center; width:16%;">TAX</th>
                                <th style="text-align: center; width:16%;">AMOUNT</th>
                            </tr>
                            <xsl:for-each select="estimate/lineitems/lineitem">
                            <tr><td colspan="5"><hr/></td></tr>
                                <tr>
                                    <td style="text-align: center;"><xsl:value-of select="quantity" /></td>
                                    <td style="text-align: center;"><xsl:value-of select="description" /></td>
                                    <td style="text-align: center;"><xsl:value-of select="unitprice" /></td>
                                    <td style="text-align: center;"><xsl:value-of select="discount" /></td>
                                    <td style="text-align: center;"><xsl:value-of select="tax" /></td>
                                    <td style="text-align: center;"><xsl:value-of select="total" /></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right;">
                        Subtotal: <xsl:value-of select="estimate/prices/subtotal" /><br/>
                        Tax: <xsl:value-of select="estimate/prices/tax" /><br/>
                        Shipping: <xsl:value-of select="estimate/prices/shipping" /><br/>
                        Other: <xsl:value-of select="estimate/prices/other" />
                        <hr/>
                        Total: <xsl:value-of select="estimate/prices/total" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span stlye="text-align: center;">ADDITIONAL TERMS &amp; COMMENTS</span><br/>
                        <textarea rows="5" cols="100" style="width:100%;"><xsl:value-of select="estimate/comments" /></textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center;">
                        If you have any questions about this Estimate, please contact:
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center;">
                        <xsl:value-of select="estimate/company/contact" />, <xsl:value-of select="estimate/company/email" />, or <xsl:value-of select="estimate/company/phone" />
                    </td>
                </tr>
            </table>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>