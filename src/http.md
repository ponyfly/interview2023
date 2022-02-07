## 常见http请求
get post head options delete
## get和post区别
+ get通常把参数放在url中，post通常放在body里
+ get传送的URL有长度限制，post没有
+ get比post更不安全，因为参数暴露在URL中，所以不能传递敏感数据
+ GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留
+ GET会产生一个TCP数据包，而POST会产生两个TCP数据包
  详细的说就是：
   - 对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200(返回数据);
   - 而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok(返回数据)
> 在使用curl做POST的时候, 当要POST的数据大于1024字节的时候, curl并不会直接就发起POST请求, 而是会分为俩步,
发送一个请求, 包含一个Expect:100-continue, 询问Server使用愿意接受数据
接收到Server返回的100-continue应答以后, 才把数据POST给Server


