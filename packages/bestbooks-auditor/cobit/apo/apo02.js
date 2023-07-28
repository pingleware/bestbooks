// APO02 - Manage Strategy Implementation

"use strict"

var ITStrategy = {
    businessObjectives: [
      {
        objective: "Increase market share by 10%",
        owner: "Sales and Marketing Department",
      },
      {
        objective: "Improve customer satisfaction ratings by 15%",
        owner: "Customer Service Department",
      },
    ],
    ITObjectives: [
      {
        objective: "Implement a customer relationship management (CRM) system",
        owner: "IT Operations Manager",
      },
      {
        objective: "Enhance cybersecurity measures and reduce security incidents",
        owner: "Chief Information Security Officer (CISO)",
      },
    ],
    strategicPlans: [
      {
        planName: "Digital Transformation Plan",
        description: "Leverage emerging technologies for business growth",
        owner: "Chief Technology Officer (CTO)",
      },
      {
        planName: "IT Service Improvement Plan",
        description: "Enhance IT service delivery and support capabilities",
        owner: "IT Service Delivery Manager",
      },
    ],
};
  
module.exports = ITStrategy;