const del = require('del');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const tslint = require('gulp-tslint');
const gulpWatch = require('gulp-watch');
var ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');


const SRCS = ['src/*.ts', 'src/**/*.ts'];
const TESTS = ['test/*.ts', 'test/**/*.ts'];
const ALL = [...SRCS, ...TESTS];
const DIST = 'dist';

const test = () =>
    gulp.src(TESTS, {read: false})
        .pipe(mocha({reporter: 'spec', require: ['ts-node/register']}));
exports.test = test;

const lint = () =>
    gulp.src(ALL).pipe(tslint({formatter: 'verbose'})).pipe(tslint.report());

const watch = () => gulpWatch(ALL, gulp.series(test, lint));
exports.watch = watch

const clean = () => del(DIST, {force: true});

const tsInit = () => gulp.src(SRCS).pipe(ts());

const compile = () => tsInit()
                          .pipe(sourcemaps.init({loadMaps: true}))
                          .pipe(sourcemaps.write())
                          .pipe(gulp.dest(DIST));

exports.build = gulp.series(clean, test, compile, lint);

const compileProd = () => tsInit().pipe(gulp.dest(DIST));

gulp.task('build-prod', gulp.series(clean, test, compileProd, lint))
