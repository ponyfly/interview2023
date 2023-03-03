# 自定义hook
本质：自定义hook其实是对内置hook的二次封装，从而达到复用逻辑的目的

## 实战
``` jsx
import { useState, useEffect } from "react";

const BASE_URL = "https://corona.lmao.ninja/v2";

export function useCoronaAPI(
  path,
  { initialData = null, converter = (data) => data, refetchInterval = null }
) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}${path}`);
      const data = await response.json();
      setData(converter(data));
    };
    fetchData();

    if (refetchInterval) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [converter, path, refetchInterval]);

  return data;
}
```
在根组件中我们使用刚刚的组件
```
import React, { useState } from "react";

// ...
import { useCoronaAPI } from "./hooks/useCoronaAPI";

function App() {
  const globalStats = useCoronaAPI("/all", {
    initialData: {},
    refetchInterval: 5000,
  });

  const [key, setKey] = useState("cases");
  const countries = useCoronaAPI(`/countries?sort=${key}`, {
    initialData: [],
    converter: (data) => data.slice(0, 10),
  });

  return (
    // ...
  );
}

export default App;
```
问题：会出现无限请求的问题
原因：组件陷入了初次渲染->触发effect->修改状态->再次渲染， useEffect 陷入无限循环的”罪魁祸首“了——因为没有提供正确的 deps！因为每次`converter = (data) => data`都是一个新的指针指向，所以在判断deps时，`Object.is`判断为false，导致effect每次都会执行，所以会一直发请求。

## useCallback
记忆化缓存（Memoization）的用处：
+ 缓存结果
+ 缓存返回值的指针

用法：
```
const memoizedCallback = useCallback(callback, deps);
```
一般我们把 deps传空数组，表示可以放心的缓存该callback

## useCallback和useMemo的关系
+ useCallback是为了解决函数的**引用相等**问题
+ useMemo是useCallback的超集，可以缓存任何值，useMemo的使用如下

    ```const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])```

以下两个写法是等价的：
```
useCallback(fn, deps);
useMemo(() => fn, deps)
```

一般来说useCallback够用了，毕竟需要缓存大量数据的情况也比较少
 
修复后的代码：
```
import { useState, useEffect, useCallback } from "react";

// ...

export function useCoronaAPI(
  // ...
) {
  const [data, setData] = useState(initialData);
  const convertData = useCallback(converter, []);

  useEffect(() => {
    const fetchData = async () => {
      // ...
      setData(convertData(data));
    };
    fetchData();

    // ...
  }, [convertData, path, refetchInterval]);

  return data;
}
```
