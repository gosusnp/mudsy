module.exports = function(request) {
    var fetcher = {},
        AllMusicFetcher = require('./fetcher/allmusic.js')(request),
        ItunesFetcher = require('./fetcher/itunes.js')(request),
        LastFmFetcher = require('./fetcher/lastfm.js')(request);

    fetcher.AllMusicFetcher = AllMusicFetcher;
    fetcher.ItunesFetcher = ItunesFetcher;
    fetcher.LastFmFetcher = LastFmFetcher;

    return fetcher;
};
