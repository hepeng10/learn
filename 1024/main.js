var board=new Array();  //保存16个格子，每个格子显示的数字
var score=0;
var hasConflicted=new Array();  //用来记录格子是否已经发生过叠加，避免一次移动多次叠加
var startx,starty,endx,endy;
// 开始游戏
$(function(){
    prepareForMobile();  //移动端游戏初始化
    newgame();
});
// 判断是否为PC端
function isPC()  
{  
   var userAgentInfo = navigator.userAgent;  
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
   var flag = true;  
   for (var v = 0; v < Agents.length; v++) {  
       if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
   }  
   return flag;  
}  
// 移动端初始化
function prepareForMobile(){
    if (isPC()) {
        gridContainerW=500;
        cellSpace=20;
        cellSideLength=100;
    }
    $('#grid-container').css({
        'width': gridContainerW-2*cellSpace+'px',
        'height': gridContainerW-2*cellSpace+'px',
        'padding' : cellSpace+'px',
        'border-radius' : 0.02*gridContainerW+'px'
    });
    $('.grid-cell').css({
        'width': cellSideLength+'px',
        'height': cellSideLength+'px',
        'border-radius' : 0.02*cellSideLength+'px'
    });
}
// 开始新游戏
function newgame(){
    // 初始化棋盘格
    init();
    // 随机在两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

// 初始化
function init(){
    // 定位16个格子
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell=$('#grid-cell-'+i+'-'+j);  //获取每个格子
            gridCell.css('top',getPosTop(i,j));  //设置每个格子的Top值和Left值
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    // 将board转转换为二维数组
    for (var i = 0; i < 4; i++) {
        board[i]=new Array(); 
        hasConflicted[i]=new Array(); 
        for (var j = 0; j < 4; j++) {
            board[i][j]=0;  //将每个格子的值设置为0；0表示没有数字
            hasConflicted[i][j]=false;
        }  
    }
    // 更新board的值
    updateBoardView();
    score=0;
}
// 更新board的值
function updateBoardView(){
    $('.number-cell').remove();  //每次更新的时候需要先删除所有的数字再更新
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');  //生成16个用于显示数字的div
            var theNumberCell=$('#number-cell-'+i+'-'+j);
            if (board[i][j]==0) {  //当为0的时候，即没有数字，这个格子不显示
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);  //将格子定位到相应的位置
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));  //将格子定位到相应的位置
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));  //为格子设置背景色
                theNumberCell.css('color',getNumberColor(board[i][j]));  //为格子设置前景色
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
// 随机在一个格子生成数字
function generateOneNumber(){
    if (nospace(board)) {  //如果所有格子有数字了，则不生成数字
        return false;
    }
    // 随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));  //生成一个0-3的随机数
    var randy=parseInt(Math.floor(Math.random()*4));  //生成一个0-3的随机数
    var times=0;
    while(times<50){  //这里是随机选个位置并判断这个位置是否有数字，如果没有则生成数字。但是可能出现不断随机到相同的有数字的位置，导致性能问题，所以只给随机生成50次机会，如果50次都没随机到空位置，则停止随机使用人工生成
        if (board[randx][randy]===0) {  //如果当前位置为空，则这个位置可用，跳出循环
            break;
        }
        // 否则重新生成一个随机位置，继续判断
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if (times===50) {  //人工在第一个没有数字的地方生成数字
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j]===0) {
                    randx=i;
                    randy=j;
                }
            }
        }
    }
    // 随机生成一个2或者4的数
    var randNumber=Math.random()<0.5?2:4;
    // 在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

// 监控键盘事件响应
$(document).keydown(function(e){
    e.preventDefault();  //阻止默认行为，避免浏览器有滚动条时会产生滚动条的滚动
    switch(e.keyCode){
        case 37:  //left
            if(moveLeft()){
                generateOneNumber();
                isGameover();
            }
            break;
        case 38:  //up
            if(moveUp()){
                generateOneNumber();
                isGameover();
            }
            break;
        case 39:  //right
            if(moveRight()){
                generateOneNumber();
                isGameover();
            }
            break;
        case 40:  //down
            if(moveDown()){
                generateOneNumber();
                isGameover();
            }
            break;
    }
});

