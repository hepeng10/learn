function Map(cxt,dif){
    this.cxt=cxt;
    switch(dif){
        case 0:
            this.rowNum=10;
            break;
        case 1:
            this.rowNum=16;
            break;
        case 2:
            this.rowNum=20;
            break;
    }
    this.width=0;
}
// 绘制地图
Map.prototype.draw=function(){
    this.width=640/this.rowNum;
    for(var i=0;i<this.rowNum;i++){
        for(var j=0;j<this.rowNum;j++){
            this.cxt.beginPath();
            this.cxt.strokeStyle="#ccc";
            this.cxt.strokeRect(i*this.width,j*this.width,this.width,this.width);
            this.cxt.closePath();
        }
    }
}