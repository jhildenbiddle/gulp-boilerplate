// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src : Path(s) to source file(s) to process {String|Array}
// .dest: Path to destination directory for output file(s) {String}
//
// Optional
// -----------------------------------------------------------------------------
// .file  : Name of concatenated output file {String}
// .hint  : Lint using jshint {Boolean} [true]
// .minify: Output minified {Boolean} [true]
// .maps  : Output source map for minified js {Boolean} [true]
// .repl  : String replacement patterns {Object}

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    return function() {
        // Only process source maps for minified output
        var maps = config.minify !== false && config.maps !== false ? true : false;

        return gulp.src(config.src)
            // JShint
            .pipe($.if(config.hint !== false,
                $.jshint()
            ))
            .pipe($.if(config.hint !== false,
                $.jshint.reporter('jshint-stylish')
            ))
            // String replacement
            .pipe($.if(!!config.repl,
                $.replaceTask(config.repl)
                .on('error', $.notify.onError('Replace: <%= error.message %>'))
            ))
            // Source maps (init)
            .pipe($.if(maps,
                $.sourcemaps.init()
            ))
            // Concat
            .pipe($.if(!!config.file,
                $.concat(config.file)
                .on('error', $.notify.onError('Concat: <%= error.message %>'))
            ))
            // Minify
            .pipe($.if(config.minify !== false,
                $.uglify()
                .on('error', $.notify.onError('Uglify: <%= error.message %>'))
            ))
            // Source maps (write)
            .pipe($.if(maps,
                $.sourcemaps.write('./maps')
            ))
            // Write
            .pipe(gulp.dest(config.dest));
    };
};
