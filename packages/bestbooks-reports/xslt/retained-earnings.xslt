<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table class="w3-table" border="1">
                <tr>
                    <td colspan="2" style="text-align:center;"><h1>Reatined Earnings</h1>[USD $ millions]</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:50%;">Date: <xsl:value-of select="//date" /></td>
                </tr>
                <tr>
                    <th>Previous Retained Earnings</th>
                    <td><xsl:value-of select="//previous_retained_earnings" /></td>
                </tr>
                <tr>
                    <th>Net Income</th>
                    <td><xsl:value-of select="//net_income" /></td>
                </tr>
                <tr>
                    <th>Retained Earnings</th>
                    <td><xsl:value-of select="//retained_earnings" /></td>
                </tr>
                <tr>
                    <th>Management|Accountant|Auditor Note(s)</th>
                    <td><xsl:value-of select="//retained_earnings/notes" /></td>
                </tr>
            </table>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>