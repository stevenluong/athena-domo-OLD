'use strict';

/* Services */

var mainServices = angular.module('mainServices', ['ngResource']);

mainServices.factory('Server',function($http){
    var server = {};
    server.checkConnection = function(callback){
        var socket = io('http://85.68.136.217:8080');
        socket.on('on', function (data) {
            //console.log(data);
            callback();
            //socket.emit('my other event', { my: 'data' });
        });
    };
    server.getVideo = function(callback){
        var socket = io('http://localhost:8080');
        socket.on('frame', function (data) {
            console.log("FRAME")
            console.log(data);
            callback(data);
            //socket.emit('my other event', { my: 'data' });
        });
    };
    server.setAlarm= function(set){
        var socket = io('http://85.68.136.217:8080');
        if(set)
            socket.emit('setAlarm');
        else
            socket.emit('unsetAlarm');
    };
    server.stopAlarm= function(set){
        var socket = io('http://85.68.136.217:8080');
        socket.emit('stopAlarm');
    };

    server.launchBrowser= function(app,start){
        var socket = io('http://85.68.136.217:8080');
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
