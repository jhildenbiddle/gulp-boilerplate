;(function(window){
    'use strict';

    var demo = function demo() {
        console.log('Lib Loaded');
    };

    // EXPORT
	// =========================================================================
	var plugin = {
		name   : 'mylib',
		public : demo
	};

	// AMD
	if (typeof define === 'function' && define.amd) {
		define(plugin.public);
	}
	// CommonJS
	else if (typeof exports === 'object') {
		module.exports = plugin.public;
	}
	// Browser Global
	else {
		window[plugin.name] = plugin.public;
	}
})(window);
