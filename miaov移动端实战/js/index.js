// 封装的工具函数
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

// 页面要执行的函数
// bind(document,'touchmove',function(e){e.preventDefault();});
function fnLoad(){
	var iTime=new Date().getTime();
	var oW=id('welcome');
	var arr=[];
	var bImgLoad=true;  //这个是判断首页的轮播图是否加载完，加载完欢迎页才跳转到首页。暂时没实现这功能，所以直接设置为true
	var bTime=false;
	var oTimer=0;
	oTimer=setInterval(function(){
		if(new Date().getTime()-iTime>=5000){  //当欢迎页动画结束后，将bTime设置为true
			bTime=true;
		}
		if(bImgLoad&&bTime){
			clearInterval(oTimer);
			// 执行跳转
			oW.style.opacity=0;  //这里触发transition过度效果，下面绑定了transitionend，这里的过度效果结束后也就会触发transitionend事件
		}
	})
	function end(){  //动画执行完毕后执行此事件
		removeClass(oW,'pageShow');
        fnTab();
        fnScore();
	}
	bind(oW,'webkitTransitionEnd',end);  //绑定transitionend事件，DOM对象的transition过度效果结束后执行end函数；这里需要webkit做兼容处理
	bind(oW,'transitionend',end);
	// for(var i=0;i<arr.length;i++){
	// 	var oImg=new Image();
	// 	oImg.src=arr[i];
	// 	oImg.onload=function(){

	// 	}
	// }
}

// 轮播图切换
function fnTab(){
	var oTab=id('tabPic');
	var oList=id('picList');
	var aNav=oTab.getElementsByTagName('nav')[0].children;
	var iNow=0;
	var iX=0;  //轮播图的水平位移，通过x坐标的移动来切换图片
	var iW=view().w;
	var oTimer=0;
	var iStartTouchX=0;
	var iStartX=0;
	// 封装轮播图切换
	function tab(){
		iX=-iNow*iW;  //计算出当前第几张轮播图的水平位移，向左移动所以是负数
		oList.style.transition='0.5s';  //这个transition不能直接写在CSS中，因为在拖动的时候有个清空的操作，如果是写在CSS中，清空了就没了
		oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";  //修改translateX实现水平滚动切换。这里通过JS设置transform属性，为了兼容也设置了WebkitTransform
		for(var i=0;i<aNav.length;i++){
			removeClass(aNav[i],'active');
		}
		addClass(aNav[iNow],'active');
	}
	// 通过定时器修改当前当前显示图片的索引
	function auto(){
		oTimer=setInterval(function(){
			iNow++;
			iNow=iNow%aNav.length;  //通过模得到当前的图片索引
			tab();
		},2000);
	}
	auto();
	// 划动切换轮播图
	bind(oTab,'touchstart',fnStart);
	bind(oTab,'touchmove',fnMove);
	bind(oTab,'touchend',fnEnd);
	function fnStart(e){
		clearInterval(oTimer);
		oList.style.transition='none';  //注意拖拽时要干掉transition，不然会有种反应迟钝的感受
		e=e.changedTouches[0];
		iStartTouchX=e.pageX;
		iStartX=iX;
	}
	function fnMove(e){
		e=e.changedTouches[0];
		var iDis=e.pageX-iStartTouchX;
		iX=iStartX+iDis;
		oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
	}
	function fnEnd(e){
		iNow=iX/iW;
		iNow=-Math.round(iNow);  //四舍五入，就能实现拖动距离没过一半则不切换的效果
		if(iNow<0){  //在第一张往右拖，则还是第一张
			iNow=0;
		}
		if(iNow>aNav.length-1){  //在最后一张往左拖，则还是最后一张
			iNow=aNav.length-1;
		}
		tab();
		auto();
	}
}

// 景点评分
function fnScore(){
    var oScore=id('score');
    var aLi=oScore.getElementsByTagName('li');
    for(var i=0;i<aLi.length;i++){
        fn(aLi[i]);
    }
    function fn(oLi){
        var aNav=oLi.getElementsByTagName('a');
        var oInput=oLi.getElementsByTagName("input")[0];
        for(var i=0;i<aNav.length;i++){
            // 给每个星星添加index属性
            aNav[i].index=i;
            // 给每个星星绑定点击事件
            bind(aNav[i],'touchstart',function(){
                for(var i=0;i<aNav.length;i++){
                    if(i<=this.index){  //给小于等于当前点击的星星索引值的星星都加上active
                        addClass(aNav[i],'active');
                    }else{  //大于当前星星索引值的移除active
                        removeClass(aNav[i],'active');
                    }
                }
                oInput.value=this.index+1;  //给input赋值
            });
        }
    }
    fnIndex();
}

