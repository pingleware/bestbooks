# BestBooks Accounting Application Framework - Reports

There are no free options for creating reports from content received from a database. jsreports, jasperreports have limited free options.

Hence the report design will go back to basics,

    1. creating an XML document for the data required for the report
    2. display the XML using XSLT with CSS which can be printed or save as a PDF or DOCX (see https://www.geeksforgeeks.org/displaying-xml-using-xslt/)

During initialization (invoking the init() function)), will copy the xslt template files to the user's home directory in the bestbooks system directory.

The js2xmlparser package is used to convert an object to xml, while the xslt-processor package will transform the XML data and XSLT template to HTML format.

HTML can be converted to other forms like PDF.

## Reporting in Accounting

Reporting is the most important feature of any accounting system, because reporting permits the communication to interested parties. Using test driven development (TDD) allows the implementation of the reports module first.
