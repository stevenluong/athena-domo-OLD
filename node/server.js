var app = require('express')();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five");
var querystring = require('querystring');
var board = new five.Board({ repl:false});
var led;
var currentTemperature = 0;
var hostname = "lb";
var offset=0;
server.listen(8080);
board.on("ready", function() {
    console.log("Ready!");
    led =new five.Led(13);
    var temperature = new five.Thermometer({
        controller: "TMP36",
        pin : "A0",
        freq : 30000
    });
    temperature.on("data", function(value) {
        led.on();
        led.off();
        currentTemperature = this.C+offset;
        var measure = {
            value: currentTemperature,
            type: "temperature",
            at: (new Date()).toString()
        };
        console.log(measure);
        var postData = querystring.stringify(measure);
        var options = {
            hostname: hostname,
            port: 3000,
            path: '/api/measures',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        console.log(options);
        console.log(postData);
        var req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        req.write(postData);
        req.end();
    });
});
io.on('connection', function (socket) {
    athena_say('connection');
    console.log("Client connected");
    socket.on('disconnect', function (){
        console.log("client disconnected");
    });
    socket.on('checkConnection', function(){
        socket.emit('on',{ temperature: currentTemperature });
    });
    socket.emit('on',{ temperature: currentTemperature });
    //socket.on('my other event', function (data) {
    //    console.log(data);
    //});
    socket.on('blink', function (){
        led.blink(500);
        var message = "OK Steven, blinking";
        athena_say(message);
    });
    socket.on('stopBlink', function (){
        var message = "OK Steven, stoping the blink";
        led.stop().off();
        athena_say(message);
    });

    socket.on('setAlarm', function (){
        var message = "OK Steven, setting up the alarm";
        var cmd = '{ echo "0 8 * * * epiphany --display=:0 http://www.frequence-radio.com/ecouter-bfm-en-direct.html"; } | crontab -';
        athena_do(cmd);
        athena_say(message);
    });
    socket.on('unsetAlarm', function (){
        var message = "OK Steven, removing the alarm";
        var cmd = 'crontab -r';
        athena_do(cmd);
        athena_say(message);
    });
    //TODO SPECIFIC STOP
    socket.on('stop', function (){
        var message = "OK Steven, stopping";
        var cmd = "ps aux | grep epiphany | awk '{print $2;}' | xargs kill";
        athena_do(cmd);
        athena_say(message);
    });
    socket.on('stopAlarm', function (){
        var message = "OK Steven, stopping";
        var cmd = "ps aux | grep radio | awk '{print $2;}' | xargs kill";
        athena_do(cmd);
        athena_say(message);
    });

    socket.on('music', function (){
        var message = "OK Steven, playing some music";
        var cmd = 'epiphany --display=:0 https://www.youtube.com/watch?v=BgfcToAjfdc&list=RDBgfcToAjfdc';
        athena_do(cmd);
        athena_say(message);
    });
    socket.on('radio', function (){
        var message = "OK Steven, launching the radio";
        var cmd = 'epiphany --display=:0 http://www.frequence-radio.com/ecouter-bfm-en-direct.html';
        athena_do(cmd);
        athena_say(message);
    });
    socket.on('calendar', function (){
        var cmd = 'epiphany --display=:0 https://calendar.google.com/';
        var message = "OK Steven, launching the calendar";
        athena_do(cmd);
        athena_say(message);
    });
});
var athena_do = function(cmd){
    var exec = require('child_process').exec;
    exec(cmd, function(error, stdout, stderr) {
        //console.log(stdout);
        // command output is in stdout
    });

}
var athena_say = function(message){
    console.log("Athena:"+message);
    var exec = require('child_process').exec;
    var cmd = 'espeak -ven+f5 -k5 -s150 "'+message+'";';
    exec(cmd, function(error, stdout, stderr) {
        //console.log(stdout);
        // command output is in stdout
    });

}

