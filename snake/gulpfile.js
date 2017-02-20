var gulp = require('gulp');
var uglify = require('gulp-uglify');
gulp.task('script', function() {  // 压缩 js 文件；在命令行使用 gulp script 启动此任务
    gulp.src('js/*.js')  // 1. 配置源文件，这里就是压缩js目录下的所有.js文件
    // gulp.src('js/**/*.js')  目录中还有子目录就这样写
        .pipe(uglify())  // 2. 使用uglify压缩文件；gulp.pipe() - 管道，你可以暂时将 pipe 理解为将操作加入执行队列
        .pipe(gulp.dest('./'))  // 3. 配置目标目录，另存压缩后的文件
})