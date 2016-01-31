// Packages
// =============================================================================
var gulp        = require('gulp'),
    message     = require('./message'),
    runSequence = require('run-sequence');

// Helpers
// =============================================================================
// Creates a task stub for use when task creation fails
var createTaskStub = function(taskName, fn) {
    fn();

    gulp.task(taskName, function() {
        fn();
    });
};

// Exports
// =============================================================================
// Generate gulp tasks from an ordered task list and a configuration object
module.exports = function(taskConfig, libPath, $) {
    // Stored list of created tasks fir reference
    // Used to prevent duplicate tasks when referencing existing tasks in task list
    var createdTasks = [];

    // Loop top-level keys in task list to create main tasks
    Object.keys(taskConfig).forEach(function(mainKey) {
        var mainTaskConfig  = taskConfig[mainKey].config || false,
            mainTaskWatch   = taskConfig[mainKey].watch === false ? false : true,
            subTaskList     = taskConfig[mainKey].tasks || [],
            subTaskOrder    = taskConfig[mainKey].order || [],
            watchPaths      = {};

        // Subtasks
        // ---------------------------------------------------------------------
        // Create a flattened subtask list to iterate over
        // Ex: ['task1', ['task2', 'task3']] becomes ['task1', 'task2', 'task3']
        var subTaskFlatList = [].concat.apply([], subTaskOrder);

        // Create a list of all subtasks found in 'order' and 'task' lists
        var subTasks = subTaskFlatList.concat(subTaskList);

        // Loop subtasks and create gulp tasks using 'maintask-subtask' convention
        // Ex: { main: ['task1', 'task2'] } creates gulp tasks 'main-task1' and 'main-task2'
        subTasks.forEach(function(subKey) {
            // Ensure subtask is not a previously generated task
            // This scenario is possible when reusing tasks in the task list
            if (createdTasks.indexOf(subKey) === -1) {
                var subConfig = mainTaskConfig ? mainTaskConfig[subKey] : false,
                    taskName  = mainKey + '-' + subKey;

                // Ensure configuration exists
                if (!subConfig) {
                    // Create task stub
                    createTaskStub(taskName, function(){
                        message({
                            title  : 'Error',
                            message: 'Unable to create task "' + taskName + '" (configuration not available at ' + mainKey + '.' + subKey + ')',
                            console: 'error'
                        });
                    });
                }
                else {
                    var taskFile = subConfig.lib ? libPath + subConfig.lib : libPath + subKey;

                    try  {
                        // Create subtask
                        gulp.task(taskName, require(taskFile)(gulp, subConfig, $));

                        // Store watch paths
                        if (subConfig.watch) {
                            watchPaths[taskName] = subConfig.watch;
                        }
                    }
                    catch(err) {
                        // Create task stub
                        createTaskStub(taskName, function(){
                            message({
                                title  : 'Error',
                                message: err.message + ' (' + err.code + ')',
                                console: 'error'
                            });
                        });
                    }
                }

                // Store task name
                createdTasks.push(taskName);
            }
        });

        // Watch tasks
        // ---------------------------------------------------------------------
        // Loop watch configuration and create watch task for main task
        // Ex: gulp.task('main-watch', ...)
        var watchTaskName = mainKey + '-' + 'watch';

        if (Object.keys(watchPaths).length > 0) {
            // Main watch task
            gulp.task(watchTaskName, function() {
                Object.keys(watchPaths).forEach(function(watchKey) {
                    // Subtask watch tasks
                    gulp.watch(watchPaths[watchKey], [watchKey]);
                });

                // Display message indicating watch task has started
                console.log('\n * Watch task started: ' + watchTaskName + '\n');
            });

            // Store task name
            createdTasks.push(watchTaskName);
        }

        // Main tasks
        // ---------------------------------------------------------------------
        // Convert task list object to task array for use with run-sequence
        // Ex: { main: ['task1', ['task2', 'task3']] } becomes ['main-task1', ['main-task2', 'main-task3']]
        var taskSequence = subTaskOrder.map(function(task) {
            if (task instanceof Array) {
                return task.map(function(task) {
                    return (createdTasks.indexOf(task) === -1 ? mainKey + '-' + task : task);
                });
            }
            else {
                return (createdTasks.indexOf(task) === -1 ? mainKey + '-' + task : task);
            }
        });

        // Add watch task to task sequence
        if (mainTaskWatch && createdTasks.indexOf(watchTaskName) !== -1) {
            taskSequence.push(watchTaskName);
        }

        // Create main task
        // Ex: { main: ['task1', 'task2'] } creates gulp task 'main' with ordered subtasks 'main-task1' and 'main-task1'
        gulp.task(mainKey, function(callback) {
            // Add callback to task sequence if it exists
            if (callback) {
                taskSequence.push(callback);
            }
            // Use apply to pass array as arguments to run-sequence
            runSequence.apply(null, taskSequence);
        });

        // Store task name
        createdTasks.push(mainKey);
    });
};
