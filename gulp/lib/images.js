// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src : Path(s) to source file(s) to process {String|Array}
// .dest: Path to destination directory for output file(s) {String}
//
// Optional
// -----------------------------------------------------------------------------
// .base: Path to serve as root for copied files {String}

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    // Base directory
    var baseConfig = config.base ? { base: config.base } : {};

    return function() {
        return gulp.src(config.src, baseConfig)
            .pipe($.changed(config.dest))
            .pipe($.imagemin())
            .pipe(gulp.dest(config.dest));
    };
};
