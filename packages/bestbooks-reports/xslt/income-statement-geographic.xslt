<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes"/>
    
    <!-- Root template to structure HTML output -->
    <xsl:template match="/">
        <html>
            <head>
                <title>Revenue and Expense Report by Location</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; text-align: right; border: 1px solid #ddd; }
                    th { background-color: #f2f2f2; text-align: left; }
                </style>
            </head>
            <body>
                <h2>Revenue and Expense Report by Location</h2>
                
                <table>
                    <tr>
                        <th>Location</th>
                        <th>Region</th>
                        <th>Total Revenue</th>
                        <th>Total Expense</th>
                        <th>Percent of Total Revenue</th>
                    </tr>
                    
                    <!-- Loop through each row to populate table -->
                    <xsl:for-each select="result/row">
                        <tr>
                            <td><xsl:value-of select="Location"/></td>
                            <td><xsl:value-of select="Region"/></td>
                            <td><xsl:value-of select="total_revenue"/></td>
                            <td><xsl:value-of select="total_expense"/></td>
                            <td><xsl:value-of select="percent_of_total_revenue"/>%</td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
