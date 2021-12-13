class ListNode {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.next = null
    this.prev = null
  }
}

class LRUCache {
  constructor(maxCount) {
    this.maxCount = maxCount
    this.count = 0
    this.map = {} // 存储key和node的对应关系，可以根据key读取node然后读取value
    this.head = new ListNode()
    this.tail = new ListNode()
    this.head.next = this.tail
    this.head.prev = this.head
  }
  get (key) {
    const node = this.map[key]
    if (node == null) return -1
    this.moveToHead(node)
    return node.value
  }
  put (key, value) {
    const node = this.map[key]
    if (node === undefined || node === null) {
      const curNode = new ListNode(key, value)
      // 将node存储到map表中
      this.map[key] = curNode
      // 将node移动到头部
      this.addToHead(curNode)
      this.count++
      // 超过容容量，从队尾删除一个
      if (this.count > this.maxCount) {
        this.removeLRUItem()
      }
    } else {
      node.value = value
      this.moveToHead(node)
    }
  }
  moveToHead (node) {
    this.removeFromList(node)
    this.addToHead(node)
  }
  // 从链表中删除节点
  removeFromList (node) {
    const tempPrev = node.prev
    const tempNext = node.next
    tempPrev.next = tempNext
    tempNext.prev = tempPrev
  }
  // 新节点加入链表头的指针操作
  addToHead (node) {
    const temp = this.head.next
    node.prev = this.head
    node.next = temp
    this.head.next = node
    temp.prev = node
  }
  removeLRUItem () {
    const tail = this.popTail()
    delete this.map[tail.key]
    this.count--
  }
  popTail () {
    const temp = this.tail.prev
    this.removeFromList(temp)
    return temp
  }
}
const LRUCacheLinkList = new LRUCache(2)
LRUCacheLinkList.put(1, 1) // 缓存是 {1=1}
console.log('----1----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----7----LRUCacheLinkList.put(1, 1)----', LRUCacheLinkList.put(1, 1))

console.log('\n')
LRUCacheLinkList.put(2, 2) // 缓存是 {1=1, 2=2}
console.log('----2----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----7----LRUCacheLinkList.put(2, 2)----', LRUCacheLinkList.put(2, 2))

console.log('\n')
LRUCacheLinkList.get(1) // 返回 1
console.log('----3----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----3----LRUCacheLinkList.get(1)----', LRUCacheLinkList.get(1))

console.log('\n')
LRUCacheLinkList.put(3, 3) // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
console.log('----4----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----7----LRUCacheLinkList.put(3, 3)----', LRUCacheLinkList.put(3, 3))

console.log('\n')
LRUCacheLinkList.get(2) // 返回 -1 (未找到)
console.log('----5----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----5----LRUCacheLinkList.get(2)----', LRUCacheLinkList.get(2))

console.log('\n')
LRUCacheLinkList.put(4, 4) // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
console.log('----6----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----7----LRUCacheLinkList.put(4, 4)----', LRUCacheLinkList.put(4, 4))

console.log('\n')
LRUCacheLinkList.get(1) // 返回 -1 (未找到)
console.log('----7----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----7----LRUCacheLinkList.get(1)----', LRUCacheLinkList.get(1))

console.log('\n')
LRUCacheLinkList.get(3) // 返回 3
console.log('----8----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----8----LRUCacheLinkList.get(3)----', LRUCacheLinkList.get(3))

console.log('\n')
LRUCacheLinkList.get(4) // 返回 4
console.log('----9----LRUCacheLinkList----', LRUCacheLinkList)
console.log('----9----LRUCacheLinkList.get(4)----', LRUCacheLinkList.get(4))
