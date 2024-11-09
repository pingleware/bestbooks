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
                <h2>Breakeven Report</h2>
                
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Total Fixed Costs</th>
                        <th>Total Variable Costs</th>
                        <th>Total Revenue</th>
                        <th>Net Profit/Loss</th>
                    </tr>
                    
                    <!-- Loop through each row and output data in table cells -->
                    <xsl:for-each select="result/row">
                        <tr>
                            <td><xsl:value-of select="txdate"/></td>
                            <td>
                                <xsl:value-of select="SUM(CASE WHEN accounts.type = 'FixedCost' THEN ledger.debit ELSE 0 END)"/>
                            </td>
                            <td>
                                <xsl:value-of select="SUM(CASE WHEN accounts.type = 'VariableCost' THEN ledger.debit ELSE 0 END)"/>
                            </td>
                            <td>
                                <xsl:value-of select="SUM(CASE WHEN accounts.type = 'Revenue' THEN ledger.credit ELSE 0 END)"/>
                            </td>
                            <td>
                                <xsl:value-of select="SUM(CASE WHEN accounts.type = 'Revenue' THEN ledger.credit ELSE 0 END) - 
                                                    (SUM(CASE WHEN accounts.type = 'FixedCost' THEN ledger.debit ELSE 0 END) + 
                                                     SUM(CASE WHEN accounts.type = 'VariableCost' THEN ledger.debit ELSE 0 END))"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
