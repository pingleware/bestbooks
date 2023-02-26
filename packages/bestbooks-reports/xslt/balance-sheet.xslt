<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table class="w3-table" border="1">
                <tr>
                    <td colspan="2" style="text-align:center;"><h1>Balance Sheet</h1>[USD $ millions]</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:50%;">Date: <xsl:value-of select="//date" /></td>
                </tr>
                <xsl:for-each-group select="balanceSheet/lineItems" group-by="type">
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
                          <xsl:if test="current-grouping-key() = 'Asset'">
                                <th><xsl:value-of select="//balanceSheet/totalAsset"/></th>
                          </xsl:if>
                          <xsl:if test="current-grouping-key() = 'Liability'">
                                <th><xsl:value-of select="//balanceSheet/totalLiability"/></th>
                          </xsl:if>
                          <xsl:if test="current-grouping-key() = 'Income'">
                                <th><xsl:value-of select="//balanceSheet/totalIncome"/></th>
                          </xsl:if>
                          <xsl:if test="current-grouping-key() = 'Expense'">
                                <th><xsl:value-of select="//balanceSheet/totalExpense"/></th>
                          </xsl:if>
                          <xsl:if test="current-grouping-key() = 'Equity'">
                                <th><xsl:value-of select="//balanceSheet/totalEquity"/></th>
                          </xsl:if>
                     </tr>
                </xsl:for-each-group>
                <tr>
                      <th>Total Liability &amp; Equity:</th>
                      <th><xsl:value-of select="//balanceSheet/totalLiabilitiesShareholdersEquity"/></th>
                 </tr>
            </table>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>