const { src, dest, series, watch } = require('gulp')
const svgSprite = require('gulp-svg-sprite')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const sync = require('browser-sync').create()


function html() {
    return src('src/*.html')
    .pipe(include({
        prefix: '@@'
    }))
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}

function fonts() {
    return src('./src/fonts/**/*.{eot,svg,ttf,woff,woff2}') 
    .pipe(dest('./dist/fonts/')); 
}

function images() {
    return src('./src/img/*.{png,jpg,jpeg,webp,raw}') 
    .pipe(dest('./dist/img/')); 
}

function sprite() {
    const config = {
        shape: {
            spacing: {
                padding: 20
            },
        },
        mode: {
            view: {
                bust: false,
                render: {
                    scss: true
                }
            },
            symbol: false
        }
    }
    return src('src/img/**/*.svg').pipe(svgSprite(config)).pipe(dest('dist/img/'))
}

function clear() {
    return del('dist')
}

function serve() {
    sync.init({
        server: './dist'
    })

    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
}

exports.build = series(clear, scss, html, fonts, images, sprite)
exports.serve = series(clear, scss, html, fonts, images, sprite, serve)
exports.clear = clear
exports.fonts = fonts
exports.images = images
exports.sprite = sprite
