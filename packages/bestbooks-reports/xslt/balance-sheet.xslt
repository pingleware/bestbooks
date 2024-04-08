<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
<xsl:template match="/">
    <html>
        <body>
            <table class="w3-table" border="2">
                <tr>
                    <td colspan="2" style="text-align:center;"><h1>Balance Sheet</h1>[USD $ millions]</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">Date: <xsl:value-of select="//date" /></td>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left; width: 100%;">ASSET</th>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">
                        <table class="w3-table" style="table-layout: fixed; width:100%;" border="1">
                            <tr>
                                <th style="text-align: center;">ACCOUNT</th>
                                <th style="text-align: center;">BALANCE</th>
                            </tr>
                            <xsl:for-each select="//lineItems/assets">
                                <tr>
                                <td style="text-align: center;"><xsl:value-of select="name"/></td>
                                <td style="text-align: center;"><xsl:value-of select="balance"/></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>Total Asset</th>
                    <th><xsl:value-of select="//totalAsset"/></th>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left; width: 100%;">LIABILITIES</th>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">
                        <table class="w3-table" style="table-layout: fixed; width:100%;" border="1">
                            <tr>
                                <th style="text-align: center;">ACCOUNT</th>
                                <th style="text-align: center;">BALANCE</th>
                            </tr>
                            <xsl:for-each select="//lineItems/liabilities">
                                <tr>
                                <td style="text-align: center;"><xsl:value-of select="name"/></td>
                                <td style="text-align: center;"><xsl:value-of select="balance"/></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>Total Liability</th>
                    <th><xsl:value-of select="//totalLiability"/></th>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left; width: 100%;">INCOME &amp; REVENUE</th>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">
                        <table class="w3-table" style="table-layout: fixed; width:100%;" border="1">
                            <tr>
                                <th style="text-align: center;">ACCOUNT</th>
                                <th style="text-align: center;">BALANCE</th>
                            </tr>
                            <xsl:for-each select="//lineItems/income">
                                <tr>
                                <td style="text-align: center;"><xsl:value-of select="name"/></td>
                                <td style="text-align: center;"><xsl:value-of select="balance"/></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>Total Income</th>
                    <th><xsl:value-of select="//totalIncome"/></th>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left; width: 100%;">EXPENSES</th>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">
                        <table class="w3-table" style="table-layout: fixed; width:100%;" border="1">
                            <tr>
                                <th style="text-align: center;">ACCOUNT</th>
                                <th style="text-align: center;">BALANCE</th>
                            </tr>
                            <xsl:for-each select="//lineItems/expenses">
                                <tr>
                                <td style="text-align: center;"><xsl:value-of select="name"/></td>
                                <td style="text-align: center;"><xsl:value-of select="balance"/></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>Total Expense</th>
                    <th><xsl:value-of select="//totalExpense"/></th>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left; width: 100%;">EQUITY</th>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; width:100%;">
                        <table class="w3-table" style="table-layout: fixed; width:100%;" border="1">
                            <tr>
                                <th style="text-align: center;">ACCOUNT</th>
                                <th style="text-align: center;">BALANCE</th>
                            </tr>
                            <xsl:for-each select="//lineItems/equity">
                                <tr>
                                <td style="text-align: center;"><xsl:value-of select="name"/></td>
                                <td style="text-align: center;"><xsl:value-of select="balance"/></td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>Total Equity</th>
                    <th><xsl:value-of select="//totalEquity"/></th>
]               </tr>
                <tr>
                      <th>Total Liability &amp; Equity:</th>
                      <th><xsl:value-of select="//totalLiabilitiesShareholdersEquity"/></th>
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