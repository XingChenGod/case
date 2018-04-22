//点击nva3
(function () {
    var aNav3 = $(".h-c-nav3"),
        oNav4 = $("#h-c-n3-nav4"),
        flag = true;

    aNav3.click(function () {
        if (flag) {
            oNav4.css("display","block");
            flag = false;
        } else {
            oNav4.css("display","none");
            flag = true;
        }
    });
})();

//banner部分
(function () {
    var aTab = $("#banner ul.b-tab li"),
        aImg = $("#banner ul.b-img li"),
        length = aTab.length,
        index = 0;
    //点击按钮tab
    aTab.eq(0).addClass("on");
    aImg.eq(0).show();
    aTab.click(function () {
        var i = $(this).index();
        if (i !== index) {
            change(function () {
                index = i;
            });
        }
    });
    //动画部分
    var Timer;
    function auto() {
       Timer = setInterval(function () {
            change(function () {
                index ++;
                index %= length;
            });
        },2000);
    };
    auto();
    //划入清除动画
    $("#banner").hover(function () {
        clearInterval(Timer);
    },auto);
    //动画部分封装
    function change(fn) {
        aTab.eq(index).removeClass("on");
        aImg.eq(index).fadeOut(500);
        fn && fn();
        aImg.eq(index).fadeIn(500);
        aTab.eq(index).addClass("on");

    }
})();
//classic banner部分
(function () {
    var $oUl = $("#container .c-banner .c-b-img ul"),
        $aLi = $oUl.children(),
        $aBtn = $("#container .c-banner .c-b-btn span"),
        $aTab = $("#container .c-banner .c-b-tab ul li"),
        Width = $aLi.eq(0).width();
        length = $aLi.length,
        midIndex = Math.floor(length/2),
        clickTime = 0,
        sumWidth = 0,
        T = null;

    changeClassName();

    setTimeout(function () {
        sumWidth = 0;
        $aLi.each(function () {
           sumWidth += $(this).width();
        });
        $oUl.css("marginLeft",-sumWidth/2+"px").css("opacity",1);
    },300);

    //窗口变化时
    $(window).resize(function () {
        clearTimeout(T);
        T = setTimeout(function () {
            Width = $oUl.children().eq(0).width();
            sumWidth = 0;
            $aLi.each(function () {
                sumWidth += $(this).width();
            });
            $oUl.animate({'marginLeft' : -sumWidth/2+'px'},300);
        },300);
    });
    //点击Btn
    $aBtn.click(function () {
        if (new Date() - clickTime > 350) {
            var Left;
            if ($(this).index()) {
                midIndex ++;
                midIndex %= length;
                //changeClassName();
                Left = -sumWidth/2 - Width;
                $oUl.stop().animate({
                    "marginLeft" : Left +"px"
                },300,function () {
                    $(this).css("marginLeft",-sumWidth/2+"px").append($(this).children().eq(0));
                });
            } else {
                midIndex --;
                if (midIndex < 0) midIndex = length - 1;
                //changeClassName();
                Left = -sumWidth/2 + Width;
                $oUl.stop().animate({
                    "marginLeft" : Left +"px"
                },300,function () {
                    $(this).css("marginLeft",-sumWidth/2+"px").prepend($(this).children().eq(length-1));
                });
            };
            changeClassName();
            clickTime = new Date();
        };
    });

    function changeClassName() {
        $aLi.removeClass("slide mid");
        $aTab.removeClass("active");
        var a = midIndex,
            b = midIndex + 1,
            c = midIndex - 1;
        if (b >= length) b = 0;
        if (c < 0) c = length - 1;
        $aTab.eq(a).addClass("active");
        $aLi.eq(a).addClass("mid");
        $aLi.eq(b).addClass("slide");
        $aLi.eq(c).addClass("slide");
    }
    // var $oUl = $("#container .c-banner .c-b-img ul"),
    //     $aLi = $oUl.children(),
    //     $aTab = $("#container .c-banner .c-b-tab ul li"),
    //     $abtn = $("#container .c-b-btn span"),
    //     $oImg = $("#container .c-banner .c-b-img"),
    //     length = $aLi.length,
    //     width = $aLi.width(),
    //     midIndex = Math.floor(length/2),
    //     winWidth = $(window).width(),
    //     oImgWidth = $oImg.width(),
    //     midWidth,midLeft,nowLeft,UlMarginLeft,
    //     clickTime = 0;//点击时间的限制
    //
    // $oUl.css("opacity",0);
    // changeClassName();
    // setTimeout(function () {
    //     midWidth = $aLi.eq(midIndex).width(),
    //     midLeft = winWidth/2 - midWidth/2,
    //     nowLeft = $aLi.eq(midIndex).offset().left,
    //     UlMarginLeft = midLeft - nowLeft;
    //
    //     $oUl.css({"marginLeft" : UlMarginLeft +"px","opacity" : 1});
    // },300);
    // // var midWidth = $aLi.eq(midIndex).width(),
    // //     midLeft = winWidth/2 - midWidth/2,
    // //     nowLeft = $aLi.eq(midIndex).position().left,
    // //     UlMarginLeft = midLeft - nowLeft;
    // //
    // // $oUl.css("marginLeft",UlMarginLeft +"px");
    // //窗口改变时
    // $(window).resize(function () {
    //     winWidth = $(window).width();
    //     midLeft = winWidth/2 - midWidth/2;
    //     nowLeft = $aLi.eq(midIndex).offset().left,
    //     UlMarginLeft = midLeft - nowLeft;
    //     $oUl.css("marginLeft",UlMarginLeft + "px");
    // });
    //
    // //点击按钮
    // $abtn.click(function () {
    //     if (new Date() - clickTime > 350) {
    //         var Left;
    //         if ($(this).index()) {
    //             midIndex ++;
    //             midIndex %= length;
    //             changeClassName();
    //             Left = UlMarginLeft - width;
    //             $oUl.stop().animate({
    //                 marginLeft : Left + "px",
    //             },300,function () {
    //                 $(this).append($(this).children().eq(0));
    //                 $(this).css("marginLeft",UlMarginLeft + "px");
    //             });
    //         } else {
    //             midIndex --;
    //             if (midIndex < 0)midIndex = length - 1;
    //             changeClassName();
    //             Left = UlMarginLeft + width;
    //             $oUl.stop().animate({
    //                 marginLeft : Left + "px",
    //             },300,function () {
    //                 $(this).prepend($(this).children().eq(length-1));
    //                 $(this).css("marginLeft",UlMarginLeft + "px");
    //             });
    //         };
    //         clickTime = new Date();
    //     }
    //
    // });
    // //给tab添加颜色
    // // var $aTab = $("#container .c-banner .c-b-tab ul li"),
    // //     TabLength = $aTab.length;
    // // $aTab.each(function (i) {
    // //     $aTab.eq(i).css("background","rgba()")
    // // });
    // //封装换名字
    // function changeClassName() {
    //     $aLi.removeClass("slide mid");
    //     $aTab.removeClass("active");
    //     var a = midIndex,
    //         b = midIndex + 1,
    //         c = midIndex - 1;
    //     if (b >= length) b = 0;
    //     if (c < 0) c = length - 1;
    //     $aTab.eq(a).addClass("active");
    //     $aLi.eq(a).addClass("mid");
    //     $aLi.eq(b).addClass("slide");
    //     $aLi.eq(c).addClass("slide");
    // }

})();


