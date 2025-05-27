/**
 * Overall:
 * The Overall Subtopic provides general guidance on the classification of current assets and current
 * liabilities and discusses the determination of working capital. 
 * The balance sheets of most entities show separate classifications of current assets and 
 * current liabilities (commonly referred to as classified balance sheets) permitting ready 
 * determination of working capital.

 */
module.exports = {
    topic: "Topic 210",
    validate: (financialData) => {
        if (financialData.hasOwnProperty("overall")) {
                if (!financialData.hasOwnProperty("assets")) {
                    return { topic: "210-20-50-4", issue: "Missing assets" };
                } else {
                    if (!financialData.assets.hasOwnProperty("current")) {
                        return { topic: "210-10-45-1", issue: "Missing current assets" };
                    } else {
                        if (!financialData.assets.current.hasOwnProperty("cash")) {
                            return { topic: "210-10-45-1", issue: "Missing cash disclosure" };
                        }
                        if (!financialData.assets.current.hasOwnProperty("tradeReceivables")) {
                            return { topic: "210-10-45-1", issue: "Missing trade receivables disclosure" };
                        }
                        if (!financialData.assets.current.hasOwnProperty("noteReceivables")) {
                            return { topic: "210-10-45-1", issue: "Missing note receivables disclosure" };
                        }
                        if (!financialData.assets.current.hasOwnProperty("accountsReceivable")) {
                            return { topic: "210-10-45-1", issue: "Missing accounts receivable disclosure" };
                        }
                        if (!financialData.assets.current.hasOwnProperty("inventory")) {
                            return { topic: "210-10-45-1", issue: "Missing inventory disclosure" };
                        }
                        if (!financialData.assets.current.hasOwnProperty("prepaidExpenses")) {
                            return { topic: "210-10-45-1", issue: "Missing prepaid expenses disclosure" };
                        } else {
                            if (!financialData.assets.current.hasOwnProperty("insurance")) {
                                return { topic: "210-10-45-1", issue: "Missing insurance disclosure" };
                            }
                            if (!financialData.assets.current.hasOwnProperty("interest")) {
                                return { topic: "210-10-45-1", issue: "Missing interest disclosure" };
                            }
                            if (!financialData.assets.current.hasOwnProperty("rents")) {
                                return { topic: "210-10-45-1", issue: "Missing rents disclosure" };
                            }
                            if (!financialData.assets.current.hasOwnProperty("taxes")) {
                                return { topic: "210-10-45-1", issue: "Missing taxes disclosure" };
                            }
                            if (!financialData.assets.current.hasOwnProperty("unusedRoyalties")) {
                                return { topic: "210-10-45-1", issue: "Missing unused royalties disclosure" };
                            }
                            if (!financialData.assets.current.hasOwnProperty("advertising")) {
                                return { topic: "210-10-45-1", issue: "Missing advertising disclosure" };
                            }
                            if (!financialData.assets.current.hasOwnProperty("operatingSupplies")) {
                                return { topic: "210-10-45-1", issue: "Missing operating supplies disclosure" };
                            }
                        }
                    }
                }
                if (!financialData.hasOwnProperty("liabilities")) {
                    return { topic: "210-20-50-4", issue: "Missing liabilities" };
                }
        } else if (financialData.hasOwnProperty("offsetting")) {
            
        } else {
            return { topic: "210-20-50-3", issue: "Missing offsetting disclosure" };
        }
        return { topic: "210-20-50-4", issue: "Missing overall disclosure" };;
    }
};
