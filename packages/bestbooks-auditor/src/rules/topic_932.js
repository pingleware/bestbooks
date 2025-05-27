/**
 *  For disclosure requirements in paragraphs 932-235-50-3 through 50-36 , an entity shall disclose
all of the following:
    a. Information that relates to annual periods for each annual period for which a statement of 
        comprehensive income is required
    b. Information required as of the end of an annual period for which a balance sheet is required
    c. Information required as of the beginning of an annual period for each annual period for 
        which a statement of comprehensive income is required.
 */
module.exports = {
    topic: "Topic 932",
    validate: (financialData) => {
        if (!financialData.hasOwnProperty("comprehensiveIncome")) {
            return { topic: "932-235-50-2A", issue: "Missing comprehensive income disclosure" };
        }
        return null;
    }
};
