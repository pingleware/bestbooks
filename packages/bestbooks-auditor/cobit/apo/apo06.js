// APO06 - Manage Budget and Costs Implementation

/**
 * 
 * 1. totalBudget: Represents the total budget allocated for IT-related expenses. 
 *      In this example, we set it as 1000000, but you can replace it with the actual budget amount.
 * 2. budgetAllocation: Specifies the allocation of the budget into different categories. 
 *      The operationalCosts property represents the portion of the budget allocated for ongoing operational expenses, 
 *      while the capitalInvestments property represents the portion allocated for capital investments in IT projects.
 * 3. costManagementApproach: Describes the approach or strategy for managing costs. 
 *      In this example, it is set as "Implement cost control measures and regularly monitor expenses." 
 *      You can customize it to reflect your organization's specific cost management practices.
 * 4. costTracking: An array of objects representing the tracking of expenses in different categories. 
 *      Each object includes properties such as the expense category (e.g., hardware, software licenses, outsourced services) and the amount spent in that category. 
 *      This allows for monitoring and analysis of expenses to ensure they stay within budget and identify areas for potential cost savings.
 * 
 */

"use strict"

var ITBudget = {
    totalBudget: 1000000,
    budgetAllocation: {
      operationalCosts: 600000,
      capitalInvestments: 400000,
    },
    costManagementApproach: "Implement cost control measures and regularly monitor expenses",
    costTracking: [
      {
        expenseCategory: "Hardware",
        spentAmount: 200000,
      },
      {
        expenseCategory: "Software licenses",
        spentAmount: 150000,
      },
      {
        expenseCategory: "Outsourced services",
        spentAmount: 100000,
      },
    ],
  };
  
module.exports = ITBudget;  