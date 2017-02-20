function Food(cxt){
    this.x=0;
    this.y=0;
    this.color="green";
}
// 创建食物：当新食物不在蛇身上，也不在蛇头上，也不在新的蛇头位置才能创建
Food.prototype.create=function(){
    var isCreate=true;
    for(var i=0;i<100;i++){
        isCreate=true;  //每次遍历的时候重置
        this.x=Math.floor(Math.random()*map.rowNum)*map.width;
        this.y=Math.floor(Math.random()*map.rowNum)*map.width;
        for(var j=0;j<snake.body.length;j++){
            if(this.x==snake.body[j].x&&this.y==snake.body[j].y){
                isCreate=false;
                break;
            }
        }
        if(this.x==snake.head.x&&this.y==snake.head.y){
            isCreate=false;
        }
        if(this.x==snake.newHead.x&&this.y==snake.newHead.y){
            isCreate=false;
        }
        // 当食物的坐标即没在蛇身上，也没在头上，则创建
        if(isCreate){
            cxt.beginPath();
            cxt.fillStyle=this.color;
            cxt.fillRect(this.x,this.y,map.width,map.width);
            cxt.closePath();
            return true;
        }
    }
        console.log(this.x+'|'+this.y)
    // 100次随机都没找到位置，则手动给位置
    if(!isCreate){
        outerloop:
        for(var i=0;i<map.rowNum-1;i++){
            for(var j=0;j<map.rowNum-1;j++){
                isCreate=true;
                this.x=i*map.width;
                this.y=j*map.width;
                for(var k=0;k<snake.body.length;k++){
                    if(this.x==snake.body[k].x&&this.y==snake.body[k].y){
                        isCreate=false;
                        break;
                    }
                }
                if(this.x==snake.head.x&&this.y==snake.head.y){
                    isCreate=false;
                }
                if(this.x==snake.newHead.x&&this.y==snake.newHead.y){
                    isCreate=false;
                }
                if(isCreate){
                    cxt.beginPath();
                    cxt.fillStyle=this.color;
                    cxt.fillRect(this.x,this.y,map.width,map.width);
                    cxt.closePath();
                    break outerloop;
                }
            }
        }
    }
    if(!isCreate){
        alert("你太牛逼了~！打败了全世界99.99%的人！这游戏已经不能满足你了！");
        clearInterval(snake.moveT);
    }
}
// 重绘食物
Food.prototype.reCreate=function(){
    cxt.beginPath();
    cxt.fillStyle=this.color;
    cxt.fillRect(this.x,this.y,map.width,map.width);
    cxt.closePath();
}