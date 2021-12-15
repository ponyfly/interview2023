window.name = 'ByteDance';

function Foo (name) {
  this.name = name || 'foo';
}

Foo.prototype.getName = function(){
  return this.name + 1;
}
Foo.prototype.getName2 = () => {
  return this.name + 1;
}
let foo = new Foo();
let getName = foo.getName;
let getName2 = foo.getName2;

console.log(getName()); // ByteDance1
console.log(getName2()); // ByteDance1
console.log(foo.getName()); // foo1
console.log(foo.getName2()); // ByteDance1
console.log(getName.call(Foo)); // Foo1    // 构造函数会有个默认.name属性为函数名
console.log(getName2.call(Foo)); // ByteDance1
console.log(getName.call(foo)); // foo1
console.log(getName2.call(foo)); // ByteDance1
