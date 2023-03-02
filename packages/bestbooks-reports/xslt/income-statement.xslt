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
                <xsl:for-each-group select="incomeStatement/lineItems" group-by="type">
                    <xsl:sort select="type"/>
                    <tr>
                        <th colspan="2"><u><xsl:value-of select="current-grouping-key()"/></u></th>
                    </tr>
                    <tr><th>Account</th><th>Balance</th></tr>
                    <xsl:for-each select="current-group()">
                        <tr>
                        <td><xsl:value-of select="name"/></td>
                        <td><xsl:value-of select="balance"/></td>
                        </tr>
                    </xsl:for-each>
                     <tr>
                          <th>Total <xsl:value-of select="current-grouping-key()"/>:</th>
                          <xsl:if test="current-grouping-key() = 'Income'">
                                <th><xsl:value-of select="//incomeStatement/totalIncome"/></th>
                          </xsl:if>
                          <xsl:if test="current-grouping-key() = 'Expense'">
                                <th><xsl:value-of select="//incomeStatement/totalExpense"/></th>
                          </xsl:if>
                     </tr>
                </xsl:for-each-group>
                <tr>
                    <th>Net Income:</th>
                    <th><xsl:value-of select="//incomeStatement/netIncome"/></th>
                </tr>
                <tr>
                    <th>Management|Accountant|Auditor Note(s)</th>
                    <td><xsl:value-of select="//incomeStatement/notes" /></td>
                </tr>
            </table> 
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>