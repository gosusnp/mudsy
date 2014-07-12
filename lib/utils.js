module.exports = function() {
    "use strict";

    var my = {};

    my.trimString = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    return my;
};
