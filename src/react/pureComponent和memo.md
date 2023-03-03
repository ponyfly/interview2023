# React.memo

React.memo是一个高阶组件，类似于React.pureComponent,但memo是一个函数组件而不是一个类

假如我们又一下场景：
```jsx
import React  from 'react';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date : new Date()
        }
    }

    componentDidMount(){
        setInterval(()=>{
            this.setState({
                date:new Date()
            })
        },1000)
    }

    render(){
        return (
            <div>
                <Child seconds={1}/>
                <div>{this.state.date.toString()}</div>
            </div>
        )
    }
}
```
父组件有一个计时器，每次date变更的时候都会渲染组件，但是很明显我们不希望Child跟着更新，此时我们可以使用PureComponent这样做：

```jsx

class Child extends React.pureComponent {
	render () {
			return (
				<div>I am update every {this.props.seconds} seconds</div>
			)
    }
}
```
那么现在我们可以使用memo满足创建纯函数而不是一个类的需求
```jsx
function Child (seconds) {
	return (
			<div>I am update every {seconds} seconds</div>
    )
}
export default React.memo(Child)
```

React.memo()可接受2个参数，第一个参数为纯函数的组件，第二个参数用于对比props控制是否刷新，与shouldComponentUpdate()功能类似
```jsx

import React from "react";

function Child({seconds}){
    console.log('I am rendering');
    return (
        <div>I am update every {seconds} seconds</div>
    )
};

function areEqual(prevProps, nextProps) {
    if(prevProps.seconds===nextProps.seconds){
        return true
    }else {
        return false
    }

}
export default React.memo(Child,areEqual)
```
