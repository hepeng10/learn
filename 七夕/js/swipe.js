//页面滑动（背景图的滚动）
/*
 *@param {[type]} container [页面容器节点]
 *@param {[type]} option [参数]
 */
function Swipe(container){
    var element=container.find(':first');  //获取第一个子节点
    var swipe={};  //滑动对象，调用Swipe函数后会返回这个swipe对象
    var slides=element.find('>');  //获取子元素，没有孙元素
    // 获取容器尺寸
    var width=container.width();
    var height=container.height();
    // 通过li的个数设置容器总宽度
    element.css({width:width*slides.length,height:height});
    // 给每个li设置宽高
    $.each(slides,function(index){
        var slide=slides.eq(index);  //获取到每一个li
        slide.css({width:width,height:height});
    });
    // 封装动画，传入滚动的距离和所需事件
    swipe.scrollTo=function(x,speed){
        // 给容器添加动画的各项属性，实现动画
        element.css({
            'transform':'translate3d(-'+x+'px,0px,0px)',
            'transition-timing-function':'linear',
            'transition-duration':speed+'ms'
        });
        return this;
    }
    return swipe;
}