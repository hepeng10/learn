// 显示数字
function showNumberWithAnimation(i,j,num){
    var numCell=$('#number-cell-'+i+'-'+j);
    numCell.css('background-color',getNumberBackgroundColor(num));
    numCell.css('color',getNumberColor(num));
    numCell.text(num);
    numCell.animate({'width':cellSideLength,'height':cellSideLength,'top':getPosTop(i,j),'left':getPosLeft(i,j)}, 100);
}

// 移动格子
function showMoveAnimation(fromx,fromy,tox,toy){
    var numCell=$('#number-cell-'+fromx+'-'+fromy);
    numCell.animate({'top':getPosTop(tox,toy),'left':getPosLeft(tox,toy)}, 200);
}

function updateScore(score){
    $('#score').text(score);
}