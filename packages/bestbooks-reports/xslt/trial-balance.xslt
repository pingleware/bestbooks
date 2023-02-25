<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table>
                <tr>
                    <td colspan="3" style="text-align:center;"><h1>Trial Balance</h1></td>
                </tr>
                <tr>
                    <td colspan="3" style="align-text:right;">Date: <xsl:value-of select="//date"/></td>
                </tr>
                <tr>
                    <td colspan="3"><hr/></td>
                </tr>
                <tr>
                    <th>Account</th>
                    <th><u>Debit</u></th>
                    <th><u>Credit</u></th>
                </tr>
                <xsl:for-each select="//lineItems">
                    <tr>
                        <td><xsl:value-of select="name"/></td>
                        <td><xsl:value-of select="debit"/></td>
                        <td><xsl:value-of select="credit"/></td>
                    </tr>
                </xsl:for-each>
                <tr>
                    <td colspan="3"><hr/></td>
                </tr>
                <tr>
                    <th>Totals:</th>
                    <th><xsl:value-of select="//total/debit"/></th>
                    <th><xsl:value-of select="//total/credit"/></th>
                </tr>
                </table>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>