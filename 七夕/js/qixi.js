var container = $("#content");
var swipe = Swipe(container);
var visualWidth=container.width();
var visualHeight=container.height();
// 页面滚动到指定的位置
function scrollTo(time,proportionX){
    var distX=container.width()*proportionX;
    swipe.scrollTo(distX,time);
}
// 获取数据
var getValue=function(className){
    var elem=$(className);
    // 走路的路线坐标
    return {height:elem.height(),top:elem.position().top};
}
// 动画结束事件
var animationEnd=(function(){
    var explorer=navigator.userAgent;
    if(~explorer.indexOf('WebKit')){
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();
// 门的开关动作，通过接收的left和right值来进行transition动画实现开关门效果
function doorAction(left,right,time){
    var door=$('.door');
    var doorLeft=$('.door-left');
    var doorRight=$('.door-right');
    // 通过jquery生成defer对象；这个对象可以让我们从无尽的回调嵌套中脱离出来（比如animate()函数的嵌套），而使用链式调用
    var defer=$.Deferred();
    var count=2;  //计数器
    // 等待开/关门完成
    var complete=function(){
        count--;
        if(count===0){  //当第二次调用的时候才进入这里
            defer.resolve();  //调用defer对象的的resolver()后会改变defer的值，当defer的值改变的时候会触发defer对象的then()方法
            return;
        }
    }
    // 每次开/关门要调用两次complete，结果是执行一次defer,resolve()
    doorLeft.transition({'left':left},time,complete);
    doorRight.transition({'left':right},time,complete);
    return defer;
}
// 开门
function openDoor(){
    return doorAction('-50%','100%',2000);
}
// 关门
function shutDoor(){
    return doorAction('0%','50%',2000);
}
// 灯动画
var lamp={
    elem:$('.b_background'),
    bright:function(){
        this.elem.addClass('lamp-bright');
    },
    dark:function(){
        this.elem.removeClass('lamp-bright');
    }
}
// 飞鸟
var bird={
    elem:$('.bird'),
    fly:function(){
        this.elem.addClass('birdFly');
        this.elem.transition({right:container.width()},10000,'linear');
    }
}

var instanceX;
// 封装小男孩走路的各种方法
function BoyWalk(){
    var container=$('#content');
    // 页面可视区宽高
    var visualWidth=container.width();
    var visualHeight=container.height();
    // 获取数据：通过class得到元素的height和top值
    var getValue=function(className){
        var $elem=$(className);
        // 走路的路线坐标
        return {height:$elem.height(),top:$elem.position().top};
    };
    // 路的Y轴：返回路的中心到顶部的距离
    var pathY=function(){
        var data=getValue('.a_background_middle');
        return data.top+data.height/2;
    }();
    var boy=$('#boy');
    var boyHeight=boy.height();  //人物的高度
    // 通过计算得到人物的top值，将人物定位到路的垂直方向的中心位置
    boy.css({top:pathY-boyHeight+25});

    // 封装动画处理函数
    // CSS3走路动作变化
    function slowWalk(){
        boy.addClass('slowWalk');
    }
    // 暂停走路
    function pauseWalk(){
        boy.addClass('pauseWalk');
    }
    // 恢复走路
    function restoreWalk(){
        boy.removeClass('pauseWalk');
    }
    // 计算移动距离：传入移动的轴（x或y），移动的比例（页面宽度使用的浏览器宽度，所以只能用比例进行计算）
    function calculateDist(direction,proportion){
        return (direction=='x'?visualWidth:visualHeight)*proportion;
    }
    // 用transition做运动：接收transition过度参数和运动的时间；返回Deferred对象
    function startRun(options,runTime){
        // 通过jquery生成defer对象；这个对象可以让我们从无尽的回调嵌套中脱离出来（比如animate()函数的嵌套）
        var dfdPlay=$.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性
        boy.transition(options,runTime,'linear',function(){
            dfdPlay.resolve();  //当transition动画完成时的回调函数，改变Deferred对象的状态
        });
        return dfdPlay;
    }
    // 开始走路：接收行走的时间，X轴行走的距离，Y轴行走的距离（非必须）
    function walkRun(time,distX,disY){
        time=time||3000;
        // 脚动作
        slowWalk();
        // 开始走路，调用上面封装的startRun()，返回Deferred对象
        var d1=startRun({'left':distX,'top':disY?disY:undefined},time);
        return d1;
    }
    // 走进商店
    function walkToShop(runTime){
        var defer=$.Deferred();
        var doorObj=$('.door');
        // 门的坐标
        var offsetDoor=doorObj.offset();
        var doorOffsetLeft=offsetDoor.left;
        // 小孩当前的坐标
        var offsetBoy=boy.offset();
        var boyOffsetLeft=offsetBoy.left;
        // 当前需要移动的坐标：门中心坐标-小男孩中心坐标
        instanceX=(doorOffsetLeft+doorObj.width()/2)-(boyOffsetLeft+boy.width()/2);
        // 开始走路
        var walkPlay=startRun({
            transform:'translateX('+instanceX+'px),scale(0.3,0.3)',
            opacity:0.1
        },runTime);
        // 走路完毕，调用Deferred的done()方法，done和then差不多
        walkPlay.done(function(){
            boy.css('opacity',0);
            defer.resolve();
        });
        return defer;
    }
    // 走出店
    function walkOutShop(runTime){
        var defer=$.Deferred();
        restoreWalk();
        // 开始走路
        var walkPlay=startRun({
            transform:'translateX('+instanceX+'px),scale(1,1)',
            opacity:1
        },runTime);
        // 走路完毕
        walkPlay.done(function(){
            defer.resolve();
        });
        return defer;
    }
    // 取花
    function talkFlower(){
        var defer=$.Deferred();
        // 进门后取花需要1s，所以这里使用setTimeout延迟1s执行后才调用defer.resolve();
        setTimeout(function(){
            // boy.removeClass('slowWalk');  不是必须的，因为下面添加class后animation属性会覆盖
            boy.addClass('slowFlowerWalk');
            defer.resolve();
        },1000);
        return defer;
    }

    // 对外接口
    return {
        // 开始走路：接收行走的时间，X轴行走的距离，Y轴行走的距离（非必须）；返回一个Deferred对象
        walkTo:function(time,proportionX,proportionY){
            var distX=calculateDist('x',proportionX);
            var distY=calculateDist('y',proportionY);
            return walkRun(time,distX,distY);
        },
        // 停止走路
        stopWalk:function(){
            pauseWalk();
        },
        // 走进商店
        toShop:function(){
            return walkToShop.apply(null,arguments);
        },
        // 走出商店
        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },
        // 取花
        talkFlower:function(){
            return talkFlower();
        },
        // 获取男孩的宽度
        getWidth:function(){
            return boy.width();
        },
        // 复位初始状态
        resetOriginal:function(){
            this.stopWalk();
            boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        // 转身
        rotate:function(callback){
            restoreWalk();
            boy.addClass('boy-rotate');
            // 监听转身完毕
            if(callback){
                boy.on(animationEnd,function(){
                    callback();
                    $(this).off();
                });
            }
        }
    }
}

// 桥的Y轴
var bridgeY=function(){
    var data=getValue('.c_background_middle');
    return data.top;
}();

// 小女孩
var girl={
    elem:$('.girl'),
    getHeight:function(){
        return this.elem.height();
    },
    getWidth:function(){
        return this.elem.width();
    },
    // 修正位置
    setOffset:function(){
        this.elem.css({
            left:visualWidth/2,
            top:bridgeY-this.getHeight()
        });
    },
    getPosition: function() {
        return this.elem.position();
    },
    // 转身动作
    rotate:function(){
        this.elem.addClass('girl-rotate');
    }
}
// 修正小女孩位置
girl.setOffset();

// LOGO动画
var logo={
    elem:$('.logo'),
    run:function(){
        // 这里使用了animationEnd事件来监听CSS3动画的结束
        this.elem.addClass('logoIn').on(animationEnd,function(){
            $(this).addClass('logoshake').off();
        })
    }
}

// 飘花URL数组
var flowerURL=['./img/snowflakeURl-1.png','./img/snowflakeURl-2.png','./img/snowflakeURl-3.png','./img/snowflakeURl-4.png','./img/snowflakeURl-5.png','./img/snowflakeURl-6.png'];
// 飘花
function flower(){
    var flowerContainer=$('#flower');
    // 从6张图中随机获取一张
    function getImagesName(){
        return flowerURL[Math.floor(Math.random()*6)];
    }
    // 创建飘花元素
    function createFlowerBox(){
        var url=getImagesName();
        return $('<div class="flowerBox" />').css({width:41,height:41,position:"absolute",backgroundSize:"cover",zIndex:10000,top:"-41px",backgroundImage:"url("+url+")"}).addClass('flowerRoll');
    }
    // 开始飘花
    setInterval(function(){
        // 运动轨迹
        var startPositionLeft=Math.random()*visualWidth-100,
            startOpacity=1,
            endPositionTop=visualHeight-40,
            endPositionLeft=startPositionLeft-100+Math.random()*500,
            duration=visualHeight*10+Math.random()*5000;
        // 开始的透明度，不小于0.5
        var randomStart=Math.random();
        randomStart=randomStart<0.5?startOpacity:randomStart;
        // 创建一个飘花元素
        var flower=createFlowerBox();
        // 设置起点位置
        flower.css({left:startPositionLeft,opacity:randomStart});
        // 将飘花元素插入到飘花容器中
        flowerContainer.append(flower);
        // 开始执行动画
        flower.transition({top:endPositionTop,left:endPositionLeft,opacity:0.7},duration,'ease-out',function(){
            $(this).remove();  //结束后删除此元素
        });
    },200);
}

// 背景音乐
var audioConfig={
    enable:true,
    playURL:'./circulation.wav',
    cycleURL:'./happy.wav'
};
function audio(url,isloop){
    var audio=new Audio(url);
    audio.autoPlay=true;
    audio.loop=isloop||false;
    audio.play();
    return {
        end:function(callback){
            audio.addEventListener('ended',function(){
                callback();
            },false);
        }
    };
}