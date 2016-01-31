// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .path: Path to web server base directory {String|Array}
// .opts: options to pass to browserSync {Object}

// Packages
// =============================================================================
var browserSync = require('browser-sync');

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    var defaults = {
        injectChanges  : true,
        logLevel       : 'warn',
        logFileChanges : false,
        notify         : false,
        open           : false,
        reloadOnRestart: true,
        files          : [
            config.path + '**/*.html',
            config.path + '**/*.css',
            config.path + '**/*.js',
            config.path + '**/*.{gif,jpg,png,svg,webp}'
        ],
        server         : {
            baseDir    : config.path,
            directory  : false
        }
    };

    var options = !!config.opts ? Object.assign({}, defaults, config.opts) : defaults;

    return function() {
        return browserSync(options);
    };
};
