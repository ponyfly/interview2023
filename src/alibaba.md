1. 0.1 + 0.2 > 0.3
答：js存储数字采用
2. 面向对象（OOP）的三要素，五个设计原则
答：三要素：封装 继承 多态
   + 封装：封装就是事物抽象为类，把对外接口暴露，将实现和内部数据隐藏。
   + 继承：它可以使用现有类的所有功能，并在无需重新编写原来的类的情况下对这些功能进行扩展
   + 多态：允许将子类类型的指针赋值给父类类型的指针，那么，多态的作用是什么呢？我们知道，封装可以隐藏实现细节，使得代码模块化；继承可以扩展已存在的代码模块（类）；它们的目的都是为了——代码重用。而多态则是为了实现另一个目的——接口重用！多态的作用，就是为了类在继承和派生的时候，保证使用“家谱”中任一类的实例的某一属性时的正确调用。多态是方法的多态，属性没有多态性
   多态的实现：覆盖，是指子类重新定义父类的函数的做法。
   五个设计原则： （异界里单开）
   + 单一职责原则：每一个类应该专注于做一件事情
   + 开放封闭原则：面向扩展开放，面向修改关闭
   + 里氏替换原则：子类应当可以替换父类并出现在父类能够出现的任何地方
   + 依赖倒置原则：高层模块不应该依赖低层模块。两个都应该依赖抽像，实现尽量依赖抽象，不依赖具体实现
   + 接口分离原则：应当为客户端提供尽可能小的单独的接口，而不是提供大的总的接口
3. https对称加密非对称加密
答： HTTPS 是在 HTTP 的基础上，利用 SSL/TLS 加密数据包
   1. 客户端请求https://baidu.com，服务端返回公钥证书
   2. 浏览器查找操作系统中已内置的公钥证书发布机构CA与服务端给的公钥证书CA和进行对比，用于校验证书是否为合法机构颁发
   3. 如果找到，则从操作系统中取出颁发者CA的公钥，对服务端发来的证书里的签名进行解密
   4. 浏览器使用相同的hash函数计算生成信息摘要，将这个值与解密后的值进行对比
   5. 对比结果一致，则证明服务器发来的证书合法，没有被冒充。此时浏览器就可以读取证书中的公钥，用于后续加密了
   6. 客户端生成会话秘钥（利用伪随机数）
   7. 用公钥加密会话秘钥，并发送公钥加密后的会话秘钥的密文
   8. 服务端使用私钥解密拿到会话秘钥，使用会话秘钥加密明文内容，并返回会话秘钥加密后的密文内容
   9. 客户端使用会话秘钥解密密文内容，获取明文内容
   10. 客户端使用会话秘钥加密明文内容，发送给客户端
   11. 服务端使用会话秘钥解密密文内容，获取明文内容
   12. 为什么cache-control优先级比expire高
   答：+ cache-control是http1.1，expire是http1.0
       expire：过期时间，使用的是本地时间，缺点：本地时间可以修改
       cache-control的几个值：
         + max-age：最长缓存时间
         + no-cache：不使用强缓存，每次都要使用协商缓存进行对比
         + no-store：不使用强缓存和协商缓存，每次都要从服务端获取最新的资源
         + public:允许客户端和代理服务器缓存资源
         + private:资源只有客户端可以缓存
   + 协商缓存：if-modify-since/last-modify  if-none-match/e-tag
4. url从输入到浏览器解析的一系列事件
   + DNS解析
   + 发起TCP连接
   + 发送HTTP请求
   + 服务器处理请求并返回HTTP报文
   + 浏览器解析渲染页面
   + 连接结束。
5. 缓存优点
   + 减少了服务器的压力
   + 节省了带宽
   + 提高了浏览器的加载网页的速度
   
回流和重绘
+ 回流：部分或全部元素的尺寸、结构发生变化导致浏览器重新渲染文档，页面初始化渲染，添加删除元素，修改元素尺寸，改变元素位置，改变元素内容
+ 重绘：当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘
可以优化的地方：
+ dns解析：DNS缓存 DNS负载均衡
+ css:
  + 避免使用table布局。
  + 尽可能在DOM树的最末端改变class。
  + 避免设置多层内联样式。
  + 将动画效果应用到position属性为absolute或fixed的元素上。
  + 避免使用CSS表达式（例如：calc()）
+ js:
  + 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
  + 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。
  + 也可以先为元素设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。
  + 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
  + 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流  

重绘重排次数计算
    答：+ 浏览器优化
```
div.style.width=10px
div.style.height=10px
div.style.left=10px
div.style.top=10px
```
理论上会发生四次重排，但实际上置灰发生一次，因为又渲染队列存在
```
div.style.width=10px
console.log(div.offsetWidth)
div.style.height=10px
console.log(div.offsetHeight)
div.style.left=10px
console.log(div.offsetWidth)
div.style.top=10px
console.log(div.offsetWidth)
```
会发生四次重排，因为offsetLeft/Top/Width/Height有关这些会强制刷新队列要求样式修改任务立刻执行  
优化：
   1. 分离读写操作
    ```
    div.style.width=10px
    div.style.height=10px
    div.style.left=10px
    div.style.top=10px
    console.log(div.offsetWidth)
    console.log(div.offsetHeight)
    console.log(div.offsetTop)
    ```
   2. 样式集中改变，使用cssText,或者class
    ```
    div.style.width=10px
    div.style.height=10px
    div.style.left=10px
    div.style.top=10px
    ```
    3. 缓存布局信息
    ```
      curTop = div.offsetTop;
      curLeft = div.offsetLeft;
      div.style.top = curTop + 1 + 'px'
      div.style.left = div.curLeft + 1 + 'px'
    ```
    4. 元素批量操作: 元素脱离文档(display：none,然后操作dom,操作完成后设置为block)、文档碎片（）
   4. defer和async
  + 两个都是延迟加载的意思
  + async是乱序的，而defer是顺序执行
  + 一般外链js使用defer
