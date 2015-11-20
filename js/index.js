var score=0;
var padding=5;
var fieldArr=[];
PIXI.Sprite.prototype.originX=0;
PIXI.Sprite.prototype.originY=0;
PIXI.Sprite.prototype.positionArr=[];
PIXI.Sprite.prototype.drift=[];
PIXI.Sprite.prototype.color="";
var stage=new PIXI.Container();
var colorArr=["0x898CFF","0x71E096","0xF5A26F","0xFFDC89","0xFF89B5"];
var fieldX=400;
var fieldY=400;
var R=40;
var longerSide;
var coverPiece=[];
var bunnys=[];
var gameJudge=[true,true,true];
var screenData={};

$(function(){
    screenData=screenAdjustment();
    setBestScore(0);
    var renderer=PIXI.autoDetectRenderer($(window).width(),$(window).height());
    $("body").append(renderer.view);
    stage.interactive=true;
    stage.DrawField(fieldX,fieldY,R,padding,0x4D4D4B);
    if(screenData.type==0) {
        stage.CreatePiece(screenData.screenX * 0.7, screenData.screenY * 0.2, R, 0);
        stage.CreatePiece(screenData.screenX * 0.7, screenData.screenY * 0.5, R, 1);
        stage.CreatePiece(screenData.screenX * 0.7, screenData.screenY * 0.8, R, 2);
    }else{
        stage.CreatePiece(screenData.screenX * 0.2, screenData.screenY * 0.8, R, 0);
        stage.CreatePiece(screenData.screenX * 0.5, screenData.screenY * 0.8, R, 1);
        stage.CreatePiece(screenData.screenX * 0.8, screenData.screenY * 0.8, R, 2);
    }
    requestAnimationFrame(animate);
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(stage);
    }

    $("#restart").bind("click",startGame);
});

//屏幕自适应
function screenAdjustment(){
    var screenX=$(window).width();
    var screenY=$(window).height();
    if(screenY<=screenX) {
        fieldX = screenX / 8;
        fieldY = screenY / 2;
        R = screenX / 40;
        longerSide = R * 1.73 / 2;
        return {"screenX": screenX, "screenY": screenY,"type":0};
    }else{
        fieldX = screenX / 10;
        fieldY = screenY / 2.5;
        R = screenX / 20;
        longerSide = R * 1.73 / 2;
        return {"screenX": screenX, "screenY": screenY,"type":1};
    }
}

//重新开始游戏
function startGame(){
    bunnys.forEach(function(v){
        stage.removeChild(v);
    });
    fieldArr.forEach(function(v){
        v[2]=false;
    });
    coverPiece.forEach(function(v){
        stage.removeChild(v);
    });

    if(screenData.type==0) {
        stage.CreatePiece(screenData.screenX * 0.7, screenData.screenY * 0.2, R, 0);
        stage.CreatePiece(screenData.screenX * 0.7, screenData.screenY * 0.5, R, 1);
        stage.CreatePiece(screenData.screenX * 0.7, screenData.screenY * 0.8, R, 2);
    }else{
        stage.CreatePiece(screenData.screenX * 0.2, screenData.screenY * 0.8, R, 0);
        stage.CreatePiece(screenData.screenX * 0.5, screenData.screenY * 0.8, R, 1);
        stage.CreatePiece(screenData.screenX * 0.8, screenData.screenY * 0.8, R, 2);
    }
    setBestScore(0);
};


//画六边形棋盘
PIXI.Container.prototype.DrawField=function(x,y,R,padding,backgroundColor){
    function pushCenterPoint(x,y,i){
        for(var j=0;j<i;j++){
            fieldArr.push([x+(longerSide*2+padding)*j,y,false]);
        }
    };
    var graphics=new PIXI.Graphics();
    pushCenterPoint(0,0,9);
    for(var i=1;i<=4;i++) {
        pushCenterPoint(i*(longerSide+padding/2),-i*((R*3/2+padding)),9-i);
        pushCenterPoint(i*(longerSide+padding/2),i*((R*3/2+padding)),9-i);
    }
    fieldArr.forEach(function(value){
        graphics.DrawHexagonal(x+value[0],y+value[1],R,backgroundColor);
    });
   this.addChild(graphics);
};

