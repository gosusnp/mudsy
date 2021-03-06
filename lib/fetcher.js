module.exports = function(request) {
    var fetcher = {},
        AllMusicFetcher = require('./fetcher/allmusic.js')(request),
        ItunesFetcher = require('./fetcher/itunes.js')(request),
        JangoFetcher = require('./fetcher/jango.js')(request),
        LastFmFetcher = require('./fetcher/lastfm.js')(request),
        MtvFetcher = require('./fetcher/mtv.js')(request),
        SimilarArtistFetcher = require('./fetcher/similarartist.js')(request),
        SongKickFetcher = require('./fetcher/songkick.js')(request);

    fetcher.AllMusicFetcher = AllMusicFetcher;
    fetcher.ItunesFetcher = ItunesFetcher;
    fetcher.JangoFetcher = JangoFetcher;
    fetcher.LastFmFetcher = LastFmFetcher;
    fetcher.MtvFetcher = MtvFetcher;
    fetcher.SimilarArtistFetcher = SimilarArtistFetcher;
    fetcher.SongKickFetcher = SongKickFetcher;

    return fetcher;
};
