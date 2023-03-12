class Observer{
    constructor(data){
      this.subs = {}
      initData(this, data)
      this.walk(data)
    }
    walk (data) {
      let keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this.defineReactive(data, key, data[key])
      }
    }
    defineReactive (data, key, val) {
      let self = this
      Object.defineProperty(data, key, {
        get () {
          return val
        },
        set (newVal) {
          let temp = val
          val = newVal
          if (self.subs[key]) {
            self.subs[key].forEach(cb => {
              cb(newVal, temp)
            })
          }
        }
      })
    }
    $on(val, callback){
      if (!this.subs[val]) {
        this.subs[val] = [callback]
      } else {
        this.subs[val].push(callback)
      }
    }
}
function initData (vm, data) {
  vm._data = data
  for (let key in data) {
    proxy(vm, `_data`, key);
  }
}
// 数据代理
function proxy(object, sourceKey, key) {
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key];
    },
    set(newValue) {
      object[sourceKey][key] = newValue;
    },
  });
}

const data = new Observer({
    a: 1
})
data.$on('a', (newval, oldVal) => {
    console.log(newval, oldVal)
})
data.$on('a', (newval, oldVal) => {
    console.log(newval, oldVal)
})
data.a = 2