//生成碎片对象
PIXI.Container.prototype.CreatePiece=function(x, y,R,index){
    var textureObj=DrawPiece(x,y,R);
    // create a new Sprite using the texture
    bunnys[index] = new PIXI.Sprite(textureObj.texture);
    // enable the bunnys to be interactive... this will allow it to respond to mouse and touch events
    bunnys[index].interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the bunnys with your mouse
    bunnys[index].buttonMode = true;
    // center the bunnys's anchor point
    bunnys[index].anchor.set(0.5,1);
    // setup events
	bunnys[index].scale.set(0.7);
    bunnys[index]
        // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
    // move the sprite to its designated position
    bunnys[index].position.x = x;
    bunnys[index].position.y = y;
    bunnys[index].originX=x;
    bunnys[index].originY=y;
    bunnys[index].positionArr=textureObj.positionArr;
    bunnys[index].drift=textureObj.drift;
    bunnys[index].color=textureObj.color;
    bunnys[index].index=index;
    // add it to the stage
    this.addChild(bunnys[index]);

};


//画碎片
function DrawPiece(x,y,R){
    var piece=new PIXI.Graphics();
    var positionArr=[];
    var drift;
    var random=Math.round(Math.random()*25)+2;
    var color=colorArr[Math.round(Math.random()*4)];

    switch(random){

        case 2:
            positionArr=[fieldArr[0],fieldArr[9],fieldArr[25],fieldArr[39]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 3:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[2],fieldArr[3]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 4:
            positionArr=[fieldArr[0],fieldArr[17],fieldArr[32],fieldArr[45]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        case 5:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[9],fieldArr[10]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 6:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[17],fieldArr[18]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        case 7:
            positionArr=[fieldArr[0],fieldArr[2],fieldArr[9],fieldArr[10]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 8:
            positionArr=[fieldArr[0],fieldArr[2],fieldArr[17],fieldArr[18]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        case 9:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[9],fieldArr[17]];
            drift=[-0.5,longerSide,-0.5,0];
            break;
        case 10:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[10],fieldArr[17]];
            drift=[-0.5,longerSide,0,-R*5/2-padding];
            break;
        case 11:
            positionArr=[fieldArr[0],fieldArr[9],fieldArr[1],fieldArr[18]];
            drift=[-0.5,longerSide,-1,R*5/2+padding];
            break;
        case 12:
            positionArr=[fieldArr[0],fieldArr[9],fieldArr[10],fieldArr[25]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 13:
            positionArr=[fieldArr[0],fieldArr[17],fieldArr[18],fieldArr[32]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        case 14:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[18],fieldArr[32]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        case 15:
            positionArr=[fieldArr[0],fieldArr[9],fieldArr[10],fieldArr[17]];
            drift=[-0.5,longerSide,-0.5,0];
            break;
        case 16:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[10],fieldArr[25]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 17:
            positionArr=[fieldArr[0],fieldArr[9],fieldArr[17],fieldArr[18]];
            drift=[-0.5,longerSide,-0.5,0];
            break;
        case 18:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[2],fieldArr[9]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 19:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[2],fieldArr[10]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
        case 20:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[2],fieldArr[17]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        case 21:
            positionArr=[fieldArr[0],fieldArr[1],fieldArr[2],fieldArr[18]];
            drift=[-0.5,longerSide,-1,longerSide];
            break;
        default:
            positionArr=[fieldArr[0]];
            drift=[-0.5,longerSide,0,-longerSide];
            break;
    }

    positionArr=positionArr.map(function(value){
        piece.DrawHexagonal(x+value[0],y+value[1],R,color);
        return value.slice(0,2);
    });
    return {"texture":piece.generateTexture(10),"positionArr":positionArr,"drift":drift,"color":color};

};


function onDragStart(event){
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
	this.scale.set(1);
}

function onDragEnd(){
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    setPiece(this);
	judgeGame();
}

function onDragMove(){
    if (this.dragging){
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x =newPosition.x;
        this.position.y =newPosition.y;
    }
};

//判断拖动的碎片是否能在当前位置放下
function setPiece(bunny){
    var coverX=[],coverY=[],coverIndex=[];
    var isSet=bunny.positionArr.every(function(v,i) {
        var positionX= bunny.position.x+bunny.drift[0]*bunny.width+bunny.drift[1]+v[0];
        var positionY= bunny.position.y+bunny.drift[2]*bunny.height+bunny.drift[3]+v[1];

        return fieldArr.some(function (value,index) {
            if (( fieldX+value[0] -positionX) * (fieldX+value[0] - positionX) + (fieldY+value[1] - positionY) * (fieldY+ value[1] - positionY) <= 300 && value[2] == false) {
                    coverX[i]=fieldX+value[0];
                    coverY[i]=fieldY+value[1];
                    coverIndex[i]=index;
                    return true;
            }else{
                return false;
            }
        });
    });
    if(!isSet) {
        bunny.position.x = bunny.originX;
        bunny.position.y = bunny.originY;
		bunny.scale.set(0.7);
    }else{
        setScore(40);
        coverIndex.forEach(function(v,i){
            fieldArr[v][2]=true;
            coverPiece[v]=new PIXI.Graphics();
            coverPiece[v].DrawHexagonal(coverX[i],coverY[i],R,bunny.color);
            stage.addChild(coverPiece[v]);

        });
        couldRemove();
        stage.removeChild(bunny);
        stage.CreatePiece(bunny.originX,bunny.originY,R,bunny.index);

    }

};


//画一个六边形
PIXI.Graphics.prototype.DrawHexagonal=function(x,y,R,backgroundColor){
    this.lineStyle(0);
    this.beginFill(backgroundColor);
    this.moveTo(x,y-R);
    this.lineTo(x+longerSide, y-R/2);
    this.lineTo(x+longerSide, y+R/2);
    this.lineTo(x,y+R);
    this.lineTo(x-longerSide, y+R/2);
    this.lineTo(x-longerSide, y-R/2);
    this.moveTo(x,y-R);
    this.endFill();
};

//判断消除连成线的六边形
function couldRemove(){
    var lineArr=   [[51,52,53,54,55],
                    [39,40,41,42,43,44],
                    [25,26,27,28,29,30,31],
                    [9,10,11,12,13,14,15,16],
                    [0,1,2,3,4,5,6,7,8],
                    [17,18,19,20,21,22,23,24],
                    [32,33,34,35,36,37,38],
                    [45,46,47,48,49,50],
                    [56,57,58,59,60],
                    [0,9,25,39,51],
                    [17,1,10,26,40,52],
                    [32,18,2,11,27,41,53],
                    [45,33,19,3,12,28,42,54],
                    [56,46,34,20,4,13,29,43,55],
                    [57,47,35,21,5,14,30,44],
                    [58,48,36,22,6,15,31],
                    [59,49,37,23,7,16],
                    [60,50,38,24,8],
                    [0,17,32,45,56],
                    [9,1,18,33,46,57],
                    [25,10,2,19,34,47,58],
                    [39,26,11,3,20,35,48,59],
                    [51,40,27,12,4,21,36,49,60],
                    [52,41,28,13,5,22,37,50],
                    [53,42,29,14,6,23,38],
                    [54,43,30,15,7,24],
                    [55,44,31,16,8]];
    var toRemoveArr=[];
    //消除的记分乘数
    var bonus=10;
    lineArr.forEach(function(value){
        var bool=value.every(function(v){
            return fieldArr[v][2];
        });
        if(bool){
            toRemoveArr=toRemoveArr.concat(value);
            bonus+=10;
        }
    });
    unique(toRemoveArr).forEach(function(value){
        stage.removeChild(coverPiece[value]);
        fieldArr[value][2]=false;
    });
    setScore(unique(toRemoveArr).length*bonus);
};

//数组去重
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
};

//判断碎片是否有地方放
function judgePiece(bunny){

    if(bunny.positionArr.length==1)
        gameJudge[bunny.index]=true;
    else {

        var anchor=[];
        var bool = fieldArr.some(function (startv) {

            if (startv[2] == false) {
                anchor=[startv[0],startv[1]];
                return bunny.positionArr.every(function (v) {
                    return fieldArr.some(function(value){
                        return compare(value[0],v[0],anchor[0])&&compare(value[1],v[1],anchor[1])&&value[2]==false;
                    });
                });
            }
            else {
                return false;
            }
        });

        if (!bool) {
            bunny.alpha = 0.3;
            gameJudge[bunny.index] = false;
        } else {
            gameJudge[bunny.index] = true;
        }
    }
};
//判断是否gameover
function judgeGame(){
    bunnys.forEach(function(value){
        judgePiece(value);
    });

    var bool=gameJudge.some(function(v){
        return v;
    });
    if(!bool) {
       setBestScore(score);
        alert("Game Over!");
        bunnys.forEach(function(v){
            v.interactive=false;
        })
    }
};
//记分
function setScore(plus){
    score+=plus;
    $("#score").html(score);

}
//记录最高分
function setBestScore(bestscore){
    if(getCookie('pixi_score')!=null){
        if(bestscore==0){
            $("#bestScore").html("BESTSCORE:"+getCookie('pixi_score'));
			score=0;
			$("#score").html(score);
        }
        else if(bestscore> getCookie('pixi_score')){
            setCookie('pixi_score',bestscore);
            $("#bestScore").html("BESTSCORE:"+getCookie('pixi_score'));
        }
    }else{
		 if(bestscore==0){
		 	$("#bestScore").html("BESTSCORE:0");
			score=0;
			$("#score").html(score);
		 }else{
        	setCookie('pixi_score',bestscore);
            $("#bestScore").html("BESTSCORE:"+bestscore);
		 }
    }
}

function compare(v1,v2,v3){
	return Math.abs(v1-v2-v3)<=padding;
}

function setCookie(name,value)
{
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

