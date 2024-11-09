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
                <h2>Budget-vs-Actual Report</h2>
                
                <table>
                    <tr>
                        <th>Account Code</th>
                        <th>Account Name</th>
                        <th>Account Type</th>
                        <th>Actual Year 1</th>
                        <th>Budget Year 1</th>
                        <th>Variance Year 1</th>
                        <th>Actual Year 2</th>
                        <th>Budget Year 2</th>
                        <th>Variance Year 2</th>
                        <th>Transaction Date</th>
                    </tr>
                    
                    <!-- Loop through each row and output the data in table cells -->
                    <xsl:for-each select="result/row">
                        <tr>
                            <td><xsl:value-of select="code"/></td>
                            <td><xsl:value-of select="name"/></td>
                            <td><xsl:value-of select="type"/></td>
                            
                            <td>
                                <xsl:value-of select="(Bal01 + Bal02 + Bal03 + Bal04 + Bal05 + Bal06 + 
                                                      Bal07 + Bal08 + Bal09 + Bal10 + Bal11 + Bal12)"/>
                            </td>
                            <td>
                                <xsl:value-of select="(Bud01 + Bud02 + Bud03 + Bud04 + Bud05 + Bud06 + 
                                                      Bud07 + Bud08 + Bud09 + Bud10 + Bud11 + Bud12)"/>
                            </td>
                            <td>
                                <xsl:value-of select="((Bal01 + Bal02 + Bal03 + Bal04 + Bal05 + Bal06 + 
                                                       Bal07 + Bal08 + Bal09 + Bal10 + Bal11 + Bal12) - 
                                                      (Bud01 + Bud02 + Bud03 + Bud04 + Bud05 + Bud06 + 
                                                       Bud07 + Bud08 + Bud09 + Bud10 + Bud11 + Bud12))"/>
                            </td>
                            
                            <td>
                                <xsl:value-of select="(Bal13 + Bal14 + Bal15 + Bal16 + Bal17 + Bal18 + 
                                                      Bal19 + Bal20 + Bal21 + Bal22 + Bal23 + Bal24)"/>
                            </td>
                            <td>
                                <xsl:value-of select="(Bud13 + Bud14 + Bud15 + Bud16 + Bud17 + Bud18 + 
                                                      Bud19 + Bud20 + Bud21 + Bud22 + Bud23 + Bud24)"/>
                            </td>
                            <td>
                                <xsl:value-of select="((Bal13 + Bal14 + Bal15 + Bal16 + Bal17 + Bal18 + 
                                                       Bal19 + Bal20 + Bal21 + Bal22 + Bal23 + Bal24) - 
                                                      (Bud13 + Bud14 + Bud15 + Bud16 + Bud17 + Bud18 + 
                                                       Bud19 + Bud20 + Bud21 + Bud22 + Bud23 + Bud24))"/>
                            </td>
                            
                            <td><xsl:value-of select="created"/></td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
