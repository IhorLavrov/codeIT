var gulp      = require('gulp'), // Подключаем Gulp
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'); // Подключаем библиотеку для переименования файлов

gulp.task('scripts', function() {
    return gulp.src(['sendForm.min.js', 'getCompanies.min.js', 'loaders.min.js', 'newsSlider.min.js'])
        .pipe(concat('result.js'))
        .pipe(gulp.dest('js/'));
});
gulp.task('scriptsCSS', function() {
    return gulp.src('css/*min.css')
        .pipe(concat('result.css'))
        .pipe(gulp.dest('css/'));
});
gulp.task('css-libs', function() {
    return gulp.src('css/result.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('css/')); // Выгружаем в папку app/css
});
gulp.task('minify', function () {
    gulp.src('js/result.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js'));
});