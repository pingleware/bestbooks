// EDM02 Benefits Delivery Implementation

var BenefitsDelivery = {
    benefitRealizationPlans: [],
    benefitMonitoringData: [],
};

// Define benefit realization plans
BenefitsDelivery.benefitRealizationPlans = [
    {
        initiative: "IT Project A",
        expectedBenefits: ["Cost Savings", "Improved Efficiency"],
        milestones: [
        {
            milestoneName: "Implementation",
            milestoneDate: "2023-08-01",
        },
        {
            milestoneName: "Go-live",
            milestoneDate: "2023-10-01",
        },
        ],
    },
    {
        initiative: "IT Project B",
        expectedBenefits: ["Increased Customer Satisfaction", "Revenue Growth"],
        milestones: [
        {
            milestoneName: "Requirements Gathering",
            milestoneDate: "2023-07-15",
        },
        {
            milestoneName: "Development Complete",
            milestoneDate: "2023-09-15",
        },
        ],
    },
];

// Define benefit monitoring data
BenefitsDelivery.benefitMonitoringData = [
    {
        initiative: "IT Project A",
        actualBenefits: ["Cost Savings"],
        currentStatus: "On track",
    },
    {
        initiative: "IT Project B",
        actualBenefits: [],
        currentStatus: "Behind schedule",
    },
];
  

module.exports = {
    BenefitsDelivery
};