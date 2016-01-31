// Data
// =============================================================================
var bump = {
        dest: './',
        src : './*.json'
    };

// Exports
// =============================================================================
module.exports = {
    'beta': {
        lib  : 'bump',
        src  : bump.src,
        dest : bump.dest,
        preid: 'beta',
        type : 'prerelease'
    },
    'major': {
        lib  : 'bump',
        src  : bump.src,
        dest : bump.dest,
        type : 'major'
    },
    'minor': {
        lib  : 'bump',
        src  : bump.src,
        dest : bump.dest,
        type : 'minor'
    },
    'patch': {
        lib  : 'bump',
        src  : bump.src,
        dest : bump.dest,
        type : 'patch'
    }
};
