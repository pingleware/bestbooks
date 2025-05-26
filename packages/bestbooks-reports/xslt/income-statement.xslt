<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table class="w3-table" border="1">
                <tr>
                    <td colspan="2" style="text-align:center;"><h1>Income Statement</h1>[USD $ millions]</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:50%;">Date: <xsl:value-of select="//date" /></td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">
                        <table class="w3-table" style="table-layout: fixed; width:100%;" border="1">
                            <tr>
                                <th style="text-align: center;">CODE</th>
                                <th style="text-align: center;">ACCOUNT</th>
                                <th style="text-align: center;">BALANCE</th>
                                <th style="text-align: center;">TYPE</th>
                            </tr>
                            <xsl:for-each select="//lineItems/lineitem">
                                <tr>
                                <td style="text-align: center;"><xsl:value-of select="code"/></td>
                                <td style="text-align: center;"><xsl:value-of select="name"/></td>
                                <td style="text-align: center;"><xsl:value-of select="balance"/></td>
                                <td style="text-align: center;"><xsl:value-of select="type"/></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                <tr>
                <tr>
                    <th>Total Income:</th>
                    <th><xsl:value-of select="//totalIncome"/></th>
                </tr>
                <tr>
                    <th>Total Expense:</th>
                    <th><xsl:value-of select="//totalExpense"/></th>
                </tr>
                <tr>
                    <th>Net Income:</th>
                    <th><xsl:value-of select="//netIncome"/></th>
                </tr>
                <tr>
                    <th>Management|Accountant|Auditor Note(s)</th>
                    <td><xsl:value-of select="//notes" /></td>
                </tr>
            </table> 
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>