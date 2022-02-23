// todo
function compose (...fns) {
  return fns.reduce((pre, cur) => {
    return (...args) => {
      return pre(cur(...args))
    }
  })
}
function mySettimeout (fn, delay = 1000) {
  let timer
  function interval () {
    fn()
    timer = setTimeout(fn, delay)
  }
  interval()
  return {
    cancel () {
      clearTimeout(timer)
    }
  }
}
