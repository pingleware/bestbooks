// COBIT Module

var COBIT = (function () {
    // Private variables
    var controlObjectives = [];
  
    // Private methods
    function addControlObjective(objective) {
      controlObjectives.push(objective);
    }
  
    function getControlObjectives() {
      return controlObjectives;
    }
  
    // Public API
    return {
      addControlObjective: addControlObjective,
      getControlObjectives: getControlObjectives,
    };
  })();
  
  // Usage example
  COBIT.addControlObjective("COBIT Control Objective 1");
  COBIT.addControlObjective("COBIT Control Objective 2");
  
  var objectives = COBIT.getControlObjectives();
  console.log(objectives); // Output: ["COBIT Control Objective 1", "COBIT Control Objective 2"]
  