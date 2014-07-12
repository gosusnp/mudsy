(function() {
    "use strict";

    var urlFileMapping = {
        'http://www.allmusic.com/search/typeahead/artist/the+glitch+mob': {
            file: 'allmusic.glitchmob.search.html'
        },
        'http://www.allmusic.com/artist/the-glitch-mob-mn0002113374': {
            file: 'allmusic.glitchmob.artist.html'
        },
    };
    var RequestMock = require('./requestmock')(),
        fetcher = require('../../lib/fetcher')(new RequestMock(urlFileMapping));

    describe("fetcher.allmusic", function() {
        var allMusicFetcher = new fetcher.AllMusicFetcher();

        it("fetchSimilar", function(done) {
            allMusicFetcher.fetchSimilar('the glitch mob', function(err, data) {
                expect(err).toBe(null);

                expect(data.length).toBe(6);
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
