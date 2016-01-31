// Config Properties
// =============================================================================
// Required
// -----------------------------------------------------------------------------
// .src    : Path(s) to source file(s) to process {String|Array}
// .dest   : Path to destination directory for output file(s) {String}
//
// Optional
// -----------------------------------------------------------------------------
// .key    : The JSON key to bump {String} ['version']
// .preid  : The prerelease tag (Ex: 'beta' => '0.0.2-beta.0') {String} ['beta']
// .type   : Bump type {'major'|'minor'|'patch'|'prerelease'} ['patch']
// .version: Specific version to apply {Number}

// Exports
// =============================================================================
module.exports = function(gulp, config, $) {
    // Defaults
    var options = {
        preid: 'beta',
        type : 'patch'
    };

    // Get options from config (overrides defaults)
    ['key', 'preid', 'type', 'version'].forEach(function(val) {
        if (config[val]) {
            options[val] = config[val];
        }
    });

    return function() {
        return gulp.src(config.src)
            // Bump
            .pipe(
                $.bump(options)
                .on('error', $.notify.onError('Bump: <%= error.message %>'))
            )
            // Write
            .pipe(gulp.dest(config.dest));
    };
};
