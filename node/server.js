var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five");
var board = new five.Board();
var led;

server.listen(8080);
board.on("ready", function() {

    console.log("Ready!");
    var temperature = new five.Thermometer({
        controller: "TMP36",
        pin : "A0",
        freq : 1000
    });
    temperature.on("data", function(value) {
        //TODO PUSH SOME VALUES TO ROR
        console.log(value.celsius);
    });
    led =new five.Led(13);
});
io.on('connection', function (socket) {
    say('connection');
    console.log("Client connected");
    socket.on('disconnect', function (socket){
        console.log("client disconnected");
    });
    socket.emit('on');
    //socket.on('my other event', function (data) {
    //    console.log(data);
    //});
     socket.on('blink', function (socket){
        console.log("blink");
        say("OK Steven, blinking");
        led.blink(500);
    });
    socket.on('stopBlink', function (socket){
        console.log("stopBlink");
        say("OK Steven, stoping the blink");
        led.stop().off();
    });

    socket.on('setAlarm', function (socket){
        console.log("setAlarm");
        var exec = require('child_process').exec;
        say("OK Steven, setting up the alarm");

        var cmd = '{ echo "0 8 * * * epiphany --display=:0 http://www.frequence-radio.com/ecouter-bfm-en-direct.html"; } | crontab -';
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });
    socket.on('unsetAlarm', function (socket){
        console.log("unsetAlarm");
        var exec = require('child_process').exec;
        say("OK Steven, removing the alarm");
        var cmd = 'crontab -r';
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });
    //TODO SPECIFIC STOP
    //TODO FACTORIZE
    socket.on('stop', function (socket){
        console.log("stop");
        var exec = require('child_process').exec;
        say("OK Steven, stopping");
        var cmd = "ps aux | grep epiphany | awk '{print $2;}' | xargs kill";
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });
    socket.on('stopAlarm', function (socket){
        console.log("stopAlarm");
        var exec = require('child_process').exec;
        say("OK Steven, stopping");
        var cmd = "ps aux | grep radio | awk '{print $2;}' | xargs kill";
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });

    socket.on('music', function (socket){
        console.log("music");
        say("OK Steven, playing some music");
        var exec = require('child_process').exec;
        var cmd = 'epiphany --display=:0 https://www.youtube.com/watch?v=BgfcToAjfdc&list=RDBgfcToAjfdc';
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });
    socket.on('radio', function (socket){
        console.log("radio");
        var exec = require('child_process').exec;
        say("OK Steven, launching the radio");
        var cmd = 'epiphany --display=:0 http://www.frequence-radio.com/ecouter-bfm-en-direct.html';
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });
    socket.on('calendar', function (socket){
        console.log("calendar");
        var exec = require('child_process').exec;
        say("OK Steven, launching the calendar");
        var cmd = 'epiphany --display=:0 https://calendar.google.com/';
        exec(cmd, function(error, stdout, stderr) {
            //console.log(stdout);
            // command output is in stdout
        });
    });
});
var say = function(message){
    var exec = require('child_process').exec;
    var cmd = 'espeak -ven+f5 -k5 -s150 "'+message+'";';
    exec(cmd, function(error, stdout, stderr) {
        //console.log(stdout);
        // command output is in stdout
    });

}

