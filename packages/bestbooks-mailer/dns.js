"use strict"

const path = require('path');
const { exec } = require('child_process');

async function resolve(domain,mx,cb) {

    // Perl code to perform DNS resolution
    exec(`perl ${path.join(__dirname,'resolve.pl')} ${domain}`,async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Perl script: ${error}`);
            const error = new Error(`Error executing Perl code: ${error}`)
            cb(error, []);
        }
    
        if (stderr) {
            console.error(`Perl script returned an error: ${stderr}`);
            const error = new Error(`Perl script returned an error: ${stderr}`)
            cb(error, []);
        }
    
        // Split the output by ',' to get IP addresses and remove empty strings
        const ipAddresses = stdout.split(',').filter(ip => ip.trim() !== '');
    
        // Log the IP addresses array
        let addresses = [];
        console.log('Extracted IP addresses:', ipAddresses);
        const ehlo = await getEHLO(domain);
        ipAddresses.forEach(function(address){
            addresses.push({exchange: address, domain: domain, ehlo: ehlo})
        })
        cb(null, addresses);        
    });    
}

async function getEHLO(serverHostname) {
    return new Promise((resolve,reject) => {
        const net = require('net');

        //const serverHostname = 'mail.example.com';
        const serverPort = 25; // SMTP port
        
        // Create a socket connection to the server
        const socket = net.createConnection({
            host: serverHostname,
            port: serverPort
        });
        
        // Handle connection events
        socket.on('connect', () => {
            console.log('Connected to the server');
        });
        
        socket.on('error', (error) => {
            console.error('Error connecting to the server:', error);
            reject(error);
        });
        
        // Handle data received from the server
        socket.on('data', (data) => {
            const response = data.toString();
            //console.log('Received:', response);
        
            // Parse EHLO response
            //if (response.startsWith('250 ')) {
                const ehloResponse = response.split('\r\n').slice(1); // Remove first line (EHLO response code)
                //console.log('EHLO parameters:', ehloResponse);
                // Now you have the EHLO parameters in the ehloResponse array
                // Further processing of EHLO response can be done here
                socket.end(); // Close the connection
                resolve(ehloResponse);
            //}
        });
        
        // Send EHLO command to the server
        socket.write(`EHLO ${serverHostname}\r\n`);        
    })
}

module.exports = {
    resolve,
    getEHLO
}