// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src : Path(s) to source file(s) to process {String|Array}
// .dest: Path to destination directory for output file(s) {String}

// Packages
// =============================================================================
var sassdoc = require('sassdoc');

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    var options = {
        dest   : config.dest,
        display: {
          access: ['public']
        }
    };

    return function() {
        return gulp.src(config.src)
            .pipe(sassdoc(options));
    };
};
