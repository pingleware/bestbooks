module.exports = {
    topic: "Topic 810",
    validate: (financialData) => {
        //if (!financialData.hasOwnProperty("accountingPolicies")) {
        //    return { topic: "105", issue: "Missing accounting policies disclosure" };
        //}
        return null;
    }
};
