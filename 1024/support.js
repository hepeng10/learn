var documentW=window.screen.availWidth;  //获取设备可用宽度
var documentH=window.screen.availHeight;
var gridContainerW=0.92*documentW;  //定义游戏容器宽度
var cellSideLength=0.18*documentW;  //定义每个格子的边长
var cellSpace=0.04*documentW;  //定义格子间距
// 计算每个格子的位置进行定位
function getPosTop(i,j){
    return cellSpace+i*(cellSpace+cellSideLength);
}
function getPosLeft(i,j){
    return cellSpace+j*(cellSpace+cellSideLength);
}

// 设置显示数字的背景色
function getNumberBackgroundColor(number){
    switch(number){
        case 2:return '#eee4da';break;
        case 4:return '#ede0c8';break;
        case 8:return '#f2b179';break;
        case 16:return '#f59563';break;
        case 32:return '#f67c5f';break;
        case 64:return '#f65e3b';break;
        case 128:return '#edcf72';break;
        case 256:return '#edcc61';break;
        case 512:return '#9c0';break;
        case 1024:return '#33b5e5';break;
        case 2048:return '#09c';break;
        case 4096:return '#a6c';break;
        default: return 'black';break;
    }
}
// 设置显示数字的颜色
function getNumberColor(number){
    if (number<=4) {
        return '#776e65';
    }
    return 'white';
}

// 判断格子是否为空
function nospace(board){
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j]===0) {
                return false;
            }
        }
    }
    return true;  //如果都不为空则返回true
}

// 能否左移
function canMoveLeft(board){
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {  //j=0则为最左列，肯定不能移动，所以不需要判断，所以从j=1开始
            if (board[i][j]!==0) {
                if (board[i][j-1]==0||board[i][j-1]==board[i][j]) {  //如果左侧数字为0或者和当前数字相等则可以左移
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveRight(board){
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j]!==0) {
                if (board[i][j+1]==0||board[i][j+1]==board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveUp(board){
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j]!==0) {
                if (board[i-1][j]==0||board[i-1][j]==board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveDown(board){
    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j]!==0) {
                if (board[i+1][j]==0||board[i+1][j]==board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
// 左右方向移动的时候判断是否有障碍物
function noBlockHorizontal(row,col1,col2,board){
    for (var i = col1+1; i < col2; i++) {  //从col1+1开始遍历，也就是要进行移动的格子的后一个格子开始遍历
        if (board[row][i]!=0) {  //如果这个格子不为0，则说明有障碍物
            return false;
        };
    };
    return true;
}
// 上下方向移动的时候判断是否有障碍物
function noBlockVertical(col,row1,row2,board){
    for (var i = row1+1; i < row2; i++) {  //从row1+1开始遍历，也就是要进行移动的格子的后一个格子开始遍历
        if (board[i][col]!=0) {  //如果这个格子不为0，则说明有障碍物
            return false;
        };
    };
    return true;
}

function nomove(board){
    if (canMoveLeft(board)||canMoveUp(board)||canMoveRight(board)||canMoveDown(board)) {return false;}
    return true;
}