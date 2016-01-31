// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src : Path(s) to source file(s) to process {String|Array}
// .dest: Path to destination directory for output file(s) {String}
//
// Optional
// -----------------------------------------------------------------------------
// .repl    : String replacement patterns {Object}
// .incl    : Processing include statements in file(s) {Boolean}
// .ext     : Extension to apply to output file(s) {String}
// .data    : Handlebars data to pass to handlebars template(s) {String|Array|Object|Function}
// .helpers : Handlebars helpers {String|Array|Object|Function}
// .partials: Handlebars partials {String|Array|Object|Function}

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
            // Handlebars
            .pipe(
                $.hb({
                    bustCache: true,
                    data     : config.data,
                    helpers  : config.helpers,
                    partials : config.partials
                })
                .on('error', $.notify.onError('Handlebars: <%= error.message %>'))
            )
            // Rename
            .pipe($.if(!!config.ext,
                $.rename(function(path) {
                    path.extname = /^\./.test(config.ext) ? config.ext : '.' + config.ext;
                })
                .on('error', $.notify.onError('Rename: <%= error.message %>'))
            ))
            .pipe(gulp.dest(config.dest));
    };
};
