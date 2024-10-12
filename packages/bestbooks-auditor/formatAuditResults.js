const xml2js = require('xml2js');

function formatAuditResultsToJSON(auditResults) {
    return JSON.stringify(auditResults, null, 2);  // Pretty print the JSON with 2 spaces indentation
}

function formatAuditResultsToXML(auditResults) {
    const builder = new xml2js.Builder({ rootName: 'AuditResults', renderOpts: { 'pretty': true } });
    const xml = builder.buildObject({ AuditChecks: auditResults });
    return xml;
  }
  
  module.exports = { 
    ToJSON: formatAuditResultsToJSON,
    ToXML: formatAuditResultsToXML,
};