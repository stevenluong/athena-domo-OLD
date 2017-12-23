'use strict';

var mainControllers = angular.module('mainControllers');

mainControllers.controller('tmpCtrl', ['$scope','$resource',
        function($scope,$resource) {
            var Measure = $resource("http://home.slapps.fr:3000/api/measures/:id");
            var data = [];
            Measure.query({type:"temperature"},function(measures){
                var lastMeasures = [20,20,20,20,20,20,20,20,20,20];
                var mean = 0;
                measures.forEach(function(m){
                    lastMeasures.shift();
                    lastMeasures.push(m.value);
                    var sum = 0
                    lastMeasures.forEach(function(lm){
                        sum = sum + lm;
                    });
                    mean = Math.round(sum/lastMeasures.length);
                    data.push([(new Date(m.at)).getTime()+60*60*1000,mean]);
                });
                Highcharts.stockChart('container', {
                    rangeSelector: {
                        selected: 1
                    },
                    title: {
                        text: 'temperature bitches'
                    },
                    series: [{
                        name: 'today',
                        data: data,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
                });

            });
        }]);


