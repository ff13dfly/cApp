/*压缩虚块世界需要的其他支持库的防范
 * 1.jenkins的自动任务会将该文件拷贝成gulpfile.js
 * 2.使用uglify进行代码的变量名修改
 * */

//参考信息:https://www.cnblogs.com/2050/p/4198792.html
//需要的gulp组件安装
//npm install --save-dev gulp-uglify
//npm install --save-dev gulp-concat
//npm install --save-dev gulp-jshint

//后面可以考虑直接用hbuilderX
//用这个文件处理下git同步看，really?

var gulp = require('gulp');
//var jshint = require("gulp-jshint");
//var babel = require("gulp-babel");
var uglify = require("gulp-uglify-es").default;
var concat = require('gulp-concat');

//目标配置
var target = './';
var min = 'anchorMedia.min.js';
var source = [
    'core.js',
    'pages/index.js',
    'pages/view.js',
    'pages/history.js',
];
var opt = {
    mangle: {
        toplevel: true,
    }
};

gulp.task('default', function() {
    gulp.src(source) // 要压缩的js文件
        .pipe(uglify(opt)) //使用uglify进行压缩,更多配置请参考：
        .pipe(concat(min)) //压缩成一个js文件
        .pipe(gulp.dest(target)); //压缩后的路径'dist/js'
    return new Promise((resolve, reject) => {
        resolve('success');
    });
});