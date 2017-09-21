# particle-effect
这是一个基于canvas实现的粒子运动特效，可以用做页面的背景。演示地址：[http://jsfiddle.net/SmallStone/uqq83dfw/3/](http://jsfiddle.net/SmallStone/uqq83dfw/3/)

# 示例
![](http://oo819l870.bkt.clouddn.com/particle-effect.gif)

# 基本使用
1. body插入一个canvas元素，并赋予一个唯一的id(比如bg);
2. 页面引入ParticleEffect.js;
3. 调用ParticleEffect.run(config)方法，其中config必须包含canvas的id，config还支持其他多项配置;

# config配置
|属性|类型|例子|说明|
|---|----|---|---|
|id|string|'bg'|必传, canvas的id|
|count|number|50|可选, 粒子数量, 默认100|
|radius|number|8|可选, 粒子半径, 默认5|
|vxRange|array|[-1,1]|可选, 粒子水平运动速度范围, 符号代表运动方向, 默认[-1, 1]|
|vyRange|array|[-1,1]|可选, 粒子垂直运动速度范围, 符号代表运动方向, 默认[-1, 1]|
|scaleRange|array|[0.5,1.5]|可选, 粒子大小缩放范围, 默认[0.5, 1]|
|lineLenThreshold|number|100|可选, 粒子之间的距离阈值，小雨这个值粒子之间会连线, 默认125|
|color|string|'rgba(255,255,255,.2)'|可选, 粒子和线的颜色, 支持十六进制、rgb、rgba三种形式, 默认'rgba(255,255,255,.2)'|
