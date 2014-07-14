(function() {
    "use strict";

    var app = angular.module('mudsy', ['ngAnimate']);

    app.controller('MudsyCtrl', [
        '$scope',
        '$http',
        function($scope, $http) {
            $scope.query = 'the glitch mob';
            $scope.similar = null;

            $scope.search = function(query) {
                if (query) {
                    $scope.query = query;
                }
                $scope.fetching = true;
                $http.get('/api/artists/similar?q=' + $scope.query.replace(/ +/g, ' '))
                .success(function(data) {
                    $scope.similar = data;
                    $scope.fetching = false;
                    console.log(data);
                })
                .error(function(err) {
                    $scope.fetching = false;
                    $scope.similar = null;
                });
            };
        }
    ]);
}());
