/**
 * Created by namarty on 4/11/19.
 */
const request = require('request');

// request('http://127.0.0.1:3000', function (error, response, body) {
//     console.log(`Response body: ${body}`);
// });

let options = {
    url: 'http://127.0.0.1:3000',
    json: {
        "responseId": "b874ca8e-9c14-4b4b-80f1-ce6af797d471",
        "queryResult": {
            "queryText": "Hi Bot",
            "parameters": {},
            "allRequiredParamsPresent": true,
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            ""
                        ]
                    }
                }
            ],
            "intent": {
                "name": "projects/walmart-express-example/agent/intents/c3c7270b-a8b6-442f-aabc-5f212dc54f32",
                "displayName": "Default Welcome Intent"
            },
            "intentDetectionConfidence": 1,
            "languageCode": "en"
        },
        "originalDetectIntentRequest": {
            "payload": {}
        },
        "session": "projects/walmart-express-example/agent/sessions/9cdb2f92-3dd3-03c2-7564-dc545b6db4ae"
    },
    strictSSL: false
};

request(options, (err, response, body) => {
    console.log(err);
    console.log(body);
});