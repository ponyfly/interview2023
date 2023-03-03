// EventEmitter 就是发布订阅模式的典型应用

class EventEmitter {
	constructor() {
		this.events = {}
	}
	emit(type, ...args) {
		if (!this.events[type]) return false
		this.events[type].forEach(cb => {
			// todo: change this point，and provide arguments
			cb.apply(this, args)
		})
	}
	on (type, cb) {
		if (!this.events[type]) {
			this.events[type] = [cb]
		} else {
			this.events[type] = [...this.events[type], cb]
		}
	}
	off (type, cb) {
		if (!this.events[type]) {
			console.log('there is not the current event type')
		}
		this.events[type] = this.events[type].filter(callback => callback !== cb)
	}
	once (type, cb) {
		const fn = (cb) => {
			cb.apply(this)
			this.off(type, fn)
		}
		this.on(type, cb)
	}
}
