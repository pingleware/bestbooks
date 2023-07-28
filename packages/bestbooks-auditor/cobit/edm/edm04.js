// EDM04 Resource Optimization Implementation

"use strict"

var ResourceOptimization = {
    resourceInventory: [],
    resourceAllocation: [],
    resourceMonitoring: [],
};
  
// Define resource inventory data
ResourceOptimization.resourceInventory = [
    {
      resourceType: "Servers",
      totalQuantity: 50,
      availableQuantity: 35,
    },
    {
      resourceType: "Network Switches",
      totalQuantity: 20,
      availableQuantity: 15,
    },
];
  
// Define resource allocation data
ResourceOptimization.resourceAllocation = [
    {
      resourceType: "Servers",
      allocatedQuantity: 15,
      allocatedTo: "IT Projects",
    },
    {
      resourceType: "Network Switches",
      allocatedQuantity: 5,
      allocatedTo: "Infrastructure Upgrades",
    },
];
  
// Define resource monitoring data
ResourceOptimization.resourceMonitoring = [
    {
      resourceType: "Servers",
      utilization: "70%",
    },
    {
      resourceType: "Network Switches",
      utilization: "75%",
    },
];
  

module.exports = ResourceOptimization;