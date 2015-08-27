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
    // 恢复走路动画
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
        }
    }
}