// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src    : Path(s) to source file(s) to process
// .dest   : Path to destination directory for output file(s)
//
// Optional
// -----------------------------------------------------------------------------
// .lang   : CSS propecessor to use {'less'|'sass'|'stylus'}
// .opts   : Options to pass to Less/Sass/Stylus compiler {Object}
// .maps   : Output source map for minified js {Boolean} [true]
// .minify : Output minified {Boolean} [true]
// .repl   : String replacement patterns {Object}
// .plugins: Array of postcss plugins (functions) with or w/o options {Array}

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    // Default import paths for compilers
    var importPaths = [
        './bower_components/',
        './node_modules/'
    ];

    // Only process source maps for minified output
    var maps = config.minify !== false && config.maps !== false ? true : false;

    // Default task options
    var options = {
        autoprefixer: {
            browsers: ['last 2 versions'],
            cascade : false
        },
        less: Object.assign({
            paths      : importPaths,
            strictMath : true,
            strictUnits: true
        }, config.opts || {}),
        minify: {
        },
        sass: Object.assign({
            includePaths   : importPaths,
            errLogToConsole: true,
            outputStyle    : 'expanded'
        }, config.opts || {}),
        stylus: Object.assign({
            include: importPaths
        }, config.opts || {})
    };

    return function() {
        return gulp.src(config.src)
            // String replacement
            .pipe($.if(!!config.repl,
                $.replaceTask(config.repl)
            ))
            // Source maps (init)
            .pipe($.if(maps,
                $.sourcemaps.init()
            ))
            // Less
            .pipe($.if(config.lang === 'less',
                $.less(options.less)
                .on('error', $.notify.onError('Less: <%= error.message %>'))
            ))
            // Sass
            .pipe($.if(config.lang === 'sass',
                $.sass(options.sass)
                .on('error', $.notify.onError('Sass: <%= error.message %>'))
            ))
            // Stylus
            .pipe($.if(config.lang === 'stylus',
                $.stylus(options.stylus)
                .on('error', $.notify.onError('Stylus: <%= error.message %>'))
            ))
            // PostCSS
            .pipe(
                $.postcss(config.plugins || [])
                .on('error', $.notify.onError('PostCSS: <%= error.message %>'))
            )
            // Rename (for PostCSS)
            .pipe($.rename({extname: '.css'}))
            // Autoprefixer
            .pipe($.autoprefixer(options.autoprefixer))
            // Minify
            .pipe($.if(config.minify !== false,
                $.cssnano(options.minify)
            ))
            // Source maps (write)
            .pipe($.if(maps,
                $.sourcemaps.write('./maps')
            ))
            .pipe(gulp.dest(config.dest));
    };
};
