module.exports = function(request) {
    var fetcher = {},
        LastFmFetcher = require('./fetcher/lastfm.js')(request);

    fetcher.LastFmFetcher = LastFmFetcher;

    return fetcher;
};
