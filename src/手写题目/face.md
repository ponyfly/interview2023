## 路由跳转方式
```js
router.push('path/b')
router.push({
  path: '',
  query: {}
})
// params不生效
router.push({
  path: 'a/b',
  params: {}
})
// 除非
router.push({
  name: '',
  params: {}
})
// 如果路由没有定义params 上述写法也会丢失
```
## 路由的原理
+ hashchange history.hash
+ history, onpopstate
## vue绑定一个数据
props传递对象，子组件绑定到form上，可以直接改数据，为什么：双向数据绑定
props传递是一个字符串，子组件绑定到form上，修改不会改变源数据，为什么：两个数据
## props传值
+ 子组件是表单，通过props传递对象的话，可以在子组件修改对象中的值，父组件也会更新，因为传递的是同一个对象，所以，修改的是一份数据，修改数据会触发父组件更新，然后触发子组props更新，然后触发子组件重新渲染
+ 如果传递的是一个基本数据类型，相当于传了一个值的复制，所以在子组件修改props，会更新子组件，但是父组件的值不会更新
## Vuex为什么不允许在action中修改状态
+ 本质上也是遵守了“单一职责”原则。
+ 当某种类型的action只有一个声明时，action的回调会被当作普通函数执行，而当如果有多个声明时，它们是被视为Promise实例，并且用Promise.all执行，总所周知，Promise.all在执行Promise时是不保证顺序的，也就是说，假如有3个Promise实例：P1、P2、P3，它们3个之中不一定哪个先有返回结果，那么我们仔细思考一下：如果同时在多个action中修改了同一个state，那会有什么样的结果？
  其实很简单，我们在多个action中修改同一个state，因为很有可能每个action赋给state的新值都有所不同，并且不能保证最后一个有返回结果action是哪一个action，所以最后赋予state的值可能是错误的
  那么Vuex为什么要使用Promise.all执行action呢？其实也是出于性能考虑，这样我们就可以最大限度进行异步操作并发
## vuex和localstorage
vuex不能持久化存储
## localstorage sessionstorage cookie
### cookie
HTTP Cookie（也叫Web Cookie或浏览器Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据
Cookie主要用于以下三个方面：

会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
个性化设置（如用户自定义设置、主题等）
浏览器行为跟踪（如跟踪分析用户行为等）
获取的时候,有两种情况是获取不到的.(针对于某一个)  


cookie 过期了会直接获取不到的
服务端设置 HttpOnly 为 true 的时候  

expires
过期时


Path 标识指定了主机下的哪些路径可以接受Cookie（该URL路径必须存在于请求URL中）。以字符 %x2F ("/") 作为路径分隔符，子路径也会被匹配。  

HttpOnly
如果设置为 true, 那么这个 cookie 是获取不到的.是为了防止恶意攻击(XSS)

SameSite
参考阮一峰老师的博客 Chrome 51 开始，浏览器的 Cookie 新增加了一个SameSite属性，用来防止 CSRF 攻击和用户追踪  
Cookie 的SameSite属性用来限制第三方 Cookie，从而减少安全风险。
他有三个值

Strict
Lax
None

Strict: Strict最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie
Lax: Lax规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外
None: Chrome 计划将Lax变为默认设置。这时，网站可以选择显式关闭SameSite属性，将其设为None。不过，前提是必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效。


key
value
domain
expires
secure
path
上面这些是可以给到前端进行操作的

size
HttpOnly
SameSite
Priority
上面这些是后端来控制的.

### localstorage
解决了cookie存储空间不足的问题(cookie中每条cookie的存储空间为4k)
多 tabs 也公用(浏览器标签页)需要同源,子域名不生效


### 生命周期
cookie：可设置失效时间，没有设置的话，默认是关闭浏览器后失效

localStorage：除非被手动清除，否则将会永久保存。

sessionStorage： 仅在当前网页会话下有效，关闭页面或浏览器后就会被清除。

### 大小
cookie：4KB左右

localStorage: 5MB的信息。 

sessionStorage: 同上。

### http 请求
cookie：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题。

localStorage：仅在客户端（即浏览器）中保存，不参与和服务器的通信。 

sessionStorage: 同上。

## cookie跨域
同一域下，不同工程下的cookie携带问题
cookie跨域访问之后，可以成功的写入本地域。本地的前端工程在请求后端工程时，有很多是ajax请求，ajax默认不支持携带cookie，所以现在有以下两种方案：
 (1) 使用jsonp格式发送
（2）ajax请求中加上字段 xhrFields: {withCredentials: true}，这样可以携带上cookie

## localStorage跨域
可以使用postMessage和iframe


