function Snake(cxt,dif){
    // this.cxt=cxt;
    this.width=map.width;
    this.head={x:0,y:0};
    this.newHead={x:0,y:0};
    this.body=[];  //会得到[{x:0,y:0},{x:50,y:0}]这样的结果，第一个元素是最后一个尾巴，最后一个元素是挨着头的尾巴
    this.dir=1;  //当前走的方向：0上，1右，2下，3左
    this.newDir=1;  //每次划动后的新方向
    this.headColor='#ccc';
    this.bodyColor='#666';
    switch(dif){
        case 0:
            this.speed=1000;
            this.maxSpeed=100;
            break;
        case 1:
            this.speed=900;
            this.maxSpeed=100;
            break;
        case 2:
            this.speed=800;
            this.maxSpeed=100;
            break;
    }
    this.moveT=null;  //蛇移动的定时器
}
// 初始化蛇
Snake.prototype.init=function(){
    // 绘制蛇头
    this.head.x=2*this.width;
    this.head.y=0;
    cxt.beginPath();
    cxt.fillStyle=this.headColor;
    cxt.fillRect(this.head.x,this.head.y,this.width,this.width);
    cxt.closePath();
    // 绘制蛇身
    for(var i=0;i<2;i++){
        this.body[i]={};
        this.body[i].x=i*this.width;
        this.body[i].y=0;
        cxt.beginPath();
        cxt.fillStyle=this.bodyColor;
        cxt.fillRect(this.body[i].x,this.body[i].y,this.width,this.width);
        cxt.closePath();
    }
    this.move();
    this.changeDir();
}
// 移动蛇
Snake.prototype.move=function(){
    var that=this;
    this.moveT=setInterval(function(){
        // 先通过新的方向得到头部新坐标，判断方向是否正确（不能往后走）
        switch(that.newDir){
            case 0:  //上
                var res=that.isDir({x:0,y:-that.width});
                if(res==true){
                    that.dir=that.newDir;
                }else{
                    that.newDir=that.dir;
                }
                break;
            case 1:  //右
                var res=that.isDir({x:that.width,y:0});
                if(res==true){
                    that.dir=that.newDir;
                }else{
                    that.newDir=that.dir;
                }
                break;
            case 2:  //下
                var res=that.isDir({x:0,y:that.width});
                if(res==true){
                    that.dir=that.newDir;
                }else{
                    that.newDir=that.dir;
                }
                break;
            case 3:  //左
                var res=that.isDir({x:-that.width,y:0});
                if(res==true){
                    that.dir=that.newDir;
                }else{
                    that.newDir=that.dir;
                }
                break;
        }
        // 通过方向进行移动
        switch(that.dir){
            case 0:  //上
                if(!that.isMove({x:0,y:-that.width})){
                    return false;
                }else{
                    that.reDraw({x:0,y:-that.width});
                }
                break;
            case 1:  //右
                if(!that.isMove({x:that.width,y:0})){
                    return false;
                }else{
                    that.reDraw({x:that.width,y:0});
                }
                break;
            case 2:  //下
                if(!that.isMove({x:0,y:that.width})){
                    return false;
                }else{
                    that.reDraw({x:0,y:that.width});
                }
                break;
            case 3:  //左
                if(!that.isMove({x:-that.width,y:0})){
                    return false;
                }else{
                    that.reDraw({x:-that.width,y:0});
                }
                break;
        }
    },this.speed);
}
// 重绘蛇和地图
Snake.prototype.reDraw=function(json){
    this.newHead.x=this.head.x+json.x;
    this.newHead.y=this.head.y+json.y;
    // 先清除canvas，重绘地图
    cxt.clearRect(0,0,640,640);
    // var newMap=new Map(cxt);
    map.draw();
    // 重绘食物
    food.reCreate();
    this.isEat();
    // 绘制头部新位置
    cxt.beginPath();
    cxt.fillStyle=this.headColor;
    cxt.fillRect(this.newHead.x,this.newHead.y,this.width,this.width);
    cxt.closePath();
    // 绘制蛇身：首先依次将尾巴绘制到后一个的位置，但是不能绘制最后一个尾巴（挨着头那一个）
    for(var i=0;i<this.body.length-1;i++){
        cxt.beginPath();
        cxt.fillStyle=this.bodyColor;
        cxt.fillRect(this.body[i+1].x,this.body[i+1].y,this.width,this.width);
        cxt.closePath();
        // 更新尾巴的位置
        this.body[i].x=this.body[i+1].x;
        this.body[i].y=this.body[i+1].y;
    }
    // 绘制挨着头的那个尾巴，绘制到移动前的头的位置
    cxt.beginPath();
    cxt.fillStyle=this.bodyColor;
    cxt.fillRect(this.head.x,this.head.y,this.width,this.width);
    cxt.closePath();
    // 更新第一个身子的坐标
    this.body[this.body.length-1].x=this.head.x;
    this.body[this.body.length-1].y=this.head.y;
    // 更新头部坐标
    this.head.x=this.newHead.x;
    this.head.y=this.newHead.y;
}
// 改变方向
Snake.prototype.changeDir=function(){
    var that=this;
    function start(e){
        var touch=e.changedTouches[0];
        var startX=touch.pageX;
        var startY=touch.pageY;
        function end(e){
            var touch=e.changedTouches[0];
            var stopX=touch.pageX;
            var stopY=touch.pageY;
            if(stopX-startX>0&&Math.abs(stopX-startX)>Math.abs(stopY-startY)){  //右
                that.newDir=1;
            }else if(stopX-startX<0&&Math.abs(stopX-startX)>Math.abs(stopY-startY)){  //左
                that.newDir=3;
            }else if(stopY-startY>0&&Math.abs(stopY-startY)>Math.abs(stopX-startX)){  //下
                that.newDir=2;
            }else if(stopY-startY<0&&Math.abs(stopY-startY)>Math.abs(stopX-startX)){  //上
                that.newDir=0;
            }
            document.removeEventListener('touchend',end,false);
        }
        document.addEventListener('touchend',end,false);  //必须移除end事件，不然多划一次就会多一个end
    }
    document.addEventListener('touchstart',start,false);
}
// 判断新的方向是否正确（不能反向移动）
Snake.prototype.isDir=function(json){
    // 蛇头部新坐标
    this.newHead.x=this.head.x+json.x;
    this.newHead.y=this.head.y+json.y;
    // 如果头部新位置和后一个身子的位置相同，则说明方向有误，不修改方向
    if(this.newHead.x==this.body[this.body.length-1].x&&this.newHead.y==this.body[this.body.length-1].y){
        return false;
    }else{
        return true;
    }
}
// 判断蛇是否能移动（撞到尾巴或墙则死了）
Snake.prototype.isMove=function(json){
    // 蛇头部新坐标
    this.newHead.x=this.head.x+json.x;
    this.newHead.y=this.head.y+json.y;
    if(this.newHead.x>=640||this.newHead.x<0||this.newHead.y<0||this.newHead.y>=640){  //超过边界退出游戏
        clearInterval(this.moveT);
        alert('Game Over');
        reStart();
        return false;
    }else if(!this.isTail()){  //碰到尾巴退出游戏
        clearInterval(this.moveT);
        alert('Game Over');
        reStart();
        return false;
    }else{
        return true;
    }
}
// 判断是否吃到食物
Snake.prototype.isEat=function(){
    // 如果吃到食物
    if(this.newHead.x==food.x&&this.newHead.y==food.y){
        oScore.innerHTML=parseInt(oScore.innerHTML)+1;
        // 往body的第一个元素位置推入一个和第一个元素一样坐标的元素，这样在重绘的时候坐标依次往后移动后，由于第一个元素和第二个元素坐标相等，也就能保持最后一个尾巴位置不动了
        this.body.unshift({x:this.body[0].x,y:this.body[0].y});
        // 重新创建个食物
        food=new Food();
        food.create();
        // 提高移动速度
        if(this.speed>this.maxSpeed){
            this.speed-=25;
        }
        // 清除一次定时器重新运动，速度才能增加
        clearInterval(this.moveT);
        this.move();
    }
}
// 判断是否碰到尾巴
Snake.prototype.isTail=function(){
    for(var i=0;i<this.body.length;i++){
        if(this.newHead.x==this.body[i].x&&this.newHead.y==this.body[i].y){
            return false;
        }
    }
    return true;
}