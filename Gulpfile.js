var gulp = require('gulp')
var sass = require('gulp-sass')
var concat = require('gulp-concat')
var cssnano = require('gulp-cssnano')
var postcss = require('gulp-postcss')
var uncss = require('postcss-uncss')
var panini = require('panini')
var webpack = require('webpack')
var sourcemaps = require('gulp-sourcemaps')
var del = require('del')
var browserSync = require('browser-sync').create()

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded',
	includePaths: ['./node_modules/bootstrap/scss/']
}

var stylePaths = [
	'./src/styles/app.scss'
]

gulp.task('styles', function() {
	var plugins = [
        uncss({
            html: ['./dist/index.html']
        })
    ]
	return gulp.src(stylePaths)
		.pipe(concat('styles.scss'))
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(cssnano())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
})

gulp.task('html', function() {
	gulp.src('./src/html/pages/**/*.html')
		.pipe(panini({
			root: 'src/html/pages/',
			layouts: 'src/html/layouts/',
			partials: 'src/html/partials/',
			helpers: 'src/html/helpers/',
			data: 'src/html/data/'
		}))
		.pipe(gulp.dest('./dist'))
		.on('finish', browserSync.reload)
})

gulp.task('scripts', function(done) {
	webpack(require('./webpack.config.js'), function(err, stats) {
		if (err) {
			console.log(err.toString())
		}
		console.log(stats.toString())
		done()
	})
})

gulp.task('assets', function() {
	gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./dist'))
})

gulp.task('clean', function(){
	del('dist/**')
})

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
})

gulp.task('watch', function() {
	gulp.watch('./src/styles/**/*', ['styles', browserSync.reload])
	gulp.watch('./src/html/pages/**/*', ['html'])
	gulp.watch(['./src/html/{layouts,partials,helpers,data}/**/*'], [panini.refresh,'html'])
	gulp.watch('./src/scripts/**/*', ['scripts', browserSync.reload])
})

gulp.task('build', ['clean', 'assets', 'styles', 'html', 'scripts'])
gulp.task('default', ['browserSync', 'watch'])