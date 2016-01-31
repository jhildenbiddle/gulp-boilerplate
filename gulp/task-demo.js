// Data
// =============================================================================
var demo = {
        dest     : './_demo/',
        src      : './src/',
        templates: './src/templates/'
    };

// Exports
// =============================================================================
module.exports = {
    browsersync: {
        path: demo.dest
    },
    clean: {
        path: demo.dest
    },
    'copy-static': {
        lib : 'copy',
        src : demo.src + 'assets/static/**/*',
        dest: demo.dest + 'assets/',
        get watch() { return this.src; }
    },
    'html-hbs': {
        lib     : 'handlebars',
        src     : demo.templates + 'pages/**/*.hbs',
        dest    : demo.dest,
        ext     : 'html',
        data    : demo.templates + 'data/**/*.{js,json}',
        helpers : demo.templates + 'helpers/*.js',
        partials: demo.templates + 'partials/**/*.hbs',
        get watch() {
            return [
                this.src,
                this.data,
                this.helpers,
                this.partials
            ];
        }
    },
    images: {
        src : demo.src + 'assets/images/**/*',
        dest: demo.dest + 'assets/images',
        get watch() { return this.src; }
    },
    'js-main': {
        lib  : 'browserify',
        src  : demo.src + 'assets/js/main.js',
        dest : demo.dest + 'assets/js/',
        file : 'main.js',
        watch: [
            demo.src + 'assets/js/*',
            demo.src + 'assets/js/lib/*'
        ]
    },
    'js-vendor': {
        lib : 'js',
        src : demo.src + 'assets/js/vendor/*.js',
        dest: demo.dest + 'assets/js/',
        file: 'vendor.js',
        hint: false,
        maps: false,
        get watch() { return this.src; }
    },

    // Style
    // -------------------------------------------------------------------------
    'css': {
        lib   : 'style',
        src   : demo.src + 'assets/css/*.css',
        dest  : demo.dest + 'assets/css/',
        minify: true,
        get watch() { return this.src; }
    },
    'less': {
        lib   : 'style',
        lang  : 'less',
        src   : [
            demo.src + 'assets/less/*.less',
            '!' + demo.src + 'assets/less/_*.less'
        ],
        dest  : demo.dest + 'assets/css/',
        minify: true,
        watch : demo.src + 'assets/less/**/*.less'
    },
    'postcss': {
        lib    : 'style',
        src    : demo.src + 'assets/postcss/*.{css,pcss,postcss}',
        dest   : demo.dest + 'assets/css/',
        plugins: [
            // require('postcss-plugin1'),
            // require('postcss-plugin2')({ key: value }),
            function(css) {
                // Demo plugin (prepends comment to all declarations)
                css.walkRules(function(rule) {
                    rule.prepend(
                        { text: 'Processed using PostCSS' }
                    );
                });
            }
        ],
        minify : true,
        watch  : demo.src + 'assets/postcss/**/*'
    },
    'sass': {
        lib   : 'style',
        lang  : 'sass',
        src   : demo.src + 'assets/sass/*.{sass,scss}',
        dest  : demo.dest + 'assets/css/',
        minify: true,
        watch : demo.src + 'assets/sass/**/*.{sass,scss}'
    },
    'stylus': {
        lib   : 'style',
        lang  : 'stylus',
        src   : [
            demo.src + 'assets/stylus/*.{styl,stylus}',
            '!' + demo.src + 'assets/stylus/_*.{styl,stylus}'
        ],
        dest  : demo.dest + 'assets/css/',
        minify: true,
        watch : demo.src + 'assets/stylus/**/*'
    },

    // SassDoc
    // -------------------------------------------------------------------------
    sassdoc: {
        src : demo.src + 'assets/sass/**/*.{sass,scss}',
        dest: demo.dest + 'sassdoc',
        get watch() { return this.src; }
    },
};
