// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src : Path(s) to source file(s) to process {String|Array}
// .dest: Path to destination directory for output file(s) {String}
// .file: Name of output file {String}
//
// Optional
// -----------------------------------------------------------------------------
// .maps: Output source maps {Boolean} [true]

// Packages
// =============================================================================
var browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    source     = require('vinyl-source-stream');

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    // Only process source maps for minified output
    var maps = config.minify !== false && config.maps !== false ? true : false;

    return function() {
        return browserify({
            entries: config.src,
            debug  : maps
        })
        .bundle()
        .pipe(source(config.file))
        .pipe(buffer())
        // Source maps (init)
        .pipe($.if(maps,
            $.sourcemaps.init({loadMaps: true})
        ))
        .pipe(
            $.uglify())
            .on('error', $.notify.onError('Uglify: <%= error.message %>')
        )
        // Source maps (write)
        .pipe($.if(maps,
            $.sourcemaps.write('./maps')
        ))
        .pipe(gulp.dest(config.dest));
    };
};
