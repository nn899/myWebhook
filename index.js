// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const http = require('http');
const { WebhookClient } = require('dialogflow-fulfillment');
const express = require('express');
const bodyParser = require('body-parser');
const { dialogflow } = require('actions-on-google');
const rq = require('request');
const server = express().use(bodyParser.json());

const host = 'https://api.openweathermap.org';
const APPID = 'e644eb9031472b97e1cf2073eaf1abdb';

const people = [
    {
        firstName: 'John',
        lastName: 'Doe',
        pin: '123456789',
        DOB: new Date(1948,2,29),
        policy: 'Blue Cross Blue Sheild'
    },
    {
        firstName: 'Bob',
        lastName: 'Ross',
        pin: '987654321',
        DOB: new Date(1968,7,4),
        policy: 'United Healthcare'
    }
];

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

server.get('/', (request, response) => {

    const agent = new WebhookClient({request, response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function signInUser(agent) {
        let secureNum = request.body.queryResult.parameters.win;
        console.log(secureNum);
        return authenticateUser(secureNum).then((output) => {
            agent.add(output);
        }).catch(() => {
            agent.add('Sorry! We can\'t find your data in our system');
        });
    }

function callWeather(agent) {
        let city = request.body.queryResult.parameters['geo-city'];
        return callWeatherApi(city).then((output) => {
                agent.add(output);
        }).catch(() => {
                agent.add('Sorry! There was an issue getting the data');
        });
    }


    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('medical-plan-auth-ssn', signInUser);
	intentMap.set('weather', callWeather);
    agent.handleRequest(intentMap);
});

function authenticateUser(ssn) {
    return new Promise((resolve, reject) => {
        var zen = people.find(person => person.pin == ssn);
        var output = '';
        if (zen && zen.policy !== undefined) {
            console.log("zen = " + zen);
            output = "User Authenticated. Your provider is " + zen.policy +
            "We will need to transfer you to your provider.";
        }
        else {
            output = "Unauthorized user";
        }
        if (output !== '') {
            resolve(output);
        }
        else reject();

    });
}

function callWeatherApi(city) {
    return new Promise((resolve, reject) => {
            let path = '/data/2.5/weather?q=' +
                city + '&units=metric&APPID=' + APPID;
    var weatherAPIUrl = host + path;

    var weatherAPIOptions = {
        url: weatherAPIUrl,
        method: 'GET',
        strictSSL: false
    };

    rq(weatherAPIOptions, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        console.log('body:', body);

        if (response.statusCode == 200) {
            let weatherResponse = JSON.parse(body);
            let currentConditions = weatherResponse.weather[0].description;
            let min_temp = weatherResponse.main.temp_min;
            let max_temp = weatherResponse.main.temp_max;

            // Create response
            let output = `Current conditions in ` + city + ` is  ${currentConditions}. `+
            		 `Temperature will range between ${min_temp} and ${max_temp}
					  degree celcius` ;
            console.log(output);
            resolve(output);
        }
        else {
            reject();
        }

    });
});
}


const port = process.env.PORT || 8080;
server.listen(port);
//
console.log("Server running at http://localhost:%d", port);