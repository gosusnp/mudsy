module.exports = function(request, mr, fetcher) {
    "use strict";

    request = request || require('request');
    fetcher = fetcher || require('./fetcher')(request);
    mr = mr || require('./mr')();

    var findSimilar = function(search, callback) {
        var __fetcher = function(source, Fetcher) {
            return function(callback) {
                var f = new Fetcher();
                f.fetchSimilar(search, function(err, data) {
                    console.log(source + ': ' + data.length);
                    callback(data);
                });
            }
        };

        mr.mapred({
            streams: [
                new mr.Streamify(__fetcher('AllMusic', fetcher.AllMusicFetcher)),
                new mr.Streamify(__fetcher('iTunes', fetcher.ItunesFetcher)),
                new mr.Streamify(__fetcher('Jango', fetcher.JangoFetcher)),
                new mr.Streamify(__fetcher('LastFM', fetcher.LastFmFetcher)),
                //new mr.Streamify(__fetcher('MTV', fetcher.MtvFetcher)),
                new mr.Streamify(__fetcher('SongKick', fetcher.SongKickFetcher)),
            ],
            map: function(value, emit) {
                var result = {};
                if (value && value.name) {
                    result[value.name] = [value];
                };
                emit([result]);
            },
            reduce: function(acc, values) {
                if (acc.length === 0)
                    acc.push({});
                for (var i in values) {
                    var value = values[i];
                    for (var key in value) {
                        var searchKey = key.toLowerCase();
                        var list = acc[0][searchKey];
                        if (!list) {
                            list = acc[0][searchKey] = [];
                        }
                        list.push(value[key][0]);
                    }
                }
                return acc;
            },
            finalize: function(values) {
                var results = [];
                var i, j;
                for (i in values[0]) {
                    results.push(values[0][i]);
                }
                results.sort(function(lhs, rhs) {
                    if (lhs.length > rhs.length)
                        return -1;
                    else if (lhs.length < rhs.length)
                        return 1;
                    else
                        return 0;
                });

                callback(results);
            }
        });
    };

    return {
        findSimilar: findSimilar
    };
};
