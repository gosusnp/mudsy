(function() {
    "use strict";

    var fetcher = require('../lib/fetcher')(),
        mr = require('../lib/mr')();

    var search = process.argv.slice(2).join(' ');
    if (!search.length) {
        console.log('missing search arguments');
        return;
    }

    mr.mapred({
        streams: [
            new mr.Streamify(function(callback) { var f = new fetcher.AllMusicFetcher(); f.fetchSimilar(search, function(err, data) { callback(data); }); }),
            new mr.Streamify(function(callback) { var f = new fetcher.ItunesFetcher(); f.fetchSimilar(search, function(err, data) { callback(data); }); }),
            new mr.Streamify(function(callback) { var f = new fetcher.JangoFetcher(); f.fetchSimilar(search, function(err, data) { callback(data); }); }),
            new mr.Streamify(function(callback) { var f = new fetcher.LastFmFetcher(); f.fetchSimilar(search, function(err, data) { callback(data); }); }),
            new mr.Streamify(function(callback) { var f = new fetcher.SongKickFetcher(); f.fetchSimilar(search, function(err, data) { callback(data); }); }),
        ],
        map: function(value, emit) {
            var result = {};
            result[value.name] = [value];
            emit([result]);
        },
        reduce: function(acc, values) {
            if (acc.length === 0)
                acc.push({});
            for (var i in values) {
                var value = values[i];
                for (var key in value) {
                    var list = acc[0][key];
                    if (!list) {
                        list = acc[0][key] = [];
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

            for (i in results) {
                var result = results[i];
                var sources = [];
                for (j in result)
                    sources.push(result[j].source);
                console.log(result[0].name + '\t(' + result.length + ')\t[' + sources.join(',') + ']');
            }
        }
    });

}());
