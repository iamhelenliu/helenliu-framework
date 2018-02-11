var gulp 					= require('gulp'),
		clean       	= require('gulp-clean'),
		path          = require('path'),
		sass 					= require('gulp-sass'),
		autoprefixer 	= require('gulp-autoprefixer')
		uglify      	= require('gulp-uglify'),
		pump        	= require('pump'),
		rename      	= require('gulp-rename'),
		sourcemaps    = require('gulp-sourcemaps'),
		notify      	= require('gulp-notify'),
		fileinclude   = require('gulp-file-include'),
		browserSync 	= require('browser-sync').create();

var paths = {
  sass: 		'src/scss',
  fonts: 		'src/fonts',
  images: 	'src/img',
  js: 			'src/js',
  templates:'src/templates'
};

// ---------------------------------------------------------------
// 	Clean
//	Clean out foldrs in app
//	https://www.npmjs.com/package/gulp-clean
// ---------------------------------------------------------------

gulp.task('clean', function() {
  return gulp.src(['app'], {read: false})
    .pipe(clean())
    .pipe(notify({ message: 'Folder cleanout complete' }));
});

// ---------------------------------------------------------------
//	Sass
//	Compiles Sass
//	https://www.npmjs.com/package/gulp-sass
// ---------------------------------------------------------------

gulp.task('sass', function () {
  return gulp.src(path.join(paths.sass, '**/*.scss'))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
	    }))
    .pipe(sourcemaps.init())
    .pipe(rename({dirname: ''})) // removes additional folders from 'src'
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(gulp.dest('../helenliu-site/themes/helenliu-2018/static/css')) // Copies to Hugo site theme helenliu-2018
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Sass successfully compiled' }));
});

// ---------------------------------------------------------------
// 	Scripts
//	Concatenates and minifies scripts
// ---------------------------------------------------------------

gulp.task('scripts', function(cb) {
  pump([
      gulp.src(path.join(paths.js, '*')),
      uglify(),
      rename({suffix: '.min'}),
      gulp.dest('app/assets/js'),
      gulp.dest('../helenliu-site/themes/helenliu-2018/static/js'), // Copies to Hugo site theme helenliu-2018
      notify({ message: 'Javascript successfully minified' })
    ],
    cb
  );
});

// ---------------------------------------------------------------
// 	Images
//	Copies images from src to app
// ---------------------------------------------------------------

gulp.task('images', function() {
  gulp.src(path.join(paths.images, '*'))
    .pipe(gulp.dest('app/assets/img'))
    .pipe(gulp.dest('../helenliu-site/themes/helenliu-2018/static/img')) // Copies to Hugo site theme helenliu-2018
    .pipe(notify({ message: 'Images updated' }));
});

// ---------------------------------------------------------------
// 	Fonts
//	Copies images from src to app
// ---------------------------------------------------------------

gulp.task('fonts', function() {
  gulp.src(path.join(paths.fonts, '*'))
    .pipe(gulp.dest('app/assets/fonts'))
    .pipe(gulp.dest('../helenliu-site/themes/helenliu-2018/static/fonts')) // Copies to Hugo site theme helenliu-2018
    .pipe(notify({ message: 'Fonts updated' }));
});

// ---------------------------------------------------------------
// Pages + includes
// https://www.npmjs.com/package/gulp-file-include
// ---------------------------------------------------------------

gulp.task('fileinclude', function() {
  return gulp.src(path.join(paths.templates, '**/*.tpl.html'))
    .pipe(fileinclude())
    .pipe(rename({
      extname: ""
     }))
    .pipe(rename({
      extname: ".html"
     }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'HTML files updated' }));
});

// ---------------------------------------------------------------
// 	BrowserSync
//	https://browsersync.io
// ---------------------------------------------------------------

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
});

// ---------------------------------------------------------------
// Default
// ---------------------------------------------------------------

gulp.task('default', ['clean'], function() {
  gulp.start(['sass', 'scripts', 'images', 'fonts', 'fileinclude'], 'watch')
});

// ---------------------------------------------------------------
// Watch
// ---------------------------------------------------------------

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/img/**', ['images']);
  gulp.watch('src/fonts/**', ['fonts']);
  gulp.watch('src/**/*.html', ['fileinclude']);
});