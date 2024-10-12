"use strict"

const fs = require('fs');
const path = require('path');
const os = require('os');
const brain = require('@programphile/brain.js');

const ROOT_DIR = path.join(os.homedir(),'.bestbooks');
const MODEL_DIR = path.join(ROOT_DIR,'models');

if (!fs.existsSync(ROOT_DIR)) {
    fs.mkdirSync(ROOT_DIR);
}

if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR);
}

async function train(
    knowledge_data, 
    modelName,
    iterations=2000, 
    learningRate=0.01, 
    momentum=0.1, 
    logPeriod=10) {

        try {
            let trainingData = [];
            knowledge_data.forEach(function(item){
                let answer = item.answer;
            if (Array.isArray(item.answer)) {
                answer = item.answer.join(", "); // or use a different delimiter if needed
            }
                trainingData.push({input: item.question, output: answer});
            })
    
            // Create the neural network
            const net = new brain.recurrent.LSTM();

            // Train the network
            net.train(trainingData, {
                iterations: iterations,   // More iterations for better learning
                learningRate: learningRate, // Adjust learning rate if needed
                momentum: momentum,      // Add momentum to accelerate learning
                log: (details) => console.log(details),
                logPeriod: logPeriod       // Log every 10 iterations
            });

            // Save the trained model
            const modelJSON = net.toJSON();
            const modelFilename = path.join(MODEL_DIR,modelName);
            fs.writeFileSync(modelFilename, JSON.stringify(modelJSON, null, 2));
            return {success: true, model: modelFilename, data: trainingData, net: net};
        } catch(error) {
            return {success: false, error: error};
        }
}

async function query(query, model) {
    try {
        if (!query || !model) {
            return ({success: false, message: 'missing query or model?'});
        }

        const modelJSON = JSON.parse(fs.readFileSync(path.join(MODEL_DIR, model)));
          const net = new brain.recurrent.LSTM();
          net.fromJSON(modelJSON);
  
          const response = net.run(query.toLowerCase().trim());
          if (response) {
              return ({ success: true, answer: response, question: query });
          } else {
              return ({ success: false, answer: "I'm Sorry, my responses are limited. You must ask the right questions?", question: query });
          }
    } catch(error) {
        return ({ success: false, message: 'Error processing request', error: error.message });
    }
}

module.exports = {
    train,
    query
}