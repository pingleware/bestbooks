<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes"/>
    
    <!-- Root template that transforms XML to HTML -->
    <xsl:template match="/">
        <html>
            <head>
                <title>Breakeven Report</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; text-align: right; border: 1px solid #ddd; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <td colspan="5" style="text-align:center;"><h1>Breakeven Report</h1>[USD $ millions]</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Total Fixed Costs</th>
                        <th>Total Variable Costs</th>
                        <th>Total Revenue</th>
                        <th>Net Profit/Loss</th>
                    </tr>
                    
                    <!-- Loop through each row and output data in table cells -->
                    <xsl:for-each select="//lineItems">
                        <tr>
                            <td><xsl:value-of select="//txdate"/></td>
                            <td>
                                <xsl:value-of select="//total_fixed_costs"/>
                            </td>
                            <td>
                                <xsl:value-of select="//total_variable_costs"/>
                            </td>
                            <td>
                                <xsl:value-of select="//total_revenue"/>
                            </td>
                            <td>
                                <xsl:value-of select="//net_profit_loss"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                    <tr>
                        <th colspan="2">Management|Accountant|Auditor Note(s)</th>
                        <td colspan="3"><xsl:value-of select="//notes" /></td>
                    </tr>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
