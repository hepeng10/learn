var chess=document.getElementById('chess');
var cxt=chess.getContext('2d');

// 创建一个二维数组，用来存储棋盘棋子信息。0为没落子，1为已落黑子，2为已落白子
var chessBoard=[];
for (var i = 0; i < 15; i++) {
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
    }
}

cxt.strokeStyle="#BFBFBF";

var bg=new Image();
bg.src="img/bg.png";
// 在画图的时候，需要等图片加载完毕才行，所以画图必须写在onload里
bg.onload=function(){
    // 使用drawImage()往canvas里画图
    cxt.drawImage(bg,0,0,450,450);
    // 由于绘制顺序，我们希望图片在棋盘下方，所以把画棋盘也放在这里面。如果写在外面，图片加载会有个过程，会导致先画棋盘
    // 画棋盘
    drawChessBoard();
    // 画棋子（圆）
    // oneStep(0,0,true);
    // oneStep(1,1,false);
}

// 画棋盘函数(内边距15px，每条线间隔30px)
var drawChessBoard=function(){
    for(var i=0;i<15;i++){
        // 画纵向线
        cxt.moveTo(15+i*30,15);
        cxt.lineTo(15+i*30,450-15);
        cxt.stroke();
        // 画横向线
        cxt.moveTo(15,15+i*30);
        cxt.lineTo(450-15,15+i*30);
        cxt.stroke();
    }
}

// 画棋子。
// 参数：i：横向位置；j：纵向位置；me：我或电脑；
// oneStep(2,5,true);
var oneStep=function(i,j,me){
    cxt.beginPath();
    // 通过i和j计算出圆心的位置，从而得到棋子的位置
    cxt.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    cxt.closePath();
    // 设置渐变。通过createRadialGradient()创建一个渐变对象，参数是两个圆的圆心和半径
    // var gradient=cxt.createRadialGradient(200,200,50,200,200,20);
    var gradient=cxt.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);  //为了好看，这里讲圆心进行了移动
    // 给两个渐变的位置设置不同的颜色
    if(me){
        gradient.addColorStop(0,"#0A0A0A");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#D1D1D1");
        gradient.addColorStop(1,"#F9F9F9");
    }
    // 将填充设置为渐变对象
    cxt.fillStyle=gradient;
    cxt.fill();
}

// 鼠标点击落子
var me=true;
chess.onclick=function(e){
    // 获取到canvas上点击位置的坐标（距离canvas左上角的位置）
    var x=e.offsetX;
    var y=e.offsetY;
    // 除以30并向下取整就能得到与棋盘上的点对应的坐标
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
    console.log(x,y)
    console.log(i,j)
    // 当点击的位置为0（未落子），才画棋子
    if(!chessBoard[i][j]){
        // 画棋子
        oneStep(i,j,me);
        if(me){
            chessBoard[i][j]=1;
        }else{
            chessBoard[i][j]=2;
        }
        me=!me;  //取反后，就能一个颜色一次了
    }
}
