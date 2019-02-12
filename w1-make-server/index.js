var express = require('express');
var server = express();
var port = 8080;
server.use(express.static('.'));
console.log("listening at port " + port);

function hungry(request, response) {
  response.send("you should try waking up on time and eating some breakfast!");
  response.end;
}

function hours(request, response) {
  var hours = request.params.hours;
  if (hours <= 4) {
    response.send("you're not doing this right, re-think your priorities    :# ");
  } else if (hours < 7) {
    response.send("That's not too bad but you could do better");
  } else if (hours < 9) {
    response.send("Thats great! wait, why are you sleepy again?")
  } else {
    response.send("Damn, I wish I slept that much!");
  }
  response.end;
}

function sleepy(request, response) {
  response.send("you should try sleeping on time! How many hours did you sleep?");
  response.end;
}

server.get('/hungry', hungry);
server.get('/sleepy', sleepy);
server.get('/sleepy/:hours', hours);
server.listen(port);