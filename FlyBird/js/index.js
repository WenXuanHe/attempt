var jsHeadTitle = document.querySelector("#headTitle");
var jsHeadBird = document.querySelector("#headBird");
var jsGrassLand1 = document.querySelector("#grassLand1");
var jsGrassLand2 = document.querySelector("#grassLand2");
var jsWrapBg = document.querySelector("#wrapBg");
var jsScore = document.querySelector("#score");
var jsGameOver = document.querySelector("#gameOver");
var jsNum1 = document.querySelector("#num1");
var jsNum2 = document.querySelector("#num2");
var jsNum3 = document.querySelector("#num3");

var headWaveTimer, landTimer, blocksArr=[], score = 0, blockDistance = baseObj.randomNum(120,350);;

var moveTitle = function(){
    // 摆动幅度
    var Y = 3;
    var birds = ['img/bird0.png', 'img/bird1.png'];
    headWaveTimer = setInterval(function(){
       Y *= -1;
       jsHeadTitle.style.top = jsHeadTitle.offsetTop + Y + "px";
       jsHeadBird.src = birds[Y > 0 ? 1: 0];
    }, 200);
}

var moveGrass = function(){

    landTimer = setInterval(function (argument) {
        if(jsGrassLand1.offsetLeft <= -343){
            jsGrassLand1.style.left = "343px";
        }
        if(jsGrassLand2.offsetLeft <= -343){
            jsGrassLand2.style.left = "343px";
        }

        jsGrassLand1.style.left = jsGrassLand1.offsetLeft - 3 + "px";
        jsGrassLand2.style.left = jsGrassLand2.offsetLeft - 3 + "px";

        if(blocksArr.length > 0){
            for(var i = 0; i < blocksArr.length; i++){
                // 障碍物移动
                blocksArr[i].moveBlock();
                // 判断是否撞到障碍物， 下落
                var x =baseObj.rectangleCrashExamine(blocksArr[i].downDivWrap, bird.div);
                    var y = baseObj.rectangleCrashExamine(blocksArr[i].upDivWrap, bird.div);
                    var z = bird.div.offsetTop >= 390;
                    if (x || y || z) {
                        window.clearInterval(landTimer);//清除landTimer定时器
                        bird.fallSpeed = 0; //小鸟下落
                        jsWrapBg.onclick = null; //消除点击事件
                        jsScore.style.display = "none"; //隐藏计分器
                        jsGameOver.style.display = "block"; // 显示gameover面板
                    }
            }

            // 最后一个障碍物的距离判断，添加新的障碍物
            if (blocksArr[blocksArr.length - 1].downDivWrap.offsetLeft < (450 - blockDistance)) {
                        blockDistance = baseObj.randomNum(130,250);
                        var newBlock = new Block();
                        newBlock.createBlock();
                        blocksArr.push(newBlock);
                }

            if (blocksArr[0].downDivWrap.offsetLeft == -12) {
                        score++;//积分面板
                        if (score < 10) {
                            jsNum1.style.backgroundImage = "url(img/" + score + ".jpg)";
                        } else if (score < 100) {
                            jsNum2.style.display = "block";
                            jsNum1.style.backgroundImage = "url(img/" + parseInt(score/10) + ".jpg)";
                            jsNum2.style.backgroundImage = "url(img/" + score%10 + ".jpg)";
                        } else if (score < 1000) {
                            jsNum3.style.display = "block";
                            jsNum1.style.backgroundImage = "url(img/" + parseInt(score/100) + ".jpg)";
                            jsNum2.style.backgroundImage = "url(img/" + parseInt(score/10)%10 + ".jpg)";
                            jsNum3.style.backgroundImage = "url(img/" + score%10 + ".jpg)";
                        }
                        console.log(score);
                }

                // 清除障碍物
                if (blocksArr[0].downDivWrap.offsetLeft < -50) {
                        jsWrapBg.removeChild(blocksArr[0].downDivWrap);
                        jsWrapBg.removeChild(blocksArr[0].upDivWrap);
                        blocksArr.shift(blocksArr[0]);
                }
        }

    }, 30)
}



var bird = {
    fltTimer: null,
    wingTimer: null,

    div: document.createElement('div'),
    showBird: function(parent){
        this.div.classList.add("bird");
        parent.appendChild(this.div);
    },

    fallSpeed: 0,
    flyBird: function(){
        function fly () {
            bird.fallSpeed += 1;
            bird.div.style.top = bird.div.offsetTop +  bird.fallSpeed  + "px";
             console.log(bird.fallSpeed);
            if(bird.div.offsetTop < 0){
                // 控制小鸟不飞出界面外*/
                bird.fallSpeed = 2;
            }
            if(bird.div.offsetTop >= 395){
                bird.fallSpeed = 0;
                clearInterval(bird.flyTimer)
                clearInterval(bird.wingTimer)
            }
            // 最大 速度为12
            if(bird.fallSpeed > 10){
                bird.fallSpeed = 10;
            }
        }

        bird.flyTimer = setInterval(fly, 40);
    },

    wingWave: function(){
        var up = ['url(img/up_bird0.png)', 'url(img/up_bird1.png)'];
        var down = ['url(img/down_bird0.png)', 'url(img/down_bird1.png)'];
        var i = 0, j = 0;
        function wing(){
            if(bird.fallSpeed > 0 ){
                bird.div.style.backgroundImage = down[i++];
                if(i === 2){
                    i = 0;
                }
            }

            if(bird.fallSpeed < 0){
                bird.div.style.backgroundImage = up[i++];
                if(j === 2){
                    j = 0;
                }
            }
        }
        bird.wingTimer = setInterval(wing, 120);
    }
};


var start = function(){
    var jsStart = document.querySelector('#startBtn');
    jsStart.addEventListener('click', function(){
        jsHeadTitle.style.display = "none";
        clearInterval(jsHeadTitle);
        jsStart.style.display = "none";
        bird.showBird(jsWrapBg);
        bird.flyBird();
        bird.wingWave();
        jsWrapBg.addEventListener("click", function(){
            bird.fallSpeed = -8;

        });
        // 添加第一个障碍物
        var block =  new Block();
        block.createBlock();
        blocksArr.push(block);
        // 撑开浮动元素的高度
        jsNum1.style.display = "block";
    });
}
moveTitle();
moveGrass();
start();


