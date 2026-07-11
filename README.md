# YSIMG可批量进行图片转格式和压缩的网页工具

1、可批量上传图片，支持 JPG / PNG / WebP / BMP / GIF / AVIF / TIFF，可多选，GIF动图仅保留首帧。

2、可调整输出图片质量，0-100.

3、可以选择输出图片格式：JPEG / PNG / WebP / AVIF.

4、可限制输出图片比例，以宽或高为限制。

5、可打包下载

## 安装部署

`docker build -t ysimg .`

`docker run -d -p 5170:80 --name ysimg ysimg`
