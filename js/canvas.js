
jQuery.fn.extend({
    canvasAnimate: function (con) {
        var clearBool = false;
        var interTime = "";//定时器
        var $canvas = $(this).eq(0);
        var context = $canvas.get(0).getContext('2d');
        var objWidth = $canvas.parent().width();
        var objHeight = $canvas.parent().height();
        var MaxObjNum = GetConfig("MaxObjNum");  //圆点数量
        var colorList = GetConfig("colorList"); //圆点颜色列表
        var objList = [];
        var speedList = GetConfig("speedList");  //圆点速度列表
        var linkWidth = GetConfig("linkWidth");  //圆点在0-100之间开始连线
        var radiusList = GetConfig("radiusList");  //圆半径的列表
        var mouse = {"pageX":objWidth/2,"pageY":objHeight/2};

        function GetConfig(str){
            var config = {
                MaxObjNum:40, //圆点数量
                colorList:["#FF0000","#AAD7FF","yellow","#FFD7AA"], //圆点颜色列表
                speedList:[5,6,4.5,4,5.5], //圆点颜色列表
                linkWidth:100,//圆点在0-100px之间开始连线
                radiusList:[2,3,4] //圆半径的列表
            };

            if(con == undefined || con[str] == undefined){
                return config[str];
            }else{
                return con[str];
            }
        }

        //添加圆点
        function createSro(){
            if(objList.length >= MaxObjNum){
                return false;
            }
            var direction = GetRandomNum(0,3);
            var colorNum = GetRandomNum(0,colorList.length-1);
            var color = colorList[colorNum];
            var r = GetRandomNum(0,radiusList.length-1);
            var maxWidth = GetRandomNum(0,objWidth);
            var maxHeight = GetRandomNum(0,objHeight);
            var speedNum = GetRandomNum(0,speedList.length-1);
            var speed =speedList[speedNum];
            r =radiusList[r];
            var rLeft,rTop;
            switch (direction){
                case 0: //方向为上
                    rLeft = maxWidth;
                    rTop = 0;
                    break;
                case 1: //方向为右
                    rLeft = objWidth;
                    rTop = maxHeight;
                    break;
                case 2: //方向为下
                    rLeft = maxWidth;
                    rTop = objHeight;
                    break;
                case 3: //方向为左
                    rLeft = 0;
                    rTop = maxHeight;
                    break;
            }

            objList.push({ "rLeft":rLeft,"rTop":rTop,"speed":speed,"color":color,"r":r});
            createSro();
        }

        //动画效果
        function animateStart(){
            //{ "rLeft":rLeft,"rTop":rTop,"speed":speed}
            //初始化画布
            objWidth = $canvas.parent().width();
            objHeight = $canvas.parent().height();
            $canvas.get(0).width = objWidth;
            $canvas.get(0).height =objHeight;
            context.clearRect(0,0,objWidth,objHeight);

            //运动后的位置
            var animateObjList = objList;
            for(var i =0;i<animateObjList.length;i++){
                var objSro = animateObjList[i];
                var speed = objSro["speed"];
                var rLeft,rTop,sqrt;
                var width = objSro["rLeft"] > mouse["pageX"]?objSro["rLeft"] - mouse["pageX"]:mouse["pageX"] - objSro["rLeft"];
                var height = objSro["rTop"] > mouse["pageY"]?objSro["rTop"] - mouse["pageY"]:mouse["pageY"] - objSro["rTop"];
                if(Math.round(width) == 0 && Math.round(height) == 0){
                    objList.splice(i,1);
                    continue;
                }
                sqrt = Math.sqrt(width*width + height*height);
                rLeft = (speed/sqrt)*width;
                if(objSro["rLeft"] > mouse["pageX"]){
                    rLeft = objSro["rLeft"] - rLeft;
                    rLeft = rLeft > mouse["pageX"]?rLeft:mouse["pageX"];
                }else{
                    rLeft = objSro["rLeft"] + rLeft;
                    rLeft = rLeft > mouse["pageX"]?mouse["pageX"]:rLeft;
                }
                rTop = (speed/sqrt)*height;
                if(objSro["rTop"] > mouse["pageY"]){
                    rTop = objSro["rTop"] - rTop;
                    rTop = rTop > mouse["pageY"]?rTop:mouse["pageY"];
                }else{
                    rTop = objSro["rTop"] + rTop;
                    rTop = rTop > mouse["pageY"]?mouse["pageY"]:rTop;
                }
                objList[i]["oldLeft"] = objList[i]["rLeft"];
                objList[i]["oldTop"] = objList[i]["rLeft"];
                objList[i]["rLeft"] = rLeft;
                objList[i]["rTop"] = rTop;
            }
            createSro(); //圆点补充

            //绘制连线
            for(var i= 0;i<objList.length;i++){
                for(var j = i+1;j<objList.length;j++){
                    var objOne = objList[i];
                    var objTwo = objList[j];
                    var ourWith = Math.abs(objOne["rLeft"] - objTwo["rLeft"]);
                    var ourHeight = Math.abs(objOne["rTop"] - objTwo["rTop"]);
                    var ourLink = Math.sqrt(ourHeight*ourHeight + ourWith*ourWith);
                    ourLink = Math.abs(ourLink - objOne["r"] - objTwo["r"]);
                    /*
                     if(ourLink < objOne["r"] + objTwo["r"]){
                     var number = objOne["speed"]>objTwo["speed"]?j:i;
                     objList[number]["rLeft"] = objList[number]["oldLeft"];
                     objList[number]["rLeft"] = objList[number]["oldTop"];
                     continue;
                     }
                     */
                    if(ourLink < linkWidth){
                        // 创建渐变
                        var gradient=context.createLinearGradient(0,0,ourLink,0);
                        gradient.addColorStop(0,"#ffffff");
                        gradient.addColorStop("0.5","#EFEFEF");
                        gradient.addColorStop(1,"#ffffff");

                        context.beginPath();
                        context.lineWidth=1;
                        context.strokeStyle=gradient;
                        context.moveTo(objOne["rLeft"],objOne["rTop"]);
                        context.lineTo(objTwo["rLeft"],objTwo["rTop"]);
                        context.stroke();
                        context.closePath() //注意此处

                    }
                }
            }

            //绘制圆点
            for(var i = 0;i<objList.length;i++){
                context.beginPath();
                context.fillStyle=objList[i]["color"];
                context.arc(objList[i]["rLeft"],objList[i]["rTop"],objList[i]["r"],0,Math.PI*2);
                context.fill();
                context.closePath() //注意此处
            }
        }

        //获取随机数
        function GetRandomNum(Min,Max){
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }

        //初始化
        function init(){
            //初始化画布
            $canvas.get(0).width = objWidth;
            $canvas.get(0).height =objHeight;
            createSro();
            interTime = setInterval(animateStart,50);
        }

        init();
        //鼠标移动事件
        $(document).mousemove(function(e){
            mouse = {"pageX":e.pageX,"pageY":e.pageY - $(document).scrollTop()};
            //console.log(e.pageX + ", " + e.pageY);
        });
    }
});



