## Gulp Boilerplate

**A simplified build system based on configuration objects and auto-generated tasks**

The purpose of this boilerplate is to simplify the process of creating new projects and reduce the amount of time spent managing build tasks. This is accomplished allowing all tasks, subtasks and watch tasks to be auto-generated based on configuration objects. Tasks can then be grouped and run sequentially or in parallel as needed.

------

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Auto-Generated Tasks](#auto-generated-tasks)
  - [Task List](#task-list)
  - [Task Configuration](#task-configuration)
  - [Task Runners](#task-runners)
- [Comments? Issues? Questions?](#comments-issues-questions)

------

## Introduction

The boilerplate comes with a demo task configured to use each of the included task runners. Additional task runners can be added easily by installing packages and creating new task runner files as needed.

The preconfigured task runners provide the following functionality:

- **HTML**
  - Compile static HTML using string replacement and file includes
  - Compile static HTML from [handlebars](http://handlebarsjs.com/) templates, helpers and partials
- **Images**
  - Optimize PNG, JPEG, GIF and SVG images
- **JavaScript**
  - Bundle and `require` modules using [Browserify](http://browserify.org/)
  - Generate source maps
  - Concatenate files
  - Minify using [UglifyJS](http://lisperator.net/uglifyjs/)
  - String replacement
  - Include files
  - Lint using [JSHint](http://jshint.com/)
- **Stylesheets**
  - Compile [Less](http://lesscss.org/), [PostCSS](https://github.com/postcss/postcss), [Sass](http://sass-lang.com/) and [Stylus](http://stylus-lang.com/)
  - Generate source maps
  - Minify using [cssnano](https://github.com/ben-eb/cssnano)
  - Parse CSS and add vendor prefixes to rules using [Autoprefixer](https://autoprefixer.github.io/)
  - String replacement
  - Auto-generated Sass documentation via [SassDoc](http://sassdoc.com/)
  - Best practice file- or directory-based structure
- **Server**
  - Local [Browsersync](https://www.browsersync.io/) development server
- **Test**
  - Create unit tests with [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/)
- **Misc**
  - Bump patch|minor|major or beta version number
  - Clean project build files and directories
  - Conditional processing in gulp tasks
  - Copy files
  - Deploy website to GitHub pages
  - List all auto-generated tasks

## Quick Start

1. Clone, download or fork this repository
2. Run `npm install` to install dependencies
3. Review the demo task list, configuration file and preconfigured task runners:
   - Demo task list in `gulpfile.js`
   - Demo task configuration file: `./gulp/task-demo.js`
   - Preconfigured task runners: `./gulp/lib/`
4. Run `gulp` to view a list of the main demo tasks
5. Run `gulp tasks` to view a list of all auto-generated demo tasks
6. Run `gulp dev` to view the demo

## Auto-Generated Tasks

Gulp tasks are configured and auto-generated based on the following:

- A unified [task list](#task-list)
  
  This list specifies the tasks to auto-generate and the order in which they are run.
  
- One or more [task configuration](#task-configuration) files
  
  These files contain the subtask configuration information used to auto-generate gulp tasks.
  
- [Task runners](#task-runners)
  
  These files contain the functions used to process files based on the configuration data for each task.

### Task List

The task list object is stored in the `gulpfile.js` file. This list specifies the tasks to create and the order in which they are run.

*Configure this object as needed for your project.*

``` javascript
var gulpTaskObj = {
    // Creates a main task named "build"
    build: {
        // File containing configuration data for each subtask below
        config: require('./gulp/task-build'),
        // The watch prop determines if a watch task should be automatically
        // added to order sequence. The watch task will still be generated, but in
        // this case it will not run as part of the build task.
        watch : false,
        // Order determines the subtask run sequence. Arrays of subtasks are run
        // in parallel. Subtasks not in arrays will be run sequentially.
        order : [
            // These tasks are in an array so they will run in parallel.
            [
                'html-handlebars',
                'images',
                'javascript',
                'sass',
                'sassdoc'
            ]
        ],
        // These tasks will be created but not run as part of the build task.
        // This allows these tasks to be run individually or with other main tasks.
        // In this case, we want the "browsersync" (server) and "clean" tasks to be
        // be available, but not run with "gulp build".
        tasks: [
            'browsersync',
            'clean'
        ]
    },
    // Creates a main task named "dev"
    // This task simply runs the "build" task, then starts the development server
    // and watch task.
    dev: {
        // This task is reusing main and subtasks tasks created above, so no config
        // file is needed.
        order: [
            // This task will be run first. When it completes...
            'build',
            // ... the following tasks will be run in parallel
            [
                 // Referenceing existing subtaasks is done using the
                 // maintask-subtask name convention
                'build-watch',
                'build-browsersync'
            ]
        ]
    },
    // Creates a main task named "clean"
    // The build clean task could also be called directly using "gulp build-clean",
    // but creating this task provides a simplfiied "gulp clean" task.
    clean: {
        order: [
            'build-clean'
        ]
    }
};
```

### Task Configuration

Task configuration files are located in the `./gulp/` directory. These files contain the subtask configuration information, which is used to auto-generate a gulp task based on the specified task runner.

The properties used for each subtask can be found in the corresponding task runner file located in the `./gulp/lib/` directory. The `lib` property is used to specify the associated task runner for the subtask. If the subtask name matches the task runner name, the `lib` property can be omitted.

*Configure these files as needed for your project.*

``` javascript
// File: ./gulp/task-build.js
// =========================================================
module.exports = {
    browsersync: {
        path: './build/'
    },
    clean: {
        path: './build/'
    },
    'html-handlebars': {
        lib     : 'handlebars',
        src     : './src/templates/pages/**/*.hbs',
        dest    : './build/',
        ext     : 'html',
        data    : './src/templates/data/**/*.{js,json}',
        helpers : './src/templates/helpers/*.js',
        partials: './src/templates/partials/**/*.hbs',
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
        src : './src/assets/images/**/*',
        dest: './build/assets/images',
        get watch() { return this.src; }
    },
    javascript: {
        lib  : 'browserify',
        src  : './src/assets/js/main.js',
        dest : './build/assets/js/',
        file : 'main.js',
        watch: './src/assets/js/**.*'
    },
    sass: {
        lib   : 'style',
        lang  : 'sass',
        src   : './src/assets/sass/*.{sass,scss}',
        dest  : './build/assets/css/',
        minify: true,
        watch : './src/assets/sass/**/*.{sass,scss}'
    },
    sassdoc: {
        src : './src/assets/sass/**/*.{sass,scss}',
        dest: './build/sassdoc',
        get watch() { return this.src; }
    },
};
```

### Task Runners

Task runners are located in the `./gulp/lib/` directory. These files contain the functions used to process files based on the configuration data for each task. Auto-generated tasks simply pass configuration data to the specified task runner each time the task is run.

A handful of task runners are preconfigured and ready for use. Extending the boilerplate with additional task runners is easily accomplished by adding a new task runner file to the `./gulp/lib/` directory and specifying its use by setting the `lib` property in a task configuration file.

Configuration properties used by each task runner can be found at the top of each task runner file located in the `./gulp/lib/` directory.

## Comments? Issues? Questions?

Create a [new issue](https://github.com/jhildenbiddle/gulp-boilerplate/issues) here on GitHub.