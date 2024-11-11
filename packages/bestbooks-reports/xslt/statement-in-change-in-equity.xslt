<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table>
                <tr>
                    <td colspan="2" style="text-align:center;"><h1>Change in Equity Statement</h1>[USD $ millions]</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:50%;">Date: <xsl:value-of select="//txdate" /></td>
                </tr>
                <tr>
                    <th>Beginning Equity</th>
                    <td><xsl:value-of select="//beginning_balance" /></td>
                </tr>
                <tr><td colspan="2"><hr/></td></tr>
                <tr>
                    <th>(+) Net Income</th>
                    <td><xsl:value-of select="//net_income" /></td>
                </tr>
                <tr>
                    <th>(-) Dividends</th>
                    <td><xsl:value-of select="//dividends" /></td>
                </tr>
                <tr>
                    <th>(+) Owner Contributions</th>
                    <td><xsl:value-of select="//owner_contributions" /></td>
                </tr>
                <tr>
                    <th>(+/-) Other Changes</th>
                    <td><xsl:value-of select="//other_adjustments" /></td>
                </tr>
                <tr><td colspan="2"><hr/></td></tr>
                <tr>
                    <th>Ending Equity</th>
                    <td><xsl:value-of select="//ending_balance" /></td>
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