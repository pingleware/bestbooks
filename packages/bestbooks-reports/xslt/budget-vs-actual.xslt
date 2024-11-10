<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes"/>
    
    <!-- Root template that transforms the XML to HTML -->
    <xsl:template match="/">
        <html>
            <head>
                <title>Budget-vs-Actual Report</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <td colspan="10" style="text-align:center;"><h1>Budget-vs-Actual Report</h1>[USD $ millions]</td>
                    </tr>
                    <tr>
                        <th>Transaction Date</th>
                        <th>Account Code</th>
                        <th>Account Name</th>
                        <th>Account Type</th>
                        <th>Actual Year 1</th>
                        <th>Budget Year 1</th>
                        <th>Variance Year 1</th>
                        <th>Actual Year 2</th>
                        <th>Budget Year 2</th>
                        <th>Variance Year 2</th>
                    </tr>
                    
                    <!-- Loop through each row and output the data in table cells -->
                    <xsl:for-each select="//lineItems">
                        <tr>
                            <td><xsl:value-of select="//txdate"/></td>

                            <td><xsl:value-of select="//account_code"/></td>
                            <td><xsl:value-of select="//account_name"/></td>
                            <td><xsl:value-of select="//account_type"/></td>
                            
                            <td>
                                <xsl:value-of select="//actual_year_1"/>
                            </td>
                            <td>
                                <xsl:value-of select="//budget_year_1"/>
                            </td>
                            <td>
                                <xsl:value-of select="//variance_year_1"/>
                            </td>
                            
                            <td>
                                <xsl:value-of select="//actual_year_2"/>
                            </td>
                            <td>
                                <xsl:value-of select="//budget_year_2"/>
                            </td>
                            <td>
                                <xsl:value-of select="//variance_year_2"/>
                            </td>                            
                        </tr>
                    </xsl:for-each>
                    <tr>
                        <th colspan="2">Management|Accountant|Auditor Note(s)</th>
                        <td colspan="8"><xsl:value-of select="//notes" /></td>
                    </tr>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
