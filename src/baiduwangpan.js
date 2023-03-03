// 输出结果
async function async1 () {
  console.log('1')
  await async2()
  console.log('2')
  setTimeout(function () {
    console.log('3')
  }, 0)
}

async function async2 () {
  console.log('4')
  setTimeout(function () {
    console.log('5')
  }, 0)
}

console.log('6')
setTimeout(function () {
  console.log('7')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('8')
  resolve()
}).then(function () {
  console.log('9')
})

// 6 1 4 8 2 9 7 5 3


// 实现一个函数，入参两个正序数组，返回值是两个数组的中位数 m+n

function sort(arrA, arrB) {
  const lenA = arrA.length
  const lenB = arrB.length
  const totalLen = lenA + lenB
  let i = 0
  let j = 0
  while (i < lenA || j < lenB) {
    if (totalLen % 2 === 0) {
      if ((i + j) * 2 === totalLen) {
        return (arrA[i] + arrB[j]) / 2
      }
    } else {
      if (i * 2 === totalLen || j * 2 === totalLen) {
        return Math.min(arrA[i], arrB[j])
      }
    }
    if (arrA[i] < arrB[j]) {
      i++
    } else {
      j++
    }
  }
}
