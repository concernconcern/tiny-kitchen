/*
* Cloud Function
*/
'use strict';

const convert = require('convert-units');
export let output;

exports.momo = (req, res) => {
  let {fromNumber, fromName, toName} = req.body.result.parameters;
  //change names to acceptable input for convert function
  [fromName, toName] = [fromName, toName].map(name => {
    if (name === 'tbsp'|| name === 'fl oz'){
      return name = name === 'tbsp' ? 'Tbs' : 'fl-oz'
    }
    else return name
  });
  const toNumber = convert(fromNumber).from(fromName).to(toName);
  output = `${fromNumber} ${fromName} is ${toNumber} ${toName}`;

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': output, 'displayText': output }))
    .catch((error) => {
  // If there is an error let the user know
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
}

//has to use Tbs
