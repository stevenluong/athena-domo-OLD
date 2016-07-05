'use strict';

/* App Module */

var mainApp = angular.module('mainApp', [
        'ngRoute',
        //'mainAnimations',
        'mainControllers',
        'mainFilters',
        'mainServices',
        'Devise'
]);

mainApp.config(['$routeProvider','AuthProvider',
        function($routeProvider,AuthProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/main.html',
                    controller: 'mainCtrl'
                }).
                when('/login', {
                    templateUrl: 'partials/login.html',
                    controller: 'mainCtrl'
                }).
                when('/register', {
                    templateUrl: 'partials/register.html',
                    controller: 'mainCtrl'
                }).

            otherwise({
                redirectTo: '/'
            });
            AuthProvider.loginPath('http://slapps.fr/athena/ror/users/sign_in.json');
            AuthProvider.logoutPath('http://slapps.fr/athena/ror/users/sign_out.json');
            AuthProvider.registerPath('http://slapps.fr/athena/ror/users.json');
            //AuthProvider.loginMethod('GET');
            //AuthProvider.resourceName('user');
        }

]);
