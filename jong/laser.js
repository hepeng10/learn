function Laser(){this.x=0,this.y=0,this.w=6,this.h=80,this.speed=10,this.dir=0;var t=["#2bd347","#ff6600","#2ad3e7","#f96cfe","#ffe92e","orange","pink","white","blue","#7f017b","#aff2ee"];this.color=t[Math.floor(Math.random()*t.length)]}Laser.prototype.create=function(){var t=Math.floor(4*Math.random());this.dir=t,0==t?(this.x=jong.x+jong.w/2-this.w/2,this.y=-this.h,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.w,this.h),cxt.closePath()):1==t?(this.x=canvas.width,this.y=jong.y+jong.h/2-this.w/2,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.h,this.w),cxt.closePath()):2==t?(this.x=jong.x+jong.w/2-this.w/2,this.y=canvas.height,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.w,this.h),cxt.closePath()):3==t&&(this.x=-this.h,this.y=jong.y+jong.h/2-this.w/2,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.h,this.w),cxt.closePath())},Laser.prototype.move=function(t){0==this.dir?(this.y+=this.speed,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.w,this.h),cxt.closePath(),this.x+this.w<jong.x||this.y+this.h<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h||this.Gameover()):1==this.dir?(this.x-=this.speed,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.h,this.w),cxt.closePath(),this.x+this.h<jong.x||this.y+this.w<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h||this.Gameover()):2==this.dir?(this.y-=this.speed,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.w,this.h),cxt.closePath(),this.x+this.w<jong.x||this.y+this.h<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h||this.Gameover()):3==this.dir&&(this.x+=this.speed,cxt.beginPath(),cxt.fillStyle=this.color,cxt.fillRect(this.x,this.y,this.h,this.w),cxt.closePath(),this.x+this.h<jong.x||this.y+this.w<jong.y||this.x>jong.x+jong.w||this.y>jong.y+jong.h||this.Gameover()),this.destroy()&&(laser.splice(t,1),score++,s.innerHTML=score,createLaserTime>300&&(createLaserTime-=10))},Laser.prototype.destroy=function(){if(0==this.dir){if(this.y>canvas.height)return!0}else if(1==this.dir){if(this.x<-this.h)return!0}else if(2==this.dir){if(this.y<-this.h)return!0}else if(3==this.dir&&this.x>canvas.width)return!0},Laser.prototype.Gameover=function(){cxt.beginPath(),cxt.fillStyle="white",cxt.fillRect(jong.x,jong.y,jong.w,jong.h),cxt.closePath(),cxt.beginPath(),cxt.strokeStyle="black",cxt.lineWidth=2,cxt.moveTo(jong.x+10,jong.y+5),cxt.lineTo(jong.x+2,jong.y+12),cxt.stroke(),cxt.closePath(),cxt.beginPath(),cxt.strokeStyle="black",cxt.lineWidth=2,cxt.moveTo(jong.x+20,jong.y+5),cxt.lineTo(jong.x+28,jong.y+12),cxt.stroke(),cxt.closePath(),cxt.beginPath(),cxt.strokeStyle="black",cxt.lineWidth=2,cxt.strokeRect(jong.x+10,jong.y+18,10,14),cxt.closePath(),console.log(score,highestScore),score>highestScore&&(console.log(1),highest.innerHTML=score,localStorage.highestScore=score),info.style.marginTop="-100px",laser=[],createLaserTime=1e3,clearInterval(timer),clearInterval(timer2),score=0};