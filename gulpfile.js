const gulp = require('gulp');

// CSS
const autoprefixer = require('gulp-autoprefixer');
// JS
const babel = require('gulp-babel');
const concat = require('gulp-concat');
// Browser Sync
const browserSync = require('browser-sync').create();
// Build
const clean = require('gulp-clean');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');


//// DEFAULT
gulp.task("html", (done) => {
    gulp.src("app/*.html")
        .pipe(gulp.dest("build"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("css", (done) => {
    gulp.src("app/style.css")
        .pipe(autoprefixer())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('react', (done) => {
    return browserify({entries: './app/index.jsx', extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ["@babel/preset-env", "@babel/preset-react"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('build'));
    done();
});

gulp.task("js", (done) => {
    gulp.src("./**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("index.js"))
        .pipe(gulp.dest("build/js"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("browser-init", (done) => {
    browserSync.init({
        server: "build"
    });
    done();
});

gulp.task("watch", (done) => {
    gulp.watch("app/**/*.html", gulp.series("html"));
    gulp.watch("app/**/*.css", gulp.series("css"));
    gulp.watch("app/**/*.js", gulp.series("js"));
    gulp.watch("app/**/*.jsx", gulp.series("react"));
    done();
});

gulp.task("del-bundlejs", (done) => {
    gulp.src('build/bundle.js', {read: false})
        .pipe(clean());
        done();
});

gulp.task("clean", (done) => {
    gulp.src('build/**/*', {read: false})
        .pipe(clean());
        done();
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("html", "css", "js")
    )
);

gulp.task("default", gulp.series("html", "css", "react", "js", "browser-init", "watch"));