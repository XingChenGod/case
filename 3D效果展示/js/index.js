

$(function () {
    var $oMain = $("#main"),
        Linum = 5*5*5;//li数量

    //在ul当中添加li,F5刷新
    for (var i = 0;i < Linum;i++) {
        //创建li
        var $li = $("<li><p class='title'>"+demoArr[0].title+"</p></li>");
        var RanX = Math.random()*5000 - 2500,
            RanY = Math.random()*5000 - 2500,
            RanZ = Math.random()*5000 - 2500;//随机
        $li.css({
            "transform" : "translate3d("+RanX+"px,"+RanY+"px,"+RanZ+"px)"
        });

        $oMain.append($li);
        setTimeout(function () {
            Grid();
        },300);
    }
    //点击选项按钮
    $("#stylebtn li").click(function (ev) {
        var ev = ev || window.event;
        ev.cancelBubble = false;
        var BtnIndex = $(this).index();
        switch (BtnIndex) {
            case 0:
                Table();
                break;
            case 1:
                sphere();
                break;
            case 2:
                Helix();
                break;
            case 3:
                Grid();
                break;
        };
    });
    //网格
    function Grid() {
        var X = 300,Y = 300,Z = 800;//各维度偏移量

        var firstX = -2*X,
            firstY = -2*Y,
            firstZ = -2*Z;
        $("#main li").each(function (i) {
            var iX = (i%25)%5,//x方向
                iY = parseInt((i%25)/5),//y方向
                iZ = parseInt(i/25);

            $(this).css({
                "transform" : "translate3d("+(firstX+iX*X)+"px,"+(firstY+iY*Y)+"px,"+(firstZ+iZ*Z)+"px)",
            });
        });

    }
    //螺旋
    function Helix() {
        var midIndex = Math.floor(Linum/2),//找到中间位置，使整体居中
            firstY = -8*midIndex;
        $("#main li").each(function (i) {
            $(this).css({
                "transform" : "rotateY("+10*i+"deg) translateY("+(firstY+8*i)+"px) translateZ(800px)"
            });
        });
    }
    
    //球体  难点
    function sphere() {
        var arr = [1,4,8,10,12,17,22,16,14,9,6,5,1],
            RotX = 180/arr.length,//每一层x轴翻转
            firstRotX = 90;//第一层第一个翻转的角度
        $("#main li").each(function (j) {
            var sum = 0;
            var index,num;//index是第几层
            for (var i = 0;i < arr.length;i++) {
                sum += arr[i];

                if (sum >= j+1) {
                    index = i;
                    num = arr[i] - (sum-j);
                    break;
                }
            }
            var RotY = 360/arr[index];
            var x = index%2?firstRotX+index*RotX:firstRotX-index*RotX;
            var y = num*RotY;
            var z = 0;
            if ( x > 90 && x < 270 )
            {
                z = 180;
            }
            $(this).css({
                transform : 'rotateY('+y+'deg) rotateX('+x+'deg) rotateZ('+z+'deg) translateZ(800px)'
            });
        });
    }
    //元素周期表
    function Table() {
        var Tx = 160,Ty = 200,//xy的单位偏移量
            firstX = -9*Tx + 60,//每一行18个，第一个x轴偏移，+60保持整体位置居中
            firstY = -4*Ty;//Y轴偏移量
        var arr = [             //元素周期表的上半部分，总共18个
            {x:firstX,y:firstY},
            {x:firstX+17*Tx,y:firstY},
            {x:firstX , y:firstY+Ty },
            {x:firstX+Tx , y:firstY+Ty},
            {x:firstX+12*Tx , y:firstY+Ty },
            {x:firstX+13*Tx , y:firstY+Ty },
            {x:firstX+14*Tx , y:firstY+Ty },
            {x:firstX+15*Tx , y:firstY+Ty },
            {x:firstX+16*Tx , y:firstY+Ty },
            {x:firstX+17*Tx , y:firstY+Ty },
            {x:firstX , y:firstY+Ty*2 },
            {x:firstX+Tx , y:firstY+Ty*2},
            {x:firstX+12*Tx , y:firstY+Ty*2 },
            {x:firstX+13*Tx , y:firstY+Ty*2 },
            {x:firstX+14*Tx , y:firstY+Ty*2 },
            {x:firstX+15*Tx , y:firstY+Ty*2 },
            {x:firstX+16*Tx , y:firstY+Ty*2 },
            {x:firstX+17*Tx , y:firstY+Ty*2 }
        ];
        var x,y;
        $("#main li").each(function (i) {
            if (i < 18) {
                x = arr[i].x;
                y = arr[i].y;
            } else {
                x = ((i+18)%18)*Tx + firstX;
                y = (parseInt((i+18)/18)+1)*Ty + firstY
            }
            $(this).css({
                "transform" : "translate("+x+"px,"+y+"px)"
            });
        });
    }
    //点击li
    (function () {
        $("#main li").click(function (ev) {
            ev = ev || window.event;
            $("#show").fadeIn(1000).css({
                "transform" : "rotateY(0deg) scale(1)",
                "display" : "block"
            });
            ev.stopPropagation();//阻止冒泡
        });
        $(document).click(function () {
            $("#show").fadeOut(1000,function () {//动画结束之后重置
                $(this).css({
                    "transform" : "rotateY(0deg) scale(1.5)",
                    "display" : "none"
                });
            }).css({
                "transform" : "rotateY(180deg) scale(0.2)"
            });
        })
        $("#show").click(function (ev) {
            ev = ev || window.event;
            $("#wrap").css({
                "marginLeft" : "-100%"
            });
            $("#frame").css({
               "left" : "0"
            }).find("iframe").attr("src" , "../兰途科技/兰途科技.html");
            ev.stopPropagation();
        });
        $("#frame .f-btn").click(function () {
            $("#frame").css({
                "left" : "100%"
            }).find("iframe").removeAttr("src");
            $("#wrap").css({
               "marginLeft" : 0
            });
        });
    })();


    //拖拽
    (function () {
        var nowX,lastX,DiffX=0,
            nowY,lastY,DiffY=0,
            TZ = -2000,
            RotaX = 0,
            RotaY = 0;
        var timer1;//鼠标释放时候的动画效果
        var timer2;//滚轮动画
        $(document).mousedown(function () {
            var ev = ev || window.event;
            lastX = ev.clientX;
            lastY = ev.clientY;
            clearInterval(timer1);
            $(this).on("mousemove",function (ev) {
               var ev = ev || window.event;
               nowX = ev.clientX;
               nowY = ev.clientY;
               //X变化
               DiffX = nowX - lastX;
               DiffY = nowY - lastY;
               //转换
               RotaY += DiffX*0.2;
               RotaX -= DiffY*0.2;

               $("#main").css({
                   "transform" : "translateZ("+TZ+"px) rotateX("+RotaX+"deg) rotateY("+RotaY+"deg)"
               });
                //获取
               lastX = ev.clientX;
               lastY = ev.clientY;
            })
        }).mouseup(function () {
            $(this).off("mousemove");
            timer1 = setInterval(function () {
                DiffX *= 0.95;//使变化量无限接近于0
                DiffY *= 0.95;
                if (Math.abs(DiffX) < 0.5 && Math.abs(DiffY) < 0.5)
                    clearInterval(timer1);
                RotaY += DiffX*0.2;
                RotaX -= DiffY*0.2;
                $("#main").css({
                    "transform" : "translateZ("+TZ+"px) rotateX("+RotaX+"deg) rotateY("+RotaY+"deg)"
                });
            },17);
        }).//contextmenu(function () {//取消右键默认
            //return false;}).
        mousewheel(function (e,d) {
            clearInterval(timer2);
            TZ += d*100;
            $("#main").css({
                "transform" : "translateZ("+TZ+"px) rotateX("+RotaX+"deg) rotateY("+RotaY+"deg)"
            });
            timer2 = setInterval(function () {
                d *= 0.8;
                TZ += d*100;
                if (Math.abs(TZ) < 0.1)
                    clearInterval(timer2);
                $("#main").css({
                    "transform" : "translateZ("+TZ+"px) rotateX("+RotaX+"deg) rotateY("+RotaY+"deg)"
                });
            },17);
        })
    })();
})