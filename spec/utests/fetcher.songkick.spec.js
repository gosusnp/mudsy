(function() {
    "use strict";

    var urlFileMapping = {
        'http://www.songkick.com/search?page=1&per_page=1&type=artists&query=the+glitch+mob': {
            file: 'songkick.glitchmob.search.html'
        },
        'http://www.songkick.com/artists/604786-glitch-mob': {
            file: 'songkick.glitchmob.artist.html'
        },
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.songkick", function() {
        var songKickFetcher = new fetcher.SongKickFetcher();

        it("fetchSimilar", function(done) {
            songKickFetcher.fetchSimilar('the glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(10);
                for (var i in data) {
                    var similarArtist = data[i];
                    expect(similarArtist.name).toBeDefined();
                    expect(similarArtist.link).toBeDefined();
                    expect(similarArtist.img).toBeDefined();
                    expect(similarArtist.source).toBeDefined();
                }
                done();
            });
        });
    });
}());
