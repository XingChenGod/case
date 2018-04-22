(function () {
    //时间部分
    time();
    setInterval(time , 1000);
    function time() {
        var $oMouth = $("#time .left .t-l-text .mouth"),
            $oDate = $("#time .left .t-l-text .date");


        var nowTime = new Date();
//左边部分
        //获取月份
        var mouth = nowTime.getMonth(),
            arrMouth = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

        //获取号
        var date = nowTime.getDate();

        //console.log(mouth,date);
        $oMouth.html(arrMouth[mouth]);
        $oDate.html(date);
//右边部分
        var $oRtime = $("#time .right .t-r-time"),
            $oRdate = $("#time .right .t-r-date"),
            $oWeek = $("#time .right .t-r-week");
        //设置时间几点几分几秒
        var years = nowTime.getFullYear(),
            hours = nowTime.getHours(),
            minutes = nowTime.getMinutes(),
            seconds = nowTime.getSeconds(),
            week = nowTime.getDay(),
            arrWeek = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];

        //console.log(years,mouth,hours,minutes,seconds,week);
        function zero(a) {
            //判断是否加0
            var b;
            if (a < 10) {
                b ="0" + a;
            } else {
                b = a;
            }
            return b;
        }
        //设置时分秒
        $oRtime.html(zero(hours)+":"+minutes+":"+zero(seconds));
        //设置年月日
        $oRdate.html(years+"年"+zero(mouth+1)+"月"+zero(date)+"日");
        $oWeek.html(arrWeek[week]);
    }
})();
    //拖拽部分,点击close部分
(function () {
    var $oTime = $("#time"),
        Diffx,Diffy;

    $oTime.mousedown(function (ev) {
        var ev = ev || window.ev;
        ev.stopPropagation();
        var lastx = ev.clientX,
            lasty = ev.clientY;
        var left = $oTime.position().left,
            top = $oTime.position().top;
        console.log($oTime.position().left , $oTime.position().top);
        $(document).on("mousemove" , function (ev) {
            ev.stopPropagation();
            var nowx = ev.clientX,
                nowy = ev.clientY;

            Diffx = nowx - lastx;
            Diffy = nowy - lasty;
            console.log(Diffx , Diffy);
            $oTime.css({
                "left" : left + nowx - lastx + "px",
                "top" : top + nowy - lasty + "px"
            });
            left = $oTime.position().left;
            top = $oTime.position().top;
            lastx = ev.clientX;
            lasty = ev.clientY;
        });
    });
    $(document).mouseup(function () {
        $(document).off("mousemove");
    });
    // $oTime.on("mousedown" , function (ev) {
    //     var ev = ev || window.event;
    // })

    var $oCLose = $("#time .close");

    $oCLose.click(function () {
        $oTime.css("display" , "none");
    });
})();