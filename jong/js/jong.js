function Jong(){
    // 原点坐标（左上角）
    this.x=0;
    this.y=0;
    // 宽高
    this.w=30;
    this.h=30;
    // 移动速度
    this.speed=20;
}
// 初始化
Jong.prototype.init=function(){
    // 初始化JONG的位置
    this.x=canvas.width/2-this.w/2;
    this.y=canvas.height/2-this.h/2;
    this.draw();
    this.move();
}
// 画出JONG
Jong.prototype.draw=function(){
    // 整个方块
    cxt.beginPath();
    cxt.fillStyle='white';
    cxt.fillRect(this.x,this.y,this.w,this.h);
    cxt.closePath();
    // 左撇
    cxt.beginPath();
    cxt.strokeStyle='black';
    cxt.lineWidth=2;
    cxt.moveTo(this.x+2,this.y+7);
    cxt.lineTo(this.x+12,this.y+7);
    cxt.stroke();
    cxt.closePath();
    // 右拉
    cxt.beginPath();
    cxt.strokeStyle='black';
    cxt.lineWidth=2;
    cxt.moveTo(this.x+18,this.y+7);
    cxt.lineTo(this.x+28,this.y+7);
    cxt.stroke();
    cxt.closePath();
    // 下口
    cxt.beginPath();
    cxt.strokeStyle='black';
    cxt.lineWidth=2;
    cxt.strokeRect(this.x+10,this.y+18,10,8);
    cxt.closePath();
}
// 移动：定时器中执行，不断的根据触摸的坐标来往触摸位置移动
Jong.prototype.move=function(){
    // touchX不为0才移动（手指按下后不为0）
    if(touchX){
        var a=touchX-this.x;  //计算出触摸点和JONG的x轴距离
        var b=touchY-this.y;  //计算出触摸点和JONG的y轴距离
        // 当a和b都等于0，则到达终点，不再执行里面的代码进行运动
        if(Math.abs(a)>0||Math.abs(b)>0){
            var c=Math.ceil(Math.sqrt(a*a+b*b));  //勾股定理得出触摸点到JONG的直线距离
            var iSpeedX=Math.floor(this.speed*a/c);  //通过等比关系得到x轴的速度：cSpeed/c=aSpeed/a得到aSpeed=cSpeed/c*a
            var iSpeedY=Math.floor(this.speed*b/c);  //得到y轴的速度
            // 定时器每次调用修改JONG的坐标
            this.x+=iSpeedX;
            this.y+=iSpeedY;
            // 因为每次移动是加上速度值，比如距离终点为1，而速度为3，则移动后会超过终点，然后又往回移，导致不断震动的BUG，所以这里进行了判断，当距离终点小于一定的值便到达终点
            if(Math.abs(this.x-touchX)<=Math.abs(iSpeedX)&&Math.abs(this.y-touchY)<=Math.abs(iSpeedY)){
                this.x=touchX;
                this.y=touchY;
            }
        }
    }
    this.draw();
}