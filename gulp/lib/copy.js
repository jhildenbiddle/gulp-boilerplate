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
// .repl: String replacement patterns {Object}

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    // Base directory
    var baseConfig = config.base ? { base: config.base } : {};

    return function() {
        return gulp.src(config.src, baseConfig)
            .pipe($.changed(config.dest))
            // String replacement
            .pipe($.if(!!config.repl,
                $.replaceTask(config.repl)
                .on('error', $.notify.onError('Replace: <%= error.message %>'))
            ))
            .pipe(gulp.dest(config.dest));
    };
};
