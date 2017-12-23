'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);
mainControllers.controller('camCtrl', ['$scope','Server',
        function($scope, Server) {
            var canvas = document.getElementById('canvas-video');
            var context = canvas.getContext('2d');
            var img = new Image();

            // show loading notice
            context.fillStyle = '#333';
            context.fillText('Loading...', canvas.width/2-30, canvas.height/3);
            Server.getVideo(function (data){
                console.log("Frame");
                var uint8Arr = new Uint8Array(data.buffer);
                var str = String.fromCharCode.apply(null, uint8Arr);
                var base64String = btoa(str);

                img.onload = function () {
                    context.drawImage(this, 0, 0, canvas.width, canvas.height);
                };
                img.src = 'data:image/png;base64,' + base64String;
            });

        }]);
mainControllers.controller('mainCtrl', ['$scope','$window','$location','Server',
        function($scope, $window,$location,Server) {
            $scope.launchBrowser = Server.launchBrowser;
            $scope.setAlarm= Server.setAlarm;
            $scope.unsetAlarm= Server.unsetAlarm;
            $scope.stopAlarm= Server.stopAlarm;
            $scope.blink= Server.blink;
            $scope.stopBlink= Server.stopBlink;
            //TODO GET LAST TEMP FROM DB
            Server.checkConnection(function(data){
                $scope.connection =true;
                $scope.temperature = data;
                $scope.$apply();
            });
        }]);
