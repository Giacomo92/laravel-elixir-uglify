let gulp         = require('gulp');
let gulpFilter   = require('gulp-filter');
let uglify       = require('gulp-uglify');
let elixir       = require('laravel-elixir');
let config       = elixir.config;
var gutil = require('gulp-util');

/**
 * Uglify javascript files, useful when using scripts loaded asynchronously
 * @param  {string}        src        The files to uglify
 * @param  {string|object} outputPath The output path, or an options object
 * @param  {string|object} baseDir    The dir in wich to look for js files, or an options object
 * @param  {object}        options    The options object passed to the uglify task
 */
elixir.extend('uglify', function(src, outputPath, baseDir, options) {
    // If the options object was provided on the outputPath parameter
    if (typeof outputPath == 'object') {
        options = outputPath;
        outputPath = null;
    }

    // If the options object was provided on the baseDir parameter
    if (typeof baseDir == 'object') {
        options = baseDir;
        baseDir = null;
    }

    // Parse the source and output paths
    var paths = new elixir.GulpPaths()
        .src(src, baseDir || config.get('assets.js.folder'))
        .output(outputPath || config.get('public.js.outputFolder'));

    options = typeof options == 'undefined' ? {} : options;

    new elixir.Task('uglify', function() {
        var filter  = gulpFilter(['**/*', '!**/*.min.js']);
        var uglifyOptions = options;

        return gulp.src(paths.src.path)
            .pipe(filter)
            .pipe(uglify(uglifyOptions))
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
            .pipe(gulp.dest(paths.output.path))
            .pipe(new elixir.Notification().message('Uglified!'));
    })
    // Register watcher for source path
        .watch(paths.src.path);

});
