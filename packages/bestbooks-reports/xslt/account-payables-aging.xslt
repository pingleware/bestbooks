<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes"/>
    
    <!-- Root template to structure HTML output -->
    <xsl:template match="/">
        <html>
            <head>
                <title>Accounts Payable Aging Report</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; text-align: right; border: 1px solid #ddd; }
                    th { background-color: #f2f2f2; text-align: left; }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <td colspan="9" style="text-align:center;"><h1>Accounts Payable Aging Report</h1>[USD $ millions]</td>
                    </tr>
                    <tr>
                        <th>Transaction Date</th>
                        <th>Account Code</th>
                        <th>Account Name</th>
                        <th>Current</th>
                        <th>Past Due 1-30 Days</th>
                        <th>Past Due 31-60 Days</th>
                        <th>Past Due 61-90 Days</th>
                        <th>Past Due Over 90 Days</th>
                        <th>Total Outstanding</th>
                    </tr>
                    
                    <!-- Loop through each row to populate table -->
                    <xsl:for-each select="//lineItems">
                        <tr>
                            <td><xsl:value-of select="//txdate"/></td>
                            <td><xsl:value-of select="//account_code"/></td>
                            <td><xsl:value-of select="//account_name"/></td>
                            <td><xsl:value-of select="//current"/></td>
                            <td><xsl:value-of select="//past_due_1_30"/></td>
                            <td><xsl:value-of select="//past_due_31_60"/></td>
                            <td><xsl:value-of select="//past_due_61_90"/></td>
                            <td><xsl:value-of select="//past_due_over_90"/></td>
                            <td><xsl:value-of select="//total_outstanding"/></td>
                        </tr>
                    </xsl:for-each>
                    <tr>
                        <th colspan="2">Management|Accountant|Auditor Note(s)</th>
                        <td colspan="7"><xsl:value-of select="//notes" /></td>
                    </tr>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
