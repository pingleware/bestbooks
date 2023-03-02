<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table>
                <tr>
                    <td colspan="2" style="text-align:center;"><h1>Statement of Cash Flows</h1></td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:50%;">Date: <xsl:value-of select="//date" /></td>
                </tr>
                <tr>
                    <th>Starting Balance</th>
                    <td><xsl:value-of select="//starting_balance" /></td>
                </tr>
                <tr>
                    <th>Cash Flow from Operating Activities</th>
                    <td><xsl:value-of select="//operating_total" /></td>
                </tr>
                <tr>
                    <th>Cash Flow from Investing Activities</th>
                    <td><xsl:value-of select="//investment_total" /></td>
                </tr>
                <tr>
                    <th>Cash Flow from Financing Activity</th>
                    <td><xsl:value-of select="//financing_total" /></td>
                </tr>
                <tr><td colspan="2"><hr/></td></tr>
                <tr>
                    <th>Ending Balance</th>
                    <td><xsl:value-of select-of="//ending_balance" /></td>
                </tr>
                <tr>
                    <th>Management|Accountant|Auditor Note(s)</th>
                    <td><xsl:value-of select="//statementCashFlows/notes" /></td>
                </tr>
            </table>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>