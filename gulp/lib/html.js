// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src : Path(s) to source file(s) to process {String|Array}
// .dest: Path to destination directory for output file(s) {String}
//
// Optional
// -----------------------------------------------------------------------------
// .repl: String replacement patterns {Object}
// .incl: Processing include statements in file(s) {Boolean}

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    return function() {
        return gulp.src(config.src)
            .pipe($.changed(config.dest))
            // String replacement
            .pipe($.if(!!config.repl,
                $.replaceTask(config.repl)
                .on('error', $.notify.onError('Replace: <%= error.message %>'))
            ))
            // Includes
            .pipe($.if(config.inc === true,
                $.fileInclude({
                    prefix  : '@@',
                    basepath: '@file'
                })
                .on('error', $.notify.onError('Include: <%= error.message %>'))
            ))
            .pipe(gulp.dest(config.dest));
    };
};
