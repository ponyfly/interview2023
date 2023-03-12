// 是否回文
function isPalindrome (head) {
	let left = head
	function reverse (right) {
		if (right === null) return true
		let res = reverse(right.next)
		res = res && left.value === right.value
		left = left.next
		return res
	}

	return reverse(head)
}
// 反转链表
function reverseList (head) {
	let prev = null
	let cur = head
	let temp
	while (cur) {
		temp = cur.next
		cur.next = prev
		prev = cur
		cur = temp
	}
	return prev
}

// 环形链表
function hasCycle (head) {
	if (!head || !head.next) return false
	let slow = head
	let fast = head
	while (fast && fast.next) {
		slow = slow.next
		fast = fast.next.next
		if (slow === fast) return true
	}
	return false
}

// 最长回文子串
function longestPalindrome(str) {
	if (str.length < 2) return s
	let res = ''
	for (let i = 0; i < str.length; i++) {
		let l1 = expendStr(str, i , i)
		let l2 = expendStr(str, i , i + 1)
		res = res.length > l1.length ? res : l1
		res = res.length > l2.length ? res : l2
	}
	return res
}
function expendStr(str, l, r) {
	while (l >= 0 && r < str.length && str[l] === str[r]) {
		l--
		r++
	}
	return str.substr(l + 1, r - l - 1)
}

// 两数之和
function twoSum (nums, target) {
	const map = new Map()
	for (let i = 0; i < nums.length; i++) {
		const l = nums[i]
		const r = target - l
		if (map.has(r)) {
			return [map.get(r), i]
		}
		map.set(l, i)
	}
}

console.log(twoSum([1,2,4,6], 5))

// 前序遍历
function preorderTraversal (root) {
	let res = []

	function dfs(node) {
		if (node === null) return
		res.push(node.val)
		dfs.push(node.left)
		dfs.push(node.right)
	}

	dfs(root)

	return res
}

// 中序遍历
function inorderTraversal (root) {
	let res = []

	function dfs(node) {
		if (node === null) return
		dfs.push(node.left)
		res.push(node.val)
		dfs.push(node.right)
	}

	dfs(root)

	return res
}

// 后序遍历
function postorderTraversal (root) {
	let res = []

	function dfs(node) {
		if (node === null) return
		dfs.push(node.left)
		dfs.push(node.right)
		res.push(node.val)
	}

	dfs(root)

	return res
}

// 层序遍历
function levelOrder (root) {
	if (root === null) return []

	let res = []
	let queue = [] // 队列
	queue.push(root)
	while (queue.length) {
		let len = queue.length
		let curLevel = []
		for (let i = 0; i < len; i++) {
			let node = queue.shift()
			curLevel.push(node.val)
			node.left && queue.push(node.left)
			node.right && queue.push(node.right)
		}
		res.push(curLevel)
	}
	return res
}

// 锯齿遍历
function zigzagLevelOrder(root) {
	if (root === null) return []
	let res = []
	let queue = []
	queue.push(root)
	let isOrderLeft = true
	while (queue.length) {
		let len = queue.length
		let curLevel = []
		for (let i = 0; i < len; i++) {
			let node = queue.shift()
			if (isOrderLeft) {
				curLevel.push(node.val)
			} else {
				curLevel.unshift(node.val)
			}
			node.left && queue.push(node.left)
			node.right && queue.push(node.right)
		}
		res.push(curLevel)
		isOrderLeft = !isOrderLeft
	}
	return res
}

function lowestCommonAncestor (root, p, q) {
	const dfs = function (root, p, q) {
		if (root === null || root === p || root === q) {
			return root
		}
		let left = dfs(root.left, p, q)
		let right = dfs(root.right, p, q)

		if (left !== null && right !== null) {
			return root
		}
		if (left === null) return right
		return left
	}

	return dfs(root, p, q)
}

// 最大子序和
function maxSubArray (nums) {
	let pre = 0
	let max = nums[0]
	for (let i = 0; i < nums.length; i++) {
		pre = Math.max(pre + nums[i], nums[i])
		max = Math.max(pre, max)
	}

	return max
}
// 买卖股票的最佳时机
function maxProfit(prices) {
	let maxGap = 0
	let mixPrice = prices[0]
	for (let i = 0; i < prices.length; i++) {
		mixPrice = Math.min(mixPrice, prices[i])
		maxGap = Math.max(maxGap, prices[i] - mixPrice)
	}
	return maxGap
}
// 爬楼梯
function climbStairs (n) {
	let dp = [1, 2]
	for (let i = 2; i < n; i++) {
		dp[i] = dp[i - 1] + dp [i - 2]
	}
	return dp[n - 1]
}

// todo 动态规划求解硬币找零问题
function coinChange (coins, amount) {
	const f = []
	f[0] = 0
	for (let i = 1; i <= amount; i++) {
		f[i] = Infinity
		for (let j = 0; j < coins.length; j++) {
			const coin = coins[j];
			if (i - coin >= 0) {
				f[i] = Math.min(f[i], f[i - coin] + 1)
			}
		}
	}
	if (f[amount] === Infinity) return -1
	return f[amount]
}
console.log(coinChange([1,5,10,25], 36), 33)
