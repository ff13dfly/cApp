#创建文件夹并把源码拷贝过来
path="~/Desktop/autoPublish"
folder="app"
target="~/Desktop/www/cApp/news"
config="~/Desktop/www/cApp/news/anchor_news.js"

cd $path
rm -rf $path/$folder
mkdir $folder

cp -r $target/* $folder/
cp $config $path/$folder/gulpfile.js

#去除不需要的文件
cd $path/$folder

#安装基本的构建环境,只需要用一次
npm install gulp
npm install gulp-uglify-es
npm install gulp-concat

#进入构建目录，执行gulpfile
gulp
cp anchorNews.min.js ../
rm -rf $path/$folder