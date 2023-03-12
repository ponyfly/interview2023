## 简介
http是无状态的，没有办法保存一些状态，例如记录用户的行为，在这种情况下cookie就产生了，cookie是浏览器的一小块数据，服务端通过set-cookie字段告诉浏览器设置cookie，浏览器拿到cookie之后进行设置，以后得请求都会携带该cookie信息
## 属性
### 生命周期
+ Expire： 过期时间
+ Max-Age: 最长存活时间

cookie过期会被删除，不会被发送到服务端
### 作用域
通过domain和path控制，发送请求前会先检查domain和path是否一致，如果不一致，则不会带上cookie
### 安全性
如果带上Secure，则说明只能通过HTTPs发送携带cookie
如果带上HttpOnly，则只能通过HTTP访问cookie，不能通过js控制
如果带上SameSite，则可以预防XSRF攻击，SameSite有三个字段可以设置`strict`，`Lax`,`none`
+ strict: 必须是同一个站点（same-site：协议和主域一致）才可以携带cookie，其他的都不可以携带
+ Lax: get 方法提交表单可以携带，a标签发送get请求可以携带，其他不可以携带
+ none: 默认携带Cookie
