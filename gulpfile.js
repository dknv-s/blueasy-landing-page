const gulp = require("gulp");
const pug = require("gulp-pug");
const scss = require("gulp-sass");
scss.compiler = require("node-sass");
const postcss = require("gulp-postcss");
const prefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");

const paths = {
  entry: {
    pug: "./src/views/*.pug",
    scss: "./src/styles/*.scss",
    img: "./src/img/**/*",
    fonts: "./src/fonts/**/*"
  },
  src: {
    pug: ["./src/views/**/*.pug", "./src/blocks/**/*.pug"],
    scss: ["./src/styles/**/*.scss", "./src/blocks/**/*.scss"],
    img: ["./src/img/**/*.*"],
    fonts: ["./src/fonts/**/*"]
  },
  output: {
    pug: "./dist/",
    scss: "./dist/css/",
    img: "./dist/",
    fonts: "./dist/"
  },
  clean: "./dist"
};

/* Compile pug page templates */
function pugComp() {
  return gulp
    .src(paths.entry.pug)
    .pipe(
      pug({
        pretty: true
      })
    )
    .on("error", e => {
      throw new Error(e.message);
    })
    .pipe(gulp.dest(paths.output.pug))
    .pipe(browserSync.stream());
}

/* SCSS compile, minify, autoprefix */
function scssComp() {
  return gulp
    .src(paths.entry.scss)
    .pipe(scss())
    .pipe(postcss([prefixer(), cssnano()]))
    .pipe(gulp.dest(paths.output.scss))
    .pipe(browserSync.stream());
}

/* Minify and copy images to dist */
function img() {
  return gulp
    .src(paths.entry.img, { base: "src" })
    .pipe(imagemin())
    .pipe(gulp.dest(paths.output.img))
    .pipe(browserSync.stream());
}

/* Copy fonts to dist */
function fonts() {
  return gulp
    .src(paths.entry.fonts, { base: "src" })
    .pipe(gulp.dest(paths.output.fonts))
    .pipe(browserSync.stream());
}

/* Clean dist folder */
function cleanBuild() {
  return gulp.src(paths.clean, { read: false, allowEmpty: true }).pipe(clean());
}

/* Watch for changes */
function watchers(done) {
  gulp.watch(paths.src.pug, gulp.series(pugComp));
  gulp.watch(paths.src.scss, gulp.series(scssComp));
  gulp.watch(paths.src.img, gulp.series(img));
  done();
}

/* BrowserSync */
function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    port: 3000
  });
  done();
}

/* Tasks */
const build = gulp.series(
  cleanBuild,
  gulp.parallel(pugComp, scssComp, img, fonts)
);
const watch = gulp.series(build, browserSyncInit, watchers);

exports.build = build;
exports.watch = watch;
exports.clean = gulp.series(cleanBuild);
exports.default = watch;
