// required when running on node.js
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://try:try@broker.shiftr.io', {
  clientId: 'asd0999'
});

client.on('connect', function() {
  console.log('client has connected!');

  // client.subscribe('/example');
  // client.unsubscribe('/example');

  // setInterval(function() {
  //   client.publish('/Tushar', 'this is me');
  // }, 1000);

  setInterval(function() {
    client.publish('/ITPsecretClubhouse', 'Tushar is back!');
  }, 1000);

  // setInterval(function() {
  //   client.publish('/IamGonnaBreakThisServer', 'lets do it together');
  // }, 1000);
});

// client.on('message', function(topic, message) {
//   console.log('new message:', topic, message.toString());
// });

//https://shiftr.io/try#javascript
//https://www.npmjs.com/package/mqtt