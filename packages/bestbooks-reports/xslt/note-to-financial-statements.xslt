<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table>
                <tr>
                    <td><h3><xsl:value-of select="//company/name" /></h3></td>
                    <td><h1>Note to Financial Statements</h1></td>
                </tr>
                <tr>
                    <td style="width:50%;"><xsl:value-of select="//company/address1" />, <xsl:value-of select="//company/address2" /></td>
                    <td style="text-align: right; width:50%;">Date: <xsl:value-of select="//date" /></td>
                </tr>
            </table>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>