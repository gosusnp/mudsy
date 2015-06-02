module.exports = function(request, NodeCache) {
	"use strict";

	request = request || require('request');
	NodeCache = NodeCache || require('node-cache');

	var cache = new NodeCache({stdTTL: 60 * 60 * 24, checkperiod: 0, useClones: false});

	var originalRequestGet = request.get;
	request.get = function(args, callback) {
		var url = args.url;
		if (url) {
			var cachedValue = cache.get(url);
			if (cachedValue) {
				callback(cachedValue.err, cachedValue.resp, cachedValue.body);
			} else {
				originalRequestGet(args, function(err, resp, body) {
					cache.set(url, {err: err, resp: resp, body: body});
					callback(err, resp, body);
				});
			}
		} else {
			originalRequestGet(args, callback);
		}
	};

	return request;
};
