(function() {
    "use strict";

    var app = angular.module('mudsy', [
        'ngAnimate',
        'ui.router'
    ]);

    app.factory('Mudsy', [
        '$http',
        '$q',
        function($http, $q) {
            var Mudsy = {};
            Mudsy.searchSimilar = function(query) {
                var deferred = $q.defer();

                $http.get('/api/artists/similar?q=' + query.replace(/ +/g, '+'))
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            };
            return Mudsy;
        }
    ]);

    app.controller('MudsyArtistsCtrl', [
        '$scope',
        '$state',
        'Mudsy',
        function($scope, $state, Mudsy) {
            $scope.loadPlayer = function() {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementById('player');
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = function() {
                    var player = new YT.Player('player', {
                        events: {
                            'onReady': function(event) {
                                player.cuePlaylist({
                                    listType: 'search',
                                    list: $state.params.name,
                                });
                            },
                        }
                    });
                };

                tag.onload = tag.onreadystatechange = function() {
                    // Hack because it seems that it is not properly reloaded on route change
                    if (YT && YT.Player) {
                        onYouTubeIframeAPIReady();
                    }
                };
            };

            $scope.search = function(query) {
                query = query || $scope.query;
                $state.go('mudsy.artists', {name: query}, {reload: true});
            };

            $scope.peek = function(index) {
                var element = $scope.similar[index];
                if (element.showSimilar) {
                    element.showSimilar = false;
                } else {
                    if (!element.similar) {
                        element.fetching = true;
                        var artistName = element.sources[0].name;
                        Mudsy.searchSimilar(artistName)
                        .then(function(data) {
                            var similar = [];
                            for (var i = 0; i < data.length; ++i) {
                                similar.push({sources: data[i]});
                            }
                            element.similar = similar;
                            element.fetching = false;
                        }, function(error) {
                            element.showSimilar = false;
                            element.fetching = false;
                        });
                    }
                    element.showSimilar = true;
                }
            };

            if ($state.params.name) {
                $scope.loadPlayer();
                $scope.query = $state.params.name;
                $scope.fetching = true;
                Mudsy.searchSimilar($state.params.name)
                .then(function(data) {
                    $scope.fetching = false;
                    var similar = [];
                    for (var i = 0; i < data.length; ++i) {
                        similar.push({sources: data[i]});
                    }
                    $scope.similar = similar;
                }, function(error) {
                    $scope.fetching = false;
                    $scope.similar = null;
                });
            }
        }
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/mudsy/artists/');

        $stateProvider
        .state('mudsy', {
            url: '/mudsy',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('mudsy.artists', {
            url: '/artists/:name',
            controller: 'MudsyArtistsCtrl',
            templateUrl: '/assets/views/mudsy.html'
        })
        ;
    }]);
}());
