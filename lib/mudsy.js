module.exports = function(request, fetcher) {
    "use strict";

    request = request || require('request');
    fetcher = fetcher || require('./fetcher')(request);

    var findSimilar = function(search, callback) {
        var __fetcher = function(source, Fetcher) {
            return function(callback) {
                process.nextTick(function() {
                    var f = new Fetcher();
                    f.fetchSimilar(search, function(err, data) {
                        console.log(source + ': ' + (data ? data.length : 0));
                        callback(err, data);
                    });
                });
            }
        };

        var fetchers = [
            __fetcher('AllMusic', fetcher.AllMusicFetcher),
            __fetcher('iTunes', fetcher.ItunesFetcher),
            __fetcher('Jango', fetcher.JangoFetcher),
            __fetcher('LastFM', fetcher.LastFmFetcher),
            __fetcher('SimilarArtist', fetcher.SimilarArtistFetcher),
            __fetcher('SongKick', fetcher.SongKickFetcher),
        ];
        var results = [];

        var formatResults = function(results) {
            var index = {};

            for (var i = 0; i < results.length; ++i) {
                for (var j = 0; j < results[i].length; ++j) {
                    var value = results[i][j];
                    var key = value.name.toLowerCase();

                    var similar = index[key];
                    if (!similar) {
                        similar = index[key] = [];
                    }
                    similar.push(value);
                }
            }

            var finalResults = [];
            for (var i in index) {
                finalResults.push(index[i]);
            }
            finalResults.sort(function(lhs, rhs) {
                if (lhs.length > rhs.length)
                    return -1;
                else if (lhs.length < rhs.length)
                    return 1;
                else
                    return 0;
            });
            callback(finalResults);
        };

        for (var i = 0; i < fetchers.length; ++i) {
            fetchers[i](function(err, artists) {
                artists = artists || [];
                results.push(artists);
                if (results.length == fetchers.length) {
                    formatResults(results);
                }
            });
        }
    };

    return {
        findSimilar: findSimilar
    };
};
