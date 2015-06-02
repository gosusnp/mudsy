module.exports = function(request, nodeCache) {
	"use strict";

	request = request || require('request');
	nodeCache = nodeCache || require('node-cache');

	var cache = new nodeCache({stdTTL: 60 * 60 * 24, checkperiod: 0, useClones: false});

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
	}

	return request;
};