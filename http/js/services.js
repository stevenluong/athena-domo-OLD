'use strict';
var home = "http://home.slapps.fr";
//var home = "http://82.237.72.55";
var port = 8080;
/* Services */

var mainServices = angular.module('mainServices', ['ngResource']);

mainServices.factory('Server',function($http){
    var server = {};
    var socket = io(home+':'+port);
    server.checkConnection = function(callback){
        console.log("checkConnection");
        socket.emit('checkConnection');
        socket.on('on', function (data) {
            callback(data.temperature);
        });
    };
    server.getVideo = function(callback){
        socket.on('frame', function (data) {
            console.log("FRAME")
                console.log(data);
            callback(data);
        });
    };
    server.setAlarm= function(set){
        if(set)
            socket.emit('setAlarm');
        else
            socket.emit('unsetAlarm');
    };
    server.stopAlarm= function(set){
        socket.emit('stopAlarm');
    };
    server.blink= function(){
        socket.emit('blink');
    };
    server.stopBlink= function(){
        socket.emit('stopBlink');
    };
    server.launchBrowser= function(app,start){
        if(!start)
            socket.emit('stop');
        else{
            if(app=="calendar")
                socket.emit('calendar');
            if(app=="music")
                socket.emit('music');
            if(app=="radio")
                socket.emit('radio');
        }
    }
    return server;
});
