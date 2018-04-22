(function () {
    var canvas = document.querySelector("#canvas"),
        cxt = canvas.getContext("2d"),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight;

    //console.log(canvas);
    var stars = [],//星星集合
        starsNum = 1200,//数量
        count = 0,//索引值
        hue = 217;//色调hsl

//思路，创建新的画布，覆盖原画布上
    var canvas2 = document.createElement("canvas"),
        cxt2 = canvas2.getContext("2d");
    canvas2.width = 100;//新画布的大小
    canvas2.height = 100;

//半径
    var half = canvas2.width/2;
//径向渐变
    var gradient2 = cxt2.createRadialGradient(half , half , 0 , half , half , half);
//配色部分，借鉴
    gradient2.addColorStop(0.025, "#fff");
    gradient2.addColorStop(0.1, "hsl(" + hue + ", 61%, 33%)");
    gradient2.addColorStop(0.25, "hsl(" + hue + ", 64%, 6%)");
    gradient2.addColorStop(1, "transparent");

//开始画一个试试
    cxt2.fillStyle = gradient2;
    cxt2.beginPath();
    cxt2.arc(half , half , half , 0 , 2*Math.PI , false);
    cxt2.fill();

//document.body.appendChild(canvas2);
//构造函数Star
    function Star() {
        this.orbitradius = random(maxRadius(w,h));//每颗星星运动的轨道半径不同
        this.radius = random(60,this.orbitradius)/12;//每颗星星的半径
        this.orbitX = w/2;
        this.orbitY = h/2;
        this.timePassed = random(0,starsNum);
        this.speed = random(this.orbitradius)/1000000;//旋转速度
        this.alpha = random(2,10)/10;//透明度

        count ++;
        stars[count] = this;
    };

//给每个小星星设置原型
    Star.prototype.draw = function () {

        var x = Math.sin(this.timePassed)*this.orbitradius + this.orbitX,
            y = Math.cos(this.timePassed)*this.orbitradius + this.orbitY;

        cxt.globalAlpha = this.alpha;//设置透明度

        //闪烁
        var Twinkle = random(10);
        if (Twinkle === 1 && this.alpha > 0){
            this.alpha -= 0.05;
        }else if (Twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
        }

        cxt.drawImage(canvas2 , x , y , this.radius , this.radius);
        this.timePassed += this.speed;
    };

    play();
    function play() {
        cxt.clearRect(0 , 0 , w , h);
        for (var i = 1;i < stars.length;i++) {
            stars[i].draw();
        }
        requestAnimationFrame(play);
    }

    for (var i = 0;i < starsNum;i++) {
        new Star();
    }
//console.log(stars);


//封装一个随机函数,传参可以传一个数，没有顺序要求
    function random(min , max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        } else if (min > max) {
            var agency = min;
            min = max;
            max = agency;
        }
        return Math.floor(Math.random()*(max - min) + min);
    }

//星空旋转的半径
    function maxRadius(w,h) {
        return Math.sqrt(Math.pow(w , 2) + Math.pow(h , 2))/2;
    }
//测试
// for (var i = 0;i < 50;i++) {
//     console.log(random(10,5));
// }
})();