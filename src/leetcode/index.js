function addBigNum (a, b) {
  const maxLen = Math.max(a.length, b.length)

  a = a.padStart(maxLen, '0')
  b = b.padStart(maxLen, '0')

  let sum = ''
  let t = 0
  let carry = 0

  for (let i = maxLen - 1; i >= 0; i--) {
    t = Number(a[i]) + Number(b(i)) + carry
    carry = Math.floor(t / 10)
    sum = t % 10 + sum
  }
  if (carry) {
    sum = '' + carry + sum
  }
  return sum
}
