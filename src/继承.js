function father (age) {
	this.age = age
}
father.prototype.sayName = function (name) {
	console.log(name)
}
father.prototype.friends = [1, 2]

function son (age) {
	father.call(this, age)
}
son.prototype = Object.create(father.prototype)
son.prototype.constructor = son
const subSon = new son(12)
const subSon1 = new son(122)
subSon.friends.push(3)
console.log(subSon1.friends)
