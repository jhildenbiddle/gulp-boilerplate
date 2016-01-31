// Exports
// =============================================================================
// Ex: {{#repeat context start=1}}Item {{@index}}{{/repeat}}
module.exports = function(count, options) {
    var counter  = options.hash.start || 0,
        oldIndex = options.data.index || false,
        output   = '';

    while (count--) {
        options.data.index = counter;
        output += options.fn();
        counter++;
    }

    if (oldIndex !== false) {
        options.data.index = oldIndex;
    }
    else {
        delete options.data.index;
    }

    return output;
};
