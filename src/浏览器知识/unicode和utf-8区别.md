2. unicode和utf-8区别
答：unicode是字符编码集合，Unicode 为世界上所有字符都分配了一个唯一的数字编号，这个编号范围从 0x000000 到 0x10FFFF (十六进制)，有 110 多万，每个字符都有一个唯一的 Unicode 编号，这个编号一般写成 16 进制。
计算机只能存储二进制，所以我们需要把字符转换成二进制存储，那么把字符转换成二进制存储的实现方案就是utf-8
  + utf-8,UTF-8 就是使用变长字节表示,顾名思义，就是使用的字节数可变，这个变化是根据 Unicode 编号的大小有关，编号小的使用的字节就少，编号大的使用的字节就多。使用的字节个数从 1 到 4 个不等
  + utf-16,UTF-16 使用变长字节表示 ,① 对于编号在 U+0000 到 U+FFFF 的字符（常用字符集），直接用两个字节表示。 ② 编号在 U+10000 到 U+10FFFF 之间的字符，需要用四个字节表示,
  + utf-32,这个就是字符所对应编号的整数二进制形式，四个字节。这个就是直接转换
  + [参阅](https://blog.csdn.net/zhusongziye/article/details/84261211)
