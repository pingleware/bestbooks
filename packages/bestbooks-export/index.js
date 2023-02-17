"use strict"

const code = require("@pingleware/bestbooks-core");

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

module.exports = {
    export_csv,
    export_xblr
}