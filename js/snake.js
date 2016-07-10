
var Direction ={
    UP :38,
    RIGHT:39,
    DOWN:40,
    LEFT:37
};
var Common={
    rectWidth:20,
    speed:500,
    orginalLength:5,
    lineNum:15,
    colNum:15,
    windowWidth:400,
    windowHeight:600,
    fieldArr:[],
    padding:1,
    food:null,
    snake:null
};

PIXI.Container.prototype.DrawField=function(x,y,backgroundColor){
        var plusWidth=Common.rectWidth+Common.padding;
        for(var j=0;j<Common.colNum;j++){
            for(var i=0;i<Common.lineNum;i++) {
                Common.fieldArr.push([i*plusWidth,j*plusWidth, false]);
            }
        }
    var graphics=new PIXI.Graphics();
    Common.fieldArr.forEach(function(value){
        drawRect(graphics,value,backgroundColor);
    });
    this.addChild(graphics);
};

var DrawSnake=function(){
    var snake= {
        length: Common.orginalLength,
        direction: Direction.RIGHT,
        graphic: new PIXI.Graphics(),
        bodyArr: [],
        headIndex: null,
        initArr: function () {
            var center = Math.round(Common.fieldArr.length / 2);
            this.headIndex = center;
            for (var i = 0; i < this.length; i++) {
                this.bodyArr.push(Common.fieldArr[center - i]);
            }
        },
        drawSnake: function () {
            var _self = this;
            _self.bodyArr.forEach(function (v) {
                drawRect(_self.graphic, v, 0x71E096);
            });
        },
        interval:null,
        gameOver:function(){
            alert(this.direction);
            clearInterval(this.interval);
        },
        moving: function () {

            switch (this.direction) {
                case Direction.UP:
                    if(this.headIndex<Common.lineNum||this.bodyArr.indexOf(Common.fieldArr[this.headIndex-Common.lineNum])!=-1){
                        this.gameOver();
                        return;
                    }else {
                        this.headIndex -= Common.lineNum;
                    }
                    break;
                case Direction.RIGHT:
                    if((this.headIndex+1)%Common.lineNum==0||this.bodyArr.indexOf(Common.fieldArr[this.headIndex+1])!=-1){
                        this.gameOver();
                        return;
                    }else {
                        this.headIndex++;
                    }
                    break;
                case Direction.DOWN:
                    if((this.headIndex+Common.lineNum)>=Common.fieldArr.length||this.bodyArr.indexOf(Common.fieldArr[this.headIndex+Common.lineNum])!=-1){
                        this.gameOver();
                        return;
                    }else {
                        this.headIndex += Common.lineNum;
                    }
                    break;
                case Direction.LEFT:
                    if(this.headIndex%Common.lineNum==0||this.bodyArr.indexOf(Common.fieldArr[this.headIndex-1])!=-1){
                        this.gameOver();
                        return;
                    }else {
                        this.headIndex--;
                    }
                    break;
            }
            this.graphic.clear();
            this.bodyArr.unshift(Common.fieldArr[this.headIndex]);
            if(Common.food.pos!=Common.fieldArr[this.headIndex])
                this.bodyArr.pop();
            else{
                Common.food.graphic.clear();
                Common.food.getPos();
            }

            this.drawSnake();
        }
    };

    snake.initArr();
    snake.drawSnake();
    snake.interval=setInterval(function(){
        snake.moving();
    },500);
    return snake;

};

var DrawFood=function(){
    var food= {
        pos:[],
        graphic:new PIXI.Graphics(),
        getPos:function(){
            var arr=Common.fieldArr[Math.round(Math.random() * (Common.fieldArr.length - 1))];
            if(Common.snake.bodyArr.indexOf(arr)!=-1){
                this.getPos();
            }else{
                this.pos=arr;
                drawRect(this.graphic, this.pos, 0x898CFF);
            }
        }
    };
    food.getPos();
    return food;
};

function drawRect(graphics,arr,color){
    graphics.beginFill(color);
    graphics.drawRect(arr[0],arr[1],Common.rectWidth,Common.rectWidth);
    graphics.endFill();
}


window.onload=function() {
    var renderer = PIXI.autoDetectRenderer(Common.windowWidth, Common.windowHeight);
    var stage = new PIXI.Container();
    document.body.appendChild(renderer.view);
    stage.interactive = true;
    stage.DrawField(0, 0, 0x4D4D4B);
    Common.snake = new DrawSnake();
    stage.addChild(Common.snake.graphic);

    Common.food = new DrawFood();
    stage.addChild(Common.food.graphic);


    requestAnimationFrame(animate);
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(stage);
    }

    window.onkeydown = function (e) {
        console.log(1)
        if(Math.abs(e.keyCode-Common.snake.direction)!=2)
            Common.snake.direction = e.keyCode;
    }
};
