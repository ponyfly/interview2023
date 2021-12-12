### 如何操作iframe中的dom,如果是不同域的话呢？
#### cookie的了解
cookie是我们访问过的网站创建的文件，用来存储我们的浏览信息。例如网站偏好设置和个人资料信息

cookie分为两类：
+ 第一方cookie：我们在地址栏输入的url对应的网站域设置的cookie
+ 第三方cookie：另外一种是嵌套在页面中的广告，或者其他域的图片产生的cookie

第一方和第三方cookie本质上都是网站在客户端上存放的一小段数据，他们被某个域存放，只能被这个域访问。
他们的区别不是技术上的，而是使用方式上的

#### cookie的同源策略
cookie只关注域名，不关注协议号和端口号
https://localhost:8080/和http://localhost:8081/的Cookie是共享的。

### cookie如何工作
+ 服务端在响应中利用Set-Cookie header字段来创建一个cookie返回给浏览器
+ 浏览器在请求中通过Cookie header携带之前的cookie，完成论证

### 禁止第三方cookie
a页面嵌套b页面，这里的b页面及时第三方，所以就是禁止b的cookie，b页面不能使用b页面的cookie

### 获取iframe的window、document
+ 通过contentDocument或者contentWindow：
```

const frame = document.getElementById('frame')

const fwindow = frame.contentWindow

const fdoc1 = frame.contentDocument

const fdoc2 = frame.contentWindow.document

```
+ 通过window.frames和iframe的name属性.这种方式直接获取到的是iframe页面的window对象：
```

const frame = window.frames['frameSon']

console.log(`frame:`,frame);

console.log(`frame.document:`,frame.document);



```
### 读取或者调用iframe内部的方法

先判断frame是否加载完毕
+ 第一种：
```

const frame = document.getElementById('frame')

const fdoc = frame.contentDocument || frame.contentWindow.document

frame.onload = () => {

console.log(`frame.contentWindow.test:`, frame.contentWindow.test);

frame.contentWindow.test()

}

```
+ 第二种
```
const frame = window.frames['frameSon']

const fdoc = frame.document

window.onload = () => {

console.log(`frame.test:`, frame.test);

frame.test()

}
```
### iframe跨域

`X-Frame-Options`，网站设置在响应头中的字段，该字段有以下选项
X-Frame-Options	option
+ deny	拒绝被嵌套
+ sameOrigin	允许被相同域名的网站嵌套
+ allow-from example.com/	允许被指定域名的网站嵌套

### iframe跨域有哪些问题
父子页面不同源，收到三种跨域限制：
+ ajax请求限制
+ dom无法获得
+ cookie、localstorage无法获得

重点： 不满足同源策略的两个网页是无法拿到对方的DOM的

### iframe解决跨域
+ 主域相同，子域不同：
可以通过两个页面同时同时把document.domain设置为相同的主域来解决
+ 主域不同：postMessage

监听message时间的时候，可以通过MessageEvent对象获取下面三个参数：

+ MessageEvent.source：发送消息的窗口引用

+ MessageEvent.origin: 发送消息的来源origin

+ MessageEvent.data: 消息内容

栗子1：
```
//父窗口向iframe发消息
 document.getElementById("iframe").contentWindow.postMessage({scrollTop:document.body.scrollTop},'http://172.18.12.109:8082');

```
```
//iframe接收消息
 window.addEventListener('message', (e)=>{
        let origin = event.origin || event.originalEvent.origin; 
        if (origin !== 'http://172.18.12.109:8080') {
          return;  
        }else {
           console.log(e.data);
           //{scrollTop: 0}
        }
      },false);

```

例子2：
```

window.onload = () => {

frame.postMessage({ fn: 'test' }, "http://zijie.com:4444")

}


```

```

function test(){

console.log(`222:`,222);

}

window.onload = function(){

window.addEventListener('message', e => {

console.log(`e:`,e);

if(e.origin === 'http://baidu.com:3333' && e.data.fn === 'test'){

test()

}

})

}
```
如果子页面执行完方法需要向父页面作出通知，可以在子页面中通过event.source获取父页面的引用，调用其poseMessage方法，然后父页面中通过监听message时间实现。
```

function test(){

console.log(`222:`,222);

}

window.onload = function(){

window.addEventListener('message', e => {

console.log(`e:`,e);

if(e.origin === 'http://baidu.com:3333' && e.data.fn === 'test'){

test()

// 向父页面发出通知

e.source.postMessage('执行完毕', '*')

}

})

}
```

```

window.onload = () => {

frame.postMessage({ fn: 'test' }, "http://zijie.com:4444")

// 接受子页面通知

window.addEventListener('message', e => {

console.log(`e.data:`,e.data);

})

}
```
### iframe好处
+ 解决跨域 iframe 嵌套支持 postMessage 方法
+ 复用功能 避免重复开发功能
+ 天然的沙箱 实现了 css 隔离和 js 隔离
### iframe 的缺点
+ 阻塞顶层页面的 onload 事件
