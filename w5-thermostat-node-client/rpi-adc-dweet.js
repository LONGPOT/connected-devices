/*
  MCP3008 ADC reader

  Reads two channels of an MCP3008 analog-to-digital converter
  and prints them out.

  created 17 Feb 2019
  by Tom Igoe
*/

const mcpadc = require('mcp-spi-adc'); // include the MCP SPI library
const sampleRate = {
  speedHz: 20000
}; // ADC sample rate
let device = {}; // object for device characteristics
let channels = []; // list for ADC channels

// open two ADC channels and push them to the channels list:
let tempSensor = mcpadc.open(0, sampleRate, addNewChannel);
channels.push(tempSensor);
let lightSensor = mcpadc.open(1, sampleRate, addNewChannel);
channels.push(lightSensor);
let potentiometer = mcpadc.open(2, sampleRate, addNewChannel);
channels.push(potentiometer);

var latest_temp = 0;
var latest_light = 0;
var latest_pot = 0;

// callback for open() commands. Doesn't do anything here:
function addNewChannel(error) {
  if (error) throw error;
}

// function to read and convert sensors:
function checkSensors() {
  // callback function for tempSensor.read():
  function getTemperature(error, reading) {
    if (error) throw error;
    // range is 0-1. Convert to Celsius (see TMP36 data sheet for details)
    device.temperature = (reading.value * 3.3 - 0.5) * 100;
    latest_temp = device.temperature;
  }

  function getLight(error, reading) {
    if (error) throw error;
    // range is 0-1. Convert to Celsius (see TMP36 data sheet for details)
    device.light = reading.value * 10000;
    latest_light = device.light;
  }

  // callback function for potentiometer.read():
  function getKnob(error, reading) {
    if (error) throw error;
    device.potentiometer = reading.value;
    latest_pot = device.potentiometer;
  }

  // make sure there are two ADC channels open to read,
  // then read them and print the result:
  if (channels.length > 1) {
    tempSensor.read(getTemperature);
    lightSensor.read(getLight);
    potentiometer.read(getKnob);
    // console.log(device);
  }
  console.log(device);
}

// you can do this with http or https:
var http = require('https');

function callback(response) {
  var result = ''; // string to hold the response

  // as each chunk comes in, add it to the result string:
  response.on('data', function(data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function() {
    console.log(result);
  });
}

// make the actual request:
function sendRequest() {
  var postData = JSON.stringify({
    'temperature': latest_temp,
    'light': latest_light,
    'pot-value': latest_pot
  });

  var options = {
    host: 'dweet.io',
    port: 443,
    path: '/dweet/for/hulu-dancing-henchman',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  var request = http.request(options, callback); // start it
  request.write(postData); // send the data
  request.end(); // end it
}

// set an interval once a second to read the sensors:
setInterval(checkSensors, 1000);
setInterval(sendRequest, 1000);