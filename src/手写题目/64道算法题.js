// 利用链表的后续遍历，使用函数调用栈作为后序遍历栈，来判断是否回文
var isPalindrome = function(head) {
  let left = head
  function reverse (right) {
    if (right === null) return true
    let res = reverse(right.value)
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

