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

let Gpio = require('onoff').Gpio; // include onoff library
let led = new Gpio(17, 'out');
let ledState = 1;

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

function checkSensors() {
  // callback function for tempSensor.read():
  function getTemperature(error, reading) {
    if (error) throw error;
    // range is 0-1. Convert to Celsius (see TMP36 data sheet for details)
    latest_temp = (reading.value * 3.3 - 0.5) * 100;
    device.temperature = latest_temp;
  }

  function getLight(error, reading) {
    if (error) throw error;
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

    function checkSensors() {
      // callback function for tempSensor.read():
      function getTemperature(error, reading) {
        if (error) throw error;
        // range is 0-1. Convert to Celsius (see TMP36 data sheet for details)
        latest_temp = (reading.value * 3.3 - 0.5) * 100;
        device.temperature = latest_temp;
      }

      function getLight(error, reading) {
        if (error) throw error;
        latest_light = reading.value * 10000;
        device.light = latest_light;
      }

      // callback function for potentiometer.read():
      function getKnob(error, reading) {
        if (error) throw error;
        latest_pot = (reading.value * 40); //mapping 0-1 value to 0 and 40
        device.potentiometer = latest_pot;
      }
      // make sure there are two ADC channels open to read,
      // then read them and print the result:
      if (channels.length > 2) {
        tempSensor.read(getTemperature);
        lightSensor.read(getLight);
        potentiometer.read(getKnob);
        // console.log(device);
      }
      //console.log(device);
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
        'macAddress': 'b8:27:eb:41:e6:15',
        'sessionKey': '212be5d4-469a-4e74-9fcf-83a204e961db',
        'data': `{"temperature": ${latest_temp},"light": ${latest_light},"pot-value": ${latest_pot}}`
      });

      var options = {
        host: 'tigoe.io',
        port: 443,
        path: '/data',
        method: 'POST',
        headers: {
          'User-Agent': 'nodejs',
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
      };

      var request = http.request(options, callback); // start it
      request.write(postData); // send the data
      request.end(); // end it
    }

    function writeLED() {
      //console.log(latest_temp);
      if (latest_temp < latest_pot) {
        ledState = 1;
      } else {
        ledState = 0;
      }
      led.writeSync(ledState);
      //console.log(latest_temp<latest_pot);
    }

    // set an interval once a second to read the sensors:
    setInterval(checkSensors, 100);
    setInterval(writeLED, 100);
    //sendRequest();
    setInterval(sendRequest, 1000 * 60 * 60);