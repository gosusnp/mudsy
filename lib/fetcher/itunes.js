module.exports = function(request, cheerio) {
    "use strict";

    request = request || require('request');
    cheerio = cheerio || require('cheerio');

    var BASEURL = 'https://itunes.apple.com';

    var buildSimilarUrl = function(name) {
        return BASEURL + '/search/?media=music&entity=musicArtist&term=' + name.replace(/ +/g, '+');
    };

    var ItunesFetcher = function() {
    };

    ItunesFetcher.prototype.fetchSimilar = function(name, callback) {
        var endpoint = buildSimilarUrl(name);

        request.get({url: endpoint}, function(err, resp, body) {
            if (err)
                return callback(err);

            var searchResults = JSON.parse(body),
                result = searchResults.results[0];

            request.get({url: result.artistLinkUrl}, function(err, resp, body) {
                if (err)
                    return callback(err);

                var similar = [];
                var $ = cheerio.load(body, {normalizeWhitespace: true});
                $('li > a', $('#left-stack')).filter(function() {
                    var artist = {};
                    var data = $(this);

                    artist.name = data.text();
                    artist.link = data.attr('href');
                    artist.score = data.closest('div').attr('metrics-loc').split('_')[1];
                    artist.source = 'iTunes';

                    similar.push(artist);
                });

                callback(null, similar);
            });
        });
    };

    return ItunesFetcher;
};
