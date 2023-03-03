class Scheduler {
	constructor() {
		this.maxCount = 2
		this.runTasks = []
		this.waitTasks = []
	}
	add(promiseMaker) {
		if (this.runTasks.length < this.maxCount) {
			this.runTask(promiseMaker)
		} else {
			this.waitTasks.push(promiseMaker)
		}
	}
	runTask(promiseMaker) {
		this.runTasks.push(promiseMaker)
		promiseMaker().then(() => {
			this.runTasks = this.runTasks.filter(item => item !== promiseMaker)
			if (this.waitTasks.length) {
				this.runTask(this.waitTasks.shift())
			}
		})
	}
}

const timeout = (time) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

const scheduler = new Scheduler();
const addTask = (time, order) => {
	scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
// output：2 3 1 4
// 一开始，1，2两个任务进入队列。
// 500ms 时，2完成，输出2，任务3入队。
// 800ms 时，3完成，输出3，任务4入队。
// 1000ms 时，1完成，输出1。
