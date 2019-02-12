var url = "128.122.151.172";
// var url = "10.16.0.1";
// var username = "3baf2de2228315df29641b245b77d739"; //.177
var username = "IZLvmTtRp8uOyjKzuelZAZgoLYuviHkNO1MphVsZ"; //.172
var path;
// var ipLabel, ipField, userLabel, userField, connectBtn;
var lightState = {}
var brightness = 180;

function setup() {
  createCanvas(400, 400);
  background(255);

  // ipLabel = createSpan("IP address: ");
  // ipLabel.position(10, 440);
  //
  // ipField = createInput("text");
  // ipField.value(url);
  // ipField.position(90, 440);
  //
  // userLabel = createSpan("user name: ");
  // userLabel.position(250, 440);
  //
  // userField = createInput("text");
  // userField.value(username);
  // userField.position(330, 440);
  //
  // connectBtn = createButton("connect");
  // connectBtn.position(480, 440);
  // connectBtn.mouseClicked(connect);

  // newDiv = createDiv("");

  stroke(0);
  strokeWeight(1);
  ellipse(width / 2, height / 2, 300, 300);

  lightState = {
    "on": true,
    "bri": brightness
  }
  connect();
}

function connect() {
  path = "http://" + url + "/api/" + username + "/lights";
  httpDo(path, 'GET', getLights, getError)
  // newDiv.position(10, 480);
  // newDiv.html("Trying to connect...");
}

function getLights(result) {
  // connectedDiv = createDiv(result);
  // connectedDiv.position(400, 480);
  document.getElementById('myDiv').innerHTML = result;
}

function getError(result) {
  // errorDiv = createDiv("No hub found");
  // errorDiv.position(400, 480);
  document.getElementById('myDiv').innerHTML = result;
}

function mouseMoved() {
  var distance = dist(mouseX, mouseY, width / 2, height / 2);
  console.log(lightState);
  let val = map(distance, 0, 150, 255, 0);

  if (distance <= 150) {
    Xpos = mouseX;
    Ypos = mouseY;
    lightState.on = true;
    lightState.bri = floor(val);
    // console.log(lightState);
  } else {
    lightState.on = false;
    lightState.bri = 0;
  }
  setLight(lightState); //should i send two comma seperated values or should i assign as the {} itself
}

function setLight(data) {
  path = "http://" + url + "/api/" + username + "/lights/1/state/";
  var content = JSON.stringify(data); // convert JSON obj to string
  httpDo(path, 'PUT', content, 'text', getLights); //HTTP PUT the change
}