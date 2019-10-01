var ctx;
var bgImg;
var santaImg;
var boomImg;
var giftImg;
var deerImg;
var snowImg;
var sockImg;
var bombImg;
var santa = new Santa(100, 619, 20, 120, 120);
var giftArray = new Array();
var deerArray = new Array();
var snowArray = new Array();
var sockArray = new Array();
var boomArray = new Array();
var bombArray = new Array();
var giftTimer;
var deerTimer;
var snowTimer;
var sockTimer;
var bombTimer;
var flashTimer;

var pause;
var startBtn;
var djs_span;
var game_time; //遊戲總時長
var game_start; //遊戲開始時間
var game_djs; //倒數計時
var id; //計時器
var played = false; //判断是否為第一次進入遊戲，false表示未進入過
var pause_time; //暂停時的倒數秒數
var jx_id; //繼續遊戲的計時器

var over= false;
var timeup= false;
/* 物件 */
function GameObject (x, y, speed, w, h) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.w = w;
    this.h = h;
    this.isLive = true;
}
function Santa (x, y, speed, w, h) {
    this.score = 0;
    this.gameObject = GameObject;
    this.gameObject(x, y, speed, w, h);
    this.moveLeft = function () {
        this.x = this.x - this.speed < 0 ? 0 : this.x - this.speed;
    }
    this.moveRight = function () {
        this.x = this.x + this.speed + this.w > canvas.width ? canvas.width : this.x + this.speed;
    }
}
function Gift (x, y, speed, w, h) {
    this.gameObject = GameObject;
    this.gameObject(x, y, speed, w, h);
    this.timer = null;
    this.score = 20;
    this.run = function () {
        if (this.y > canvas.height) {
            window.clearInterval(this.timer);
            this.isLive = false;
        } else {
            this.y += this.speed;
        }
    }
}

function Boom (x, y) {
    this.x = x;
    this.y = y;
    this.isLive = true;
    this.blood = 0;
    this.bloodUp = function () {
        if (this.blood <= 4) {
            this.blood++;
        } else {
            this.isLive = false;
        }
    }
}
/* 物件生成*/
function giftFactory (x) {
    switch(x){
        case 1:
            var gift = new Gift(Math.random() * (canvas.width - 32), 0, 5, 40, 40);
            giftArray.push(gift);
            window.setInterval('giftArray[' + (giftArray.length - 1) + '].run()', 50);
        case 2:
            var deer = new Gift(Math.random() * (canvas.width - 32), 0, 6, 50, 50);
            deerArray.push(deer);
            window.setInterval('deerArray[' + (deerArray.length - 1) + '].run()', 50);
        case 3:
            var snow = new Gift(Math.random() * (canvas.width - 32), 0, 7, 50, 50);
            snowArray.push(snow);
            window.setInterval('snowArray[' + (snowArray.length - 1) + '].run()', 50);
        case 4:
            var sock = new Gift(Math.random() * (canvas.width - 32), 0, 8, 50, 50);
            sockArray.push(sock);
            window.setInterval('sockArray[' + (sockArray.length - 1) + '].run()', 50);
        case 5:
            var bomb = new Gift(Math.random() * (canvas.width - 32), 0, 10, 40, 40);
            bombArray.push(bomb);
            window.setInterval('bombArray[' + (bombArray.length - 1) + '].run()', 50);
    }
}

/* 刷新 */
function flashMap () {
    ctx.fillStyle = '#eee';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(bgImg, 0, 0, canvas.width, canvas.height);
    drawSanta(santa);
    catchGift();
    drawGift();
    drawBoom();
}
/* 畫上畫布 */
function drawSanta (santa) {
    santa.isLive && ctx.drawImage(santaImg, 0, 0, 1200, 1300, santa.x, santa.y, santa.w, santa.h);
}

function drawGift () {
    giftArray.forEach(function(item) {
        if (item.isLive) {
            ctx.drawImage(giftImg, 0, 0, 512, 512, item.x, item.y, item.w, item.h);
        }
    })
    deerArray.forEach(function(item) {
        if (item.isLive) {
            ctx.drawImage(deerImg, 0, 0, 150, 150, item.x, item.y, item.w, item.h);
        }
    })
    snowArray.forEach(function(item) {
        if (item.isLive) {
                ctx.drawImage(snowImg, 0, 0, 150, 150, item.x, item.y, item.w, item.h);
        }
    })
    sockArray.forEach(function(item) {
        if (item.isLive) {
            ctx.drawImage(sockImg, 0, 0, 150, 150, item.x, item.y, item.w, item.h);
        }
    })
    bombArray.forEach(function (bomb) {
        if (bomb.isLive) {
            ctx.drawImage(bombImg, 160, 160, 480, 480, bomb.x, bomb.y, bomb.w, bomb.h);
        }
    })
}

function drawBoom () {
    boomArray.forEach(function(boom) {
        if (boom.isLive) {
            ctx.drawImage(boomImg, boom.blood * 64, 0, 64, 64, boom.x, boom.y, santa.w, santa.h);
            boom.bloodUp();
        } else {
            gameOver();
        }
    })
}

/* 接住 */
function catchGift () {
    giftArray.forEach(function(item) {
        gotcha(item);
    })

    deerArray.forEach(function(item) {
        gotcha(item);
    })

    snowArray.forEach(function(item) {
        gotcha(item);
    })

    sockArray.forEach(function(item) {
        gotcha(item);
    })
    bombArray.forEach(function (bomb) {
        if (bomb.isLive &&santa.isLive) {
            if (isCatch(bomb)) {
                bomb.isLive = false;
                santa.isLive = false;
                window.clearInterval(bomb.timer);
                var boom = new Boom(santa.x, santa.y);
                boomArray.push(boom);
            }
        }
    })
}