// 监控移动端滑动事件
document.addEventListener('touchstart', function(e){
    startx=e.touches[0].pageX;  //获取触摸的X坐标。touches数组保存着多点触控的信息，这里只有一个点，所以为0
    starty=e.touches[0].pageY;
});
document.addEventListener('touchmove',function(e){  //上下滑动的时候可能是触发默认的滚屏事件，从而产生BUG，需要阻止此事件
    e.preventDefault();
});
document.addEventListener('touchend', function(e){
    endx=e.changedTouches[0].pageX;  //changedTouches为手指离开的信息
    endy=e.changedTouches[0].pageY;
    var deltax=endx-startx;  //取得触控前后坐标的差值
    var deltay=endy-starty;
    if (Math.abs(deltax)<0.3*documentW&&Math.abs(deltay)<0.3*documentW) {  //如果移动的距离小于0.3*设备宽度，则判定为不是滑动，退出（可以避免用户只是普通的点击造成的BUG）
        return;
    }
    if (Math.abs(deltax)>=Math.abs(deltay)) {  //如果为true，则说明这个滑动是在X轴方向
        if (deltax>0) {  //为true则为向右滑动
            if(moveRight()){
                generateOneNumber();
                isGameover();
            }
        }else{  //向左滑动
            if(moveLeft()){
                generateOneNumber();
                isGameover();
            }
        }
    }else{
        if (deltay>0) {  //为true则向下滑动
            if(moveDown()){
                generateOneNumber();
                isGameover();
            }
        }else{  //向上滑动
            if(moveUp()){
                generateOneNumber();
                isGameover();
            }
        }
    }
});

function isGameover(){
    if (nospace(board)&&nomove(board)) {
        setTimeout(function(){
            $('body').html('<div id="over" style="font-size:10em;font-weight:bold;width:100%;height:400px;line-height:400px;text-align:center;margin:0 auto;">GameOver</div>');
            var over=document.getElementById('over');
            over.style.marginTop=documentH/2-400+'px';
        }, 2000);
    }
}

function moveLeft(){
    if (!canMoveLeft(board)) {  //如果不能左移，则退出
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {  //j=0则为最左列，肯定不能移动，所以不需要判断，所以从j=1开始
            if (board[i][j]!=0) {  //如果这个格子有数字，则需要判断是否能移动
                for (var k = 0; k < j; k++) {  //对当前格子左边的格子进行遍历
                    if (board[i][k]==0 && noBlockHorizontal(i,k,j,board)) {  //如果ik这个位置为0并且中间没有障碍则可以移动到这个位置
                        // move
                        showMoveAnimation(i,j,i,k);  //从ij位置移动到ik位置
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i,j,i,k);  //从ij位置移动到ik位置
                        board[i][k]+=board[i][j];
                        isWin(board[i][k]);
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                };
            };
        };
    };
    setTimeout(updateBoardView, 200);  //执行updateBoardView()重绘界面；因为showMoveAnimation()动画过程需要200ms，所以这里延迟200ms执行
    return true;
}
function moveRight(){
    if (!canMoveRight(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j]!=0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k]==0 && noBlockHorizontal(i,j,k,board)) {
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        isWin(board[i][k]);
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                };
            };
        };
    };
    setTimeout(updateBoardView, 200);
    return true;
}
function moveUp(){
    if (!canMoveUp(board)) {
        return false;
    }
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j]!=0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j]==0 && noBlockVertical(j,k,i,board)) {
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        isWin(board[k][j]);
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                };
            };
        };
    };
    setTimeout(updateBoardView, 200);
    return true;
}
function moveDown(){
    if (!canMoveDown(board)) {
        return false;
    }
    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j]!=0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j]==0 && noBlockVertical(j,i,k,board)) {
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        isWin(board[k][j]);
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                };
            };
        };
    };
    setTimeout(updateBoardView, 200);
    return true;
}

// 是否完成游戏
function isWin(n){
    if (n===1024) {
        $('body').html('<div id="win" style="font-size:10em;font-weight:bold;width:100%;height:400px;line-height:400px;text-align:center;margin:0 auto;">1024</div>');
        var win=document.getElementById('win');
        win.style.marginTop=documentH/2-400+'px';
    };
}