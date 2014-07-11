module.exports = function(request) {
    var fetcher = {},
        ItunesFetcher = require('./fetcher/itunes.js')(request),
        LastFmFetcher = require('./fetcher/lastfm.js')(request);

    fetcher.ItunesFetcher = ItunesFetcher;
    fetcher.LastFmFetcher = LastFmFetcher;

    return fetcher;
};
