/*
* Cloud Function
gcloud beta functions deploy helloHttp --stage-bucket [BUCKET_NAME] --trigger-http
*/
'use strict';

const convert = require('convert-units');

exports.momo = (req, res) => {
  const action = req.body.result.action;
  const parameters = req.body.result.parameters;
  const speech = req.body.result.fulfillment.speech;
  let output;
  switch(action){
    case 'convert':
      let {fromNumber, fromName, toName} = parameters;
      //change names to acceptable input for convert function
      [fromName, toName] = [fromName, toName].map(name => {
        if (name === 'tbsp'|| name === 'fl oz'){
          return name = name === 'tbsp' ? 'Tbs' : 'fl-oz'
        }
        else return name
      });
      const toNumberRaw = convert(fromNumber).from(fromName).to(toName);
      const toNumber = toNumberRaw.toFixed(1);
      output = `${fromNumber} ${fromName} is ${toNumber} ${toName}`;
      break;

    case 'setTimer':
      let duration = parameters.duration;
      output = `timer set for ${duration.amount} ${duration.unit}`;
      break;

    default:
      output = speech;
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': output, 'displayText': output }))
    .catch((error) => {
  // If there is an error let the user know
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
}

//has to use Tbs
