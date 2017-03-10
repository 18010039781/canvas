# canvas
想做个由圆点连线出球形的动态，然后做了不断消失的圆点

## 地址
[点击这里，你可以链接到demo](https://18010039781.github.io/canvas/)

##参数设置
     //默认配置：
    var config = {
        MaxObjNum:40, //圆点数量
        colorList:["#FF0000","#AAD7FF","yellow","#FFD7AA"], //圆点颜色列表
        speedList:[5,6,4.5,4,5.5], //圆点颜色列表
        linkWidth:80,//圆点在0-100px之间开始连线
        radiusList:[2,3,4] //圆半径的列表
    };
    $("#canvas").canvasAnimate(config);
