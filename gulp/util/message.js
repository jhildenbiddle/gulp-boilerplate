// Packages
// =============================================================================
var gulp     = require('gulp'),
    notifier = require('node-notifier');

// Exports
// =============================================================================
// Displays message as notifcation and console output
module.exports = function(options) {
    var defaults = {
        title  : 'Notification',
        message: '',
        console: true,
        notify : true
    };

    // Convert string argument to object
    if (!(options instanceof Object)) {
        options = { message: options };
    }

    // Merge defaults with options
    options = Object.assign({}, defaults, options);

    // Console colors
    var colors = {
        reset     : '\x1b[0m',
        // Effects
        bright    : '\x1b[1m',
        dim       : '\x1b[2m',
        underscore: '\x1b[4m',
        blink     : '\x1b[5m',
        reverse   : '\x1b[7m',
        hidden    : '\x1b[8m',
        // Foreground
        fBlack   : '\x1b[30m',
        fRed     : '\x1b[31m',
        fGreen   : '\x1b[32m',
        fYellow  : '\x1b[33m',
        fBlue    : '\x1b[34m',
        fMagenta : '\x1b[35m',
        fCyan    : '\x1b[36m',
        fWhite   : '\x1b[37m',
        // Background
        bBlack   : '\x1b[40m',
        bRed     : '\x1b[41m',
        bGreen   : '\x1b[42m',
        bYellow  : '\x1b[43m',
        bBlue    : '\x1b[44m',
        bMagenta : '\x1b[45m',
        bCyan    : '\x1b[46m',
        bWhite   : '\x1b[47m'
    },
    consoleColor;

    // Notification
    if (options.notify) {
        notifier.notify({
            title  : options.title,
            message: options.message
        });
    }

    // Console
    if (options.console) {
        switch(options.console) {
            case 'error':
                consoleColor = colors.fRed;
                break;
            case 'info':
                consoleColor = colors.fCyan;
                break;
            case 'log':
                consoleColor = colors.reset;
                break;
            case 'warn':
                consoleColor = colors.fYellow;
                break;
            default:
                options.console = 'log';
                consoleColor    = colors.reset;
        }

        console[options.console]([
            consoleColor,
            '\n * ',
            options.title + ': ',
            options.message,
            '\n',
            colors.reset
        ].join(''));
    }
};
