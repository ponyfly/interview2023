class Observer{
    constructor(data){
      this.walk(data)
      this.subs = {}
    }
    walk (data) {
      let keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this.defineReactive(data, key, data[key])
      }
    }
    defineReactive (data, key, val) {
      Object.defineProperty(this, key, {
        get () {
          return data[key]
        },
        set (newVal) {
          const oldVal = data[key]
          data[key] = newVal
          if (this.subs[key]) {
            this.subs[key].forEach(cb => {
              cb(newVal, oldVal)
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
