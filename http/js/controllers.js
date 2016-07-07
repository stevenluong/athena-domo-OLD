'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);
mainControllers.controller('mainCtrl', ['$scope','Auth','$window','$location','Server',
        function($scope, Auth,$window,$location,Server) {
            $scope.launchBrowser = Server.launchBrowser;
            Server.checkConnection(function(){
                $scope.connection =true;
                //console.log($scope.connection);
                $scope.$apply();
            });
            Auth.currentUser().then(function(user) {
                $scope.user = user;
                if($window.location.hash=="#/login")
                    $location.path("/")
            });
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
