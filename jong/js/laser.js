function Laser(){
    this.x=0;
    this.y=0;
    this.w=6;
    this.h=80;
    this.speed=10;
    this.dir=0;  //方向
    var color=['#2bd347','#ff6600','#2ad3e7','#f96cfe','#ffe92e','orange','pink','white','blue','#7f017b','#aff2ee'];
    this.color=color[Math.floor(Math.random()*color.length)];
}
Laser.prototype.create=function(){
    // 随机取出一个方向（0123-上右下左）
    var dir=Math.floor(Math.random()*4);
    this.dir=dir;
    if(dir==0){
        this.x=jong.x+jong.w/2-this.w/2;
        this.y=-this.h;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.w,this.h);
        cxt.closePath();
    }else if(dir==1){
        this.x=canvas.width;
        this.y=jong.y+jong.h/2-this.w/2;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.h,this.w);
        cxt.closePath();
    }else if(dir==2){
        this.x=jong.x+jong.w/2-this.w/2;
        this.y=canvas.height;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.w,this.h);
        cxt.closePath();
    }else if(dir==3){
        this.x=-this.h;
        this.y=jong.y+jong.h/2-this.w/2;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.h,this.w);
        cxt.closePath();
    }
}
Laser.prototype.move=function(i){
    if(this.dir==0){
        this.y+=this.speed;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.w,this.h);
        cxt.closePath();
        // 碰撞检测
        if(!(this.x+this.w<jong.x||this.y+this.h<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h)){
            this.Gameover();
        }
    }else if(this.dir==1){
        this.x-=this.speed;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.h,this.w);
        cxt.closePath();
        // 碰撞检测
        if(!(this.x+this.h<jong.x||this.y+this.w<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h)){
            this.Gameover();
        }
    }else if(this.dir==2){
        this.y-=this.speed;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.w,this.h);
        cxt.closePath();
        // 碰撞检测
        if(!(this.x+this.w<jong.x||this.y+this.h<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h)){
            this.Gameover();
        }
    }else if(this.dir==3){
        this.x+=this.speed;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        cxt.fillRect(this.x,this.y,this.h,this.w);
        cxt.closePath();
        // 碰撞检测
        if(!(this.x+this.h<jong.x||this.y+this.w<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h)){
            this.Gameover();
        }
    }
    // 超出屏幕销毁判断
    if(this.destroy()){
        laser.splice(i,1);  //当可以销毁时从数组中删除这个对象
        score++;  //得分+1
        s.innerHTML=score;
        if(createLaserTime>300){
            createLaserTime-=10;
        }
    }
}
// 销毁激光：当超出屏幕时
Laser.prototype.destroy=function(){
    if(this.dir==0){
        if(this.y>canvas.height){
            return true;
        }
    }else if(this.dir==1){
        if(this.x<-this.h){
            return true;
        }
    }else if(this.dir==2){
        if(this.y<-this.h){
            return true;
        }
    }else if(this.dir==3){
        if(this.x>canvas.width){
            return true;
        }
    }
}
// 死亡的时候画出JONG，并重置游戏数据
Laser.prototype.Gameover=function(){
    cxt.beginPath();
    cxt.fillStyle='white';
    cxt.fillRect(jong.x,jong.y,jong.w,jong.h);
    cxt.closePath();
    // 左撇
    cxt.beginPath();
    cxt.strokeStyle='black';
    cxt.lineWidth=2;
    cxt.moveTo(jong.x+10,jong.y+5);
    cxt.lineTo(jong.x+2,jong.y+12);
    cxt.stroke();
    cxt.closePath();
    // 右拉
    cxt.beginPath();
    cxt.strokeStyle='black';
    cxt.lineWidth=2;
    cxt.moveTo(jong.x+20,jong.y+5);
    cxt.lineTo(jong.x+28,jong.y+12);
    cxt.stroke();
    cxt.closePath();
    // 下口
    cxt.beginPath();
    cxt.strokeStyle='black';
    cxt.lineWidth=2;
    cxt.strokeRect(jong.x+10,jong.y+18,10,14);
    cxt.closePath();
    console.log(score,highestScore)
    // 判断是否破纪录
    if(score>highestScore){
        console.log(1)
        highest.innerHTML=score;
        localStorage.highestScore=score;
    }
    // 重置游戏数据
    info.style.marginTop=-100+'px';
    laser=[];
    createLaserTime=1000;
    clearInterval(timer);
    clearInterval(timer2);
    score=0;
}