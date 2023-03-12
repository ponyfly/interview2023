// 利用链表的后续遍历，使用函数调用栈作为后序遍历栈，来判断是否回文
var isPalindrome = function(head) {
  let left = head
  function reverse (right) {
    if (right === null) return true
    let res = reverse(right.next)
    res = res && left.value === right.value
    left = left.next
    return res
  }
  return reverse(head)
};
// 反转链表
var reverseList = function (head) {
  let pre = null
  let cur = head
  while (cur) {
    let temp = cur.next
    cur.next = pre
    pre = cur
    cur = temp
  }
  return pre
}
// todo 环形链表
var hasCycle = function(head) {
  if (!head || !head.next) return false
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
};
function ListNode(val) {
  this.val = val;
  this.next = null;
}
// todo:相交链表
// @solution-sync:begin
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getListLen = function(head) {
  let len = 0, cur = head;
  while(cur) {
    len++;
    cur = cur.next;
  }
  return len;
}
var getIntersectionNode = function(headA, headB) {
  let curA = headA,curB = headB,
    lenA = getListLen(headA),
    lenB = getListLen(headB);
  if(lenA < lenB) {
    // 下面交换变量注意加 “分号” ，两个数组交换变量在同一个作用域下时
    // 如果不加分号，下面两条代码等同于一条代码: [curA, curB] = [lenB, lenA]
    [curA, curB] = [curB, curA];
    [lenA, lenB] = [lenB, lenA];
  }
  let i = lenA - lenB;
  while(i-- > 0) {
    curA = curA.next;
  }
  while(curA && curA !== curB) {
    curA = curA.next;
    curB = curB.next;
  }
  return curA;
};
// 最长回文子串
var expendStr = function (s, l, r) {
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    // 向两边展开
    l--;
    r++;
  }
  return s.substr(l + 1, r - l - 1)
}
var longestPalindrome = function(s) {
  if (s.length < 2) return s
  let res = ''
  for (let i = 0; i < s.length; i++) {
    let l1 = expendStr(s, i, i)
    let l2 = expendStr(s, i, i+1)
    res = res.length > l1.length ? res : l1
    res = res.length > l2.length ? res : l2
  }
  return res
};
// 最长连续递增序列
var findLengthOfLCIS = function(nums) {
  if (nums.length < 2) return 1
  let i = 0
  let j = 1
  let max = 0
  let len = nums.length
  while (j < len) {
    if (nums[j] <= nums[j - 1]) {
      i = j
    }
    max = Math.max(max, j - i + 1)
    j++
  }
  return max
};
// 最长连续序列
var longestConsecutive = function (nums) {
  const set = new Set(nums)
  let max = 0
  for (const number of set) {
    if (!set.has(number - 1)) {
      let cur = number
      let curMax = 0
      while (set.has(cur)) {
        curMax++
        cur++
      }
      max = Math.max(max, curMax)
    }
  }
  return max
}
// 盛最多水的容器
var maxArea = function(height) {
  let i = 0
  let j = height.length - 1
  let max = 0
  while (i < j) {
    const area = Math.min(height[j], height[i]) * (j - i)
    max = Math.max(max, area)
    if (height[i] <= height[j]) {
      ++i
    } else {
      --j
    }
  }
  return max
};
// 寻找两个正序数组的中位数
var findMedianSortedArrays = function(nums1, nums2) {
  const m = nums1.length
  const n = nums2.length
  let i = 0
  let j = 0
  let allNums = []
  while (i < m && j < n) {
    if (nums1[i] < nums2[j]) {
      allNums.push(nums1[i++])
    } else {
      allNums.push(nums2[j++])
    }
  }
  allNums = allNums.concat(i < m ? nums1.slice(i) : nums2.slice(j))

  if (allNums.length % 2 === 0) {
    return (allNums[allNums.length / 2] + allNums[(allNums.length / 2) - 1]) / 2
  } else {
    return allNums[Math.floor(allNums.length / 2)]
  }
};
// todo 删除有序数组中的重复项
var removeDuplicates = function(nums) {
  if (nums.length < 2) return nums.length
  let i = 1
  let j = 1
  let len = nums.length
  while (j < len) {
    if(nums[j] !== nums[j - 1]) {
      nums[i++] = nums[j]
    }
    j++
  }
  return i
};
// 和为K的子数组
var subarraySum = function(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; ++start) {
    let sum = 0;
    for (let end = start; end >= 0; --end) {
      sum += nums[end];
      if (sum == k) {
        count++;
      }
    }
  }
  return count;
};
// 两数之和
var twoSum = function(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    if (map.has(target - num)) {
      return [map.get(target - num), i]
    }
    map.set(num, i)
  }
  return []
};
// todo 接雨水
var trap = function(height) {
  let len = height.length
  if (len < 1) return 0
  let max = 0
  let l = new Array(len).fill(0)
  let r = new Array(len).fill(0)
  l[0] = height[0]
  r[len - 1] = height[len - 1]
  for (let i = 1; i < r.length; i++) {
    l[i] = Math.max(l[i - 1], l[i])
  }
  for (let i = len - 2; i > 0; i--) {
    r[i] = Math.max(r[i + 1], r[i])
  }
  for (let i = 0; i < len; i++) {
    max += Math.min(l[i], r[i]) - height[i]
  }
  return max
};
// todo 跳跃游戏
var canJump = function(nums) {
  let faster = 0
  for (let i = 0; i < nums.length; i++) {
    faster = Math.max(faster, i + nums[i])
    if (faster <= i) return false
  }
  if (faster >= nums.length - 1) return true
};
// todo 层序遍历
var levelOrder = function(root) {
  let res = []
  let queue = []
  queue.push(root)
  if (root === null) return res
  while (queue.length) {
    let curLength = queue.length
    let curLevel = []
    for (let i = 0; i < curLength; i++) {
      const node = queue.shift()
      curLevel.push(node.val)
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
    res.push(curLevel)
  }
  return res
};
// 二叉树：中序遍历
var inorderTraversal = function(root) {
  let res = []
  function dfs (node) {
    if (node === null) return
    dfs(node.left)
    res.push(node.val)
    dfs(node.right)
  }
  dfs(root)
  return res
};
// 前序遍历
var preorderTraversal = function(root) {
  let res = []
  function dfs (node) {
    if (node === null) return
    res.push(node.val)
    dfs(node.left)
    dfs(node.right)
  }
  dfs(root)
  return res
};
// todo:最大深度
var maxDepth = function(root) {
  function dfs (node) {
    if (node === null) return 0
    const left = dfs(node.left)
    const right = dfs(node.right)
    const max = Math.max(left, right) + 1
    return max
  }
  return dfs(root)
};
// todo:最小深度
var minDepth1 = function (root) {
  if (root === null) return 0
  if (!root.left && !root.right) return 1
  if (!root.left) return minDepth1(root.right) + 1
  if (!root.right) return minDepth1(root.left) + 1
  return Math.min(minDepth1(root.right), minDepth1(root.left)) + 1
}
// todo: 锯齿遍历
var zigzagLevelOrder = function(root) {
  let res = []
  let queue = []
  queue.push(root)
  if (!root) return []

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
};
// todo 公共祖先
var lowestCommonAncestor = function(root, p, q) {
  // 使用递归的方法
  // 需要从下到上，所以使用后序遍历
  // 1. 确定递归的函数
  const travelTree = function(root,p,q) {
    // 2. 确定递归终止条件
    if(root === null || root === p||root === q) {
      return root;
    }
    // 3. 确定递归单层逻辑
    let left = travelTree(root.left,p,q);
    let right = travelTree(root.right,p,q);
    if(left !== null&&right !== null) {
      return root;
    }
    if(left ===null) {
      return right;
    }
    return left;
  }
  return  travelTree(root,p,q);
};
// 合并区间
var merge = function(intervals) {
  if (intervals.length === 0) return []
  intervals.sort((a, b) => a[0] - b[0]) // todo
  let res = [intervals[0]]
  let rest = intervals.slice(1)
  for (let i = 0; i < rest.length; i++) {
    const item = rest[i]
    const last = res[res.length - 1]
    if (last[1] >= item[0]) {
      last[1] = Math.max(last[1], item[1])
    } else {
      res.push(item)
    }
  }
  return res
};
// todo 最长公共子序列
// todo 最大子序和
var maxSubArray = function(nums) {
  let pre = 0, max = nums[0]
  for (let i = 0; i < nums.length; i++) {
    pre = Math.max(pre + nums[i], nums[i])
    max = Math.max(pre, max)
  }
  return max
};
// todo 买卖股票的最佳时机
function maxProfit (prices) {
  let minPrice = prices[0]
  let maxGap = 0
  for (let i = 0; i < prices.length; i++) {
    minPrice = Math.min(minPrice, prices[i])
    maxGap = Math.max(maxGap, prices[i] - minPrice)
  }
  return maxGap
}
// todo 爬楼梯
function climbStairs (n) {
  let dp = [1, 2]
  for (let i = 2; i < n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n - 1]
}
// todo 全排列
var permute = function(nums) {
  const res = []
  const path = []
  function backtracking (n, k, used) {
    if (path.length === k) {
      res.push(Array.from(path))
    }

    for (let i = 0; i < n; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(n[i])
      backtracking(n, k, used)
      path.pop()
      used[i] = false
    }
  }
  backtracking(nums, nums.length, [])
  return res
};
// 给定一个升序整型数组 [0,1,2,4,5,7,13,15,16,17],找出其中连续出现的数字区间，
//
// 输出为:
//
// ["0->2","4->5","7","13","15->17”]
// 找出连续出现的区间
function print (nums) {
  if (nums.length < 1) return []
  let res = []
  let left = 0
  let right = 0

  while(right < nums.length - 1) {
    if (nums[right + 1] - nums[right] === 1) {
      right++
    } else {
      let str = ''
      if (nums[left] === nums[right]) {
        str = '' + nums[left]
      } else {
        str = `${nums[left]}->${nums[right]}`
      }
      res.push(str)
      left = right =  right + 1
    }
  }

  if (right === nums.length - 1) {
    res.push(`${nums[left]}->${nums[right]}`)
  }


  return res

}
console.log(print([0,1,2,4,5,7,13,15,16,17]))
