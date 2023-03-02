"use strict"

async function export_csv() {
    return "NOT IMPLEMENTED";
}

/**
 * See https://www.sec.gov/structureddata/osd-inline-xbrl.html
 * See https://www.sec.gov/files/edgar/filermanual/efmvol2-c6.pdf
 * See https://www.fasb.org/xbrl
 * 
 */
async function export_xblr() {

}

function export_doc(divHTML, title='', filename = ''){
    var preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${title}</title></head><body>`;
    var footer = `<div style='mso-element:footer' id=f1><p class=MsoFooter>Created using @presspage/common-js from https://www.npmjs.com/package/@presspage/common-js</p></div>`;
    var postHtml = "</body></html>";
    var html = preHtml+divHTML+footer+postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    // Specify file name
    filename = filename?filename+'.doc':'document.doc';
    
    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;
        
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
}

module.exports = {
    export_csv,
    export_xblr,
    export_doc
}