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
mainControllers.controller('mainCtrl', ['$scope','Auth','$window','$location','Server',
        function($scope, Auth,$window,$location,Server) {
            $scope.launchBrowser = Server.launchBrowser;
            // Server.checkConnection(function(){
            //     $scope.connection =true;
            //    $scope.$apply();
            //});
            //Auth.currentUser().then(function(user) {
            //    $scope.user = user;
            //    if($window.location.hash=="#/login")
            //        $location.path("/")
            //});
            $scope.signedIn = Auth.isAuthenticated;
            $scope.logout = function(){
                Auth.logout();
                $scope.user = {};
            };
            $scope.login = function(){
                Auth.login($scope.user).then(function(user) {
                    $scope.user = user;
                    $location.path("/");
                });
            };
            $scope.register= function(){
                Auth.register($scope.user).then(function(user) {
                    console.log($scope.user);
                    $scope.user = user;
                    $location.path("/");
                });
            };

            $scope.$on('devise:login', function(event, currentUser) {
                $scope.user = currentUser;
                console.log("DEVISE:LOGIN");
                console.log($scope.user);
            });
            $scope.$on('devise:new-session', function(event, currentUser) {
                $scope.user = currentUser;
                console.log("DEVISE:NEW SESSION");
            });
        }]);
