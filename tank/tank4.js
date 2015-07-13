// 定义tank类；父类；x横坐标，y纵坐标，direct方向：0上，1右，2下，3左
function Tank(x,y,direct){
    this.x=x;
    this.y=y;
    this.direct=direct;
    this.speed=1;
}
Tank.prototype.moveUp=function(){
    this.y-=this.speed;
    this.direct=0;
}
Tank.prototype.moveRight=function(){
    this.x+=this.speed;
    this.direct=1;
}
Tank.prototype.moveDown=function(){
    this.y+=this.speed;
    this.direct=2;
}
Tank.prototype.moveLeft=function(){
    this.x-=this.speed;
    this.direct=3;
}

// 子弹类
function Bullet(x,y,direct){
    this.x=x;
    this.y=y;
    this.direct=direct;
    this.speed=1;
    this.isLive=true;
    this.t_run=null;  //保存子弹运动定时器对象
}
Bullet.prototype.run=function(){  //修改子弹坐标运动
    // 子弹运动出画布则清除子弹移动的定时器
    if (this.x<0||this.x>400||this.y<0||this.y>300) {
        clearInterval(this.t_run);
        this.isLive=false;
    }else{
        switch(this.direct){
            case 0:
                this.y-=this.speed;
                break;
            case 1:
                this.x+=this.speed;
                break;
            case 2:
                this.y+=this.speed;
                break;
            case 3:
                this.x-=this.speed;
                break;
        }
    }
}

// 自己的tank；继承Tank
function Hero(x,y,direct){
    Tank.call(this,x,y,direct);
    this.color=["#BA9658","#FFD972"];  //tank的颜色
    this.heroBullet=[];
}
Hero.prototype=new Tank();
Hero.prototype.constructor=Hero;
Hero.prototype.shotEnemy=function(){
    switch(this.direct){
        case 0:
            var bullet=new Bullet(this.x+9,this.y,this.direct);  //创建子弹；子弹的坐标和方向与tank一致
            break;
        case 1:
            var bullet=new Bullet(this.x+30,this.y+9,this.direct);
            break;
        case 2:
            var bullet=new Bullet(this.x+9,this.y+30,this.direct);
            break;
        case 3:
            var bullet=new Bullet(this.x,this.y+9,this.direct);
            break;
    }
    this.heroBullet.push(bullet);
    heroBullet=this.heroBullet;  //需要保存下来供下面的setInterval()使用，setInterval()属于window对象，里面的this指向window，所以不能使用this.heroBullet
    heroBullet[heroBullet.length-1].t_run=setInterval("heroBullet["+(heroBullet.length-1)+"].run()",50);  //这里setInterval()里的第一个参数必须使用这种写法，下面两种写法都不行；这里的代码实际上会生成setInterval("heroBullet[0].run()",50)这样固定下标的格式，所以会一直执行相应的对象，而下面的每次都要运算heroBullet.length-1，所以当发射多个子弹的时候，定时器总会改变为执行最后一个对象，也就会造成定时器累积导致子弹越来越快的问题

    // heroBullet[heroBullet.length-1].t_run=setInterval("heroBullet[heroBullet.length-1].run()",50);
    
    // heroBullet[heroBullet.length-1].t_run=setInterval(function(){
    //     heroBullet[heroBullet.length-1].run();
    // },50);
}
Hero.prototype.drawHeroBullet=function(){  //画出所有子弹
    for(var i=0;i<this.heroBullet.length;i++){
        var heroBullet=this.heroBullet[i];
        if (heroBullet!=null&&heroBullet.isLive) {
            cxt.fillStyle="#FEF26E";
            cxt.fillRect(this.heroBullet[i].x,this.heroBullet[i].y,2,2);  //画出自己的子弹
        }
    }
}

// 敌军tank；继承Tank
function EnemyTank(x,y,direct){
    Tank.call(this,x,y,direct);
    this.color=["#00A2B5","#00FEFE"];
}
EnemyTank.prototype=new Tank();
EnemyTank.prototype.constructor=EnemyTank;

// 绘制tank，把绘制tank封装成一个函数；接收一个tank对象
function drawTank(tank){
    switch(tank.direct){
        case 0:  //上和下只是炮筒方向不同
        case 2:
            cxt.fillStyle=tank.color[0];
            cxt.fillRect(tank.x,tank.y,5,30);  //画出左边的矩形：轮子
            cxt.fillRect(tank.x+15,tank.y,5,30);  //画出右边的矩形：轮子
            cxt.fillRect(tank.x+6,tank.y+5,8,20);  //画出中间矩形
            cxt.fillStyle=tank.color[1];
            cxt.arc(tank.x+10,tank.y+15,4,0,2*Math.PI,true);  //画出TANK的盖子
            cxt.fill();
            cxt.beginPath();
            cxt.lineWidth=1.5;
            cxt.strokeStyle=tank.color[1];
            cxt.moveTo(tank.x+10,tank.y+15);
            if (tank.direct==0) {  //上时的炮筒
                cxt.lineTo(tank.x+10,tank.y);
            }else{  //下时的炮筒
                cxt.lineTo(tank.x+10,tank.y+30);
            }
            cxt.closePath();
            cxt.stroke();  //画出炮筒
            break;
        case 1:
        case 3:
            cxt.fillStyle="#BA9658";
            cxt.fillRect(tank.x,tank.y,30,5);  //画出左边的矩形：轮子
            cxt.fillRect(tank.x,tank.y+15,30,5);  //画出右边的矩形：轮子
            cxt.fillRect(tank.x+5,tank.y+6,20,8);  //画出中间矩形
            cxt.fillStyle="#FFD972";
            cxt.arc(tank.x+15,tank.y+10,4,0,2*Math.PI,true);  //画出TANK的盖子
            cxt.fill();
            cxt.beginPath();
            cxt.lineWidth=1.5;
            cxt.strokeStyle="#FFD972";
            cxt.moveTo(tank.x+15,tank.y+10);
            if (tank.direct==1) {
                cxt.lineTo(tank.x+30,tank.y+10);
            }else{
                cxt.lineTo(tank.x,tank.y+10);
            }
            cxt.closePath();
            cxt.stroke();  //画出炮筒
            break;
    }
}

