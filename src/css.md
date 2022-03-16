## 对 BFC 的理解

块级元素会在垂直方向一个接一个的排列，和文档流的排列方式一致。
在 BFC 中上下相邻的两个容器的 margin  会重叠，创建新的 BFC 可以避免外边距重叠。
计算 BFC 的高度时，需要计算浮动元素的高度。
BFC 区域不会与浮动的容器发生重叠。
BFC 是独立的容器，容器内部元素不会影响外部元素。
每个元素的左 margin  值和容器的左 border  相接触。


创建 BFC 的方式：

绝对定位元素（position 为 absolute 或 fixed ）。
行内块元素，即 display 为 inline-block 。
overflow 的值不为 visible 。