// 主页调用的方法
function fnIndex(){
    var oIndex=id('index');
    var oBtn=oIndex.getElementsByClassName('btn')[0];
    var oInfo=oIndex.getElementsByClassName('info')[0];
    var bScore=true;
    // 点击提交按钮执行
    bind(oBtn,'touchend',fnEnd);
    function fnEnd(){
        bScore=fnScoreChecked();
        if(bScore){
            if(fnTag()){
                fnIndexOut();
            }else{
                fnInfo(oInfo,'给景区添加标签');
            }
        }else{
            fnInfo(oInfo,'给景区评分');
        }
    }
    // 判断是否所有评分项都已选择
    function fnScoreChecked(){
        var oScore=id('score');
        var aInput=oScore.getElementsByTagName("input");
        for(var i=0;i<aInput.length;i++){
            if(aInput[i].value==0){  //如果有一个input为0，则说明有评分项未选择
                return false;
            }
        }
        return true;
    }
    // 判断标签是否选择
    function fnTag(){
        var oTag=id('indexTag');
        var aInput=oTag.getElementsByTagName("input");
        for(var i=0;i<aInput.length;i++){
            if(aInput[i].checked){
                return true;
            }
        }
        return false;
    }
}

// 底部弹出的提示信息
function fnInfo(oInfo,sInfo){
    oInfo.innerHTML=sInfo;
    oInfo.style.WebkitTransform="scale(1)";
    oInfo.style.transform="scale(1)";
    oInfo.style.opacity="1";
    // 提示信息1s后隐藏掉
    setTimeout(function(){
        oInfo.style.WebkitTransform="scale(0)";
        oInfo.style.transform="scale(0)";
        oInfo.style.opacity="0";
    },1000);
}

// 首页跳出，进入新闻页
function fnIndexOut(){
    var oMask=id('mask');
    var oIndex=id('index');
    var oNews=id('news');
    // 添加pageShow设置display:block，但暂时还看不见，opacity=0
    addClass(oMask,'pageShow');
    addClass(oNews,'pageShow');
    fnNews();
    // 修改opacity实现透明度过度效果；但是上面的addClass把元素从display:none变为display:block，会有很短时间的渲染过程，但在渲染过程中执行了下面的opacity=1，就会失去过度效果。所以使用一个定时器延迟极短时间来设置opacity，让渲染完成后再修改opacity实现过度效果
    setTimeout(function(){
        oMask.style.opacity=1;
        oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";  //使用css3滤镜来使这个容器中的内容高斯模糊
    },15);
    // 延迟3s消失，然后显示新闻页
    setTimeout(function(){
        oMask.style.opacity=0;
        oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";
        oNews.style.opacity=1;
        removeClass(oMask,'pageShow');
    },3000);
}

// 新闻页
function fnNews(){
    var oNews=id('news');
    var oInfo=oNews.getElementsByClassName('info')[0];
    var aInput=oNews.getElementsByTagName("input");
    // file类型的input在选择文件后就会触发onchange事件
    aInput[0].onchange=function(){
        // console.log(this.files);  通过files可以获得上传文件的一些信息
        // this.files[0].type会得到 video/mp4 这样的内容，这里只需要是video就行了
        if(this.files[0].type.split('/')[0]=='video'){
            fnNewsOut();
            this.value="";
        }else{
            fnInfo(oInfo,'请上传视频类型文件');
        }
    }
    aInput[1].onchange=function(){
        if(this.files[0].type.split('/')[0]=='image'){
            fnNewsOut();
            this.value="";
        }else{
            fnInfo(oInfo,'请上传图片类型文件');
        }
    }
}

// 新闻页跳出，进入表单页
function fnNewsOut(){
    var oNews=id('news');
    var oForm=id('form');
    addClass(oForm,'pageShow');
    oNews.style.cssText='';
    removeClass(oNews,'pageShow');
    formIn();
}

// 表单页
function formIn(){
    var oForm=id('form');
    var aFormTag=id('formTag').getElementsByTagName("label");
    var oBtn=oForm.getElementsByClassName("btn")[0];
    var oOver=id('over');
    var bOff=false;
    for(var i=0;i<aFormTag.length;i++){
        // 遍历给所有标签添加touchend事件
        bind(aFormTag[i],'touchend',function(){
            bOff=true;
            addClass(oBtn,'submit');
        });
    }
    // 上传后跳转到上传成功页
    bind(oBtn,'touchend',function(){
        if (bOff) {
            // 上传成功后清除标签的选择，因为下次传的图片可能不一样，上次选择的标签不应该还是选中的
            for(var i=0;i<aFormTag.length;i++){
                aFormTag[i].getElementsByTagName("input")[0].checked=false;
            }
            bOff=false;
            addClass(oOver,'pageShow');
            removeClass(oForm,'pageShow');
            removeClass(oBtn,'submit');
            fnOver();
        }
    });
}

// 上传成功页
function fnOver(){
    var oOver=id('over');
    var oBtn=oOver.getElementsByClassName('btn')[0];
    bind(oBtn,'touchend',function(){
        removeClass(oOver,'pageShow');
    });
}