function gotcha(item){
    if (item.isLive &&santa.isLive) {
            if (isCatch(item)) {
                santa.score += item.score;
                item.isLive = false;
                window.clearInterval(item.timer);
                flashScore();
            }
        }
}

/* 判断接住 */
function isCatch (item) {
    return (item.x + (item.w / 2) <= santa.x + santa.w && item.x + (item.w / 2) >= santa.x && item.y + (item.h / 2) <= santa.y + santa.h && item.y + (item.h / 2) >= santa.y);
}
/* 刷新分數 */
function flashScore () {
    //var score = document.getElementById('score');
    score.innerHTML = 'score: ' + santa.score;
}
/* 遊戲结束 */
function gameOver () {
    /* 關閉所有定時器 */
    santa.isLive= false;
    game_stop();
    over= true;
    pause.disabled= true;
    window.clearInterval(giftTimer);
    window.clearInterval(deerTimer);
    window.clearInterval(snowTimer);
    window.clearInterval(sockTimer);
    window.clearInterval(bombTimer);
    window.clearInterval(flashTimer);
    giftArray.forEach(function (item) {
        clearInterval(item.timer)
    })
    deerArray.forEach(function (item) {
        clearInterval(item.timer)
    })
    snowArray.forEach(function (item) {
        clearInterval(item.timer)
    })
    sockArray.forEach(function (item) {
        clearInterval(item.timer)
    })
    bombArray.forEach(function (item) {
        clearInterval(item.timer)
    })
    boomArray.forEach(function (item) {
        clearInterval(item.timer)
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.font = '50px Verdana';
    var gradient = ctx.createLinearGradient(0, 0, canvas.height, 0);
    gradient.addColorStop('0', 'magenta');
    gradient.addColorStop('0.5', 'blue');
    gradient.addColorStop('1', 'red');
    ctx.fillStyle = gradient;
    if(!timeup){
        ctx.fillText('GAME OVER!', canvas.width/2-180, 300);
    }
    else{
        ctx.fillText('TIMES UP!', canvas.width/2-180, 300);
    }
    ctx.font = '40px Verdana';
    ctx.fillText('Your score is '+santa.score, canvas.width/2-180, 350);
    timeup= false;
}

onload = function () {
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    ctx.fillRect(bgImg, 0, 0, canvas.width, canvas.height);
    bgImg = document.getElementById('bg');
    santaImg = document.getElementById('santa');
    giftImg = document.getElementById('gift');
    deerImg = document.getElementById('deer');
    snowImg = document.getElementById('snow');
    sockImg = document.getElementById('sock');
    bombImg = document.getElementById('bomb');
    boomImg = document.getElementById('boom');
    score = document.getElementById('score');

    startBtn = document.getElementById("start");
    pause = document.getElementById("pause");
    djs_span = document.getElementById("djs");

    clearTimeout(jx_id);
    start();
    startBtn.onclick = function() {
        if(played) {
            if(over){
                var reset = confirm("Do you want to start again？");
                if(reset){
                    parent.location.reload();
                }
                else{
                    gameOver();
                }
                
            }
            else{
                var reset = confirm("Do you want to restart？");
                if(reset){
                    parent.location.reload();
                }
                else{
                    return;
                }
            }
        }
    }
    if(!over){
            //可玩六十秒
            game_time = 60;
            santa.score= 0;
            //遊戲開始時間
            game_start = new Date();
            played= true;
            flashScore();
            djs();
        }
    //暫停遊戲
    pause.onclick = function() {
        game_pause();
        alert('點擊以繼續遊戲');
        //繼續遊戲時間
        game_start = new Date();
        pause_time = game_djs;
        game_jx();
    }
    
    }

function start () {
    giftTimer = window.setInterval(giftFactory, 5000, 1);
    deerTimer = window.setInterval(giftFactory, 1000, 2);
    snowTimer = window.setInterval(giftFactory, 2000, 3);
    sockTimer = window.setInterval(giftFactory, 3000, 4);
    bombTimer = window.setInterval(giftFactory, 4000, 5);
    flashTimer = window.setInterval(flashMap, 50);

}

//倒數計時
function djs() {
    var playing = new Date();
    game_djs = game_time - parseInt((playing - game_start) / 1000); 
    djs_span.innerHTML = 'timer: ' + game_djs;
    id = setTimeout("djs()", 1000);

    //遊戲結束
    if(game_djs < 1) {
        clearTimeout(id);
        timeup=true;
        gameOver();
    }
}

//暫停遊戲
function game_pause() {
    clearTimeout(id);
    clearTimeout(jx_id);
}

//繼續遊戲
function game_jx() {
    var playing = new Date();
    game_djs = pause_time - parseInt((playing - game_start) / 1000);
    djs_span.innerHTML = 'timer: ' + game_djs;
    jx_id = setTimeout("game_jx()", 1000);

    //遊戲結束
    if(game_djs < 1) {
        clearTimeout(jx_id);
        timeup=true;
        gameOver();
    }
}

//停止遊戲
function game_stop() {
    clearTimeout(id);
    clearTimeout(jx_id);
    game_djs = 0;
    djs_span.innerHTML = 'timer: ' + game_djs;
}

/* 鍵盤控制 */
document.onkeydown = function () {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var flag = true;
    switch (e.keyCode) {
        case 37:
            if (santa.x > 0) {
                santa.moveLeft();
            }
            break;
        case 39:
            if (santa.x + santa.w < canvas.width) {
                santa.moveRight();
            }
            break;
        default:
            flag = false;
            break;
    }
}