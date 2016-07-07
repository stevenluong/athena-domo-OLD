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
