module.exports = function(stream, util) {
    "use strict";

    stream = stream || require('stream');
    util = util || require('util');

    var mr = {};

    var StreamReader = function(emit) {
        stream.Writable.call(this, {objectMode: true});
        this._emit = emit;
    };
    util.inherits(StreamReader, stream.Writable);
    StreamReader.prototype._write = function(data, encoding, done) {
        this._emit(data);
        done();
    };

    var Streamify = function(data) {
        stream.Readable.call(this, {objectMode: true});
        this.data = data;
        var streamify = this;
        process.nextTick(function() {
            if (typeof streamify.data === 'function') {
                var parent = streamify;
                streamify.data(function(data) {
                    if (data instanceof Array) {
                        for (var i in data) {
                            parent.push(data[i]);
                        }
                    } else {
                        parent.push(data);
                    }
                    parent.push(null);
                });
            } else {
                if (streamify.data instanceof Array) {
                    for (var i in streamify.data) {
                        streamify.push(streamify.data[i]);
                    }
                } else {
                    streamify.push(streamify.data);
                }
                streamify.push(null);
            }
        });
    };
    util.inherits(Streamify, stream.Readable);
    Streamify.prototype._read = function() {};

    var mapred = function(args) {
        var activeStreams = 0,
            streams = args.streams || [],
            map = args.map || function(value, emit) { emit([value]); },
            reduce = args.reduce || function(acc, values) {
                for (var i in values)
                    acc.push(values[i]);
                return acc;
            },
            finalize = args.finalize,
            result = [];

        var onStreamEnd = function() {
            --activeStreams;
            if (!activeStreams)
                finalize(result);
        };
        var streamReaderCallback = function(value) {
            map(value, function(values) {
                result = reduce(result, values);
            });
        };

        for (var i in streams) {
            var s = streams[i];
            ++activeStreams;
            s.on('end', onStreamEnd);

            var r = new StreamReader(streamReaderCallback);
            s.pipe(r, {end: false});
        }
    };

    mr.mapred = mapred;
    mr.Streamify = Streamify;

    return mr;
};
