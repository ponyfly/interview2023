// todo: 背诵
accept系列字段分为四个部分:数据格式、压缩方式、支持语言、字符集
## 数据格式
1. 请求端字段：accept
2. 服务端字段：content-type
### 支持的数据格式
+ text： text/html, text/plain, text/css 等
+ image: image/gif, image/jpeg, image/png 等
+ audio/video: audio/mpeg, video/mp4 等
+ application: application/json, application/javascript, application/pdf, application/octet-stream

## 压缩方式
1. 请求端字段：accept-encoding
2. 服务端字段：content-encoding
### 支持的压缩方式
+ gzip: 当今最流行的压缩格式
+ deflate: 另外一种著名的压缩格式
+ br: 一种专门为 HTTP 发明的压缩算法

## 支持语言
1. 请求端字段：accept-language
2. 服务端字段：content-language
```
// 发送端
Content-Language: zh-CN, zh, en
// 接收端
Accept-Language: zh-CN, zh, en
```
## 字符集
1. 请求端字段：Accept-Charset
2. 服务端字段：content-type中的charset属性
```
// 发送端
Content-Type: text/html; charset=utf-8
// 接收端
Accept-Charset: charset=utf-8
```
