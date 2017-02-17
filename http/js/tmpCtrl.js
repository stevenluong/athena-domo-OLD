'use strict';

var mainControllers = angular.module('mainControllers');

mainControllers.controller('tmpCtrl', ['$scope','$resource',
        function($scope,$resource) {
            $scope.test="TEST";
            $scope.chartConfig = {
                chart: {
                    type: 'line'
                },
                series: [{
                    data: [],
                    id: 'series1',
                    name: 'today'
                },{
                    data: [],
                    id: 'series2',
                    name: 'yesterday'
                }],
                title: {
                    text: 'temperature bitches'
                }
            }

            var Measure = $resource("http://192.168.1.11:3000/api/measures/:id");
            Measure.query({},function(measures){
                measures.forEach(function(m){
                    $scope.chartConfig.series[0].data.push([m.id,m.value]);
                    $scope.chartConfig.series[1].data.push([m.id,m.value-2]);
                });
            });
        }]);


