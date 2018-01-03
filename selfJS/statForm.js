
//获得当月天数
function getDays(mouth){

//定义当月的天数；
    var days ;

    var date = new Date();

//获取年份
    var year = date.getFullYear();

    if(mouth==0){
        mouth=12;
    }else if(mouth==13){
        mouth=1;
    }
//当月份为二月时，根据闰年还是非闰年判断天数
    if(mouth == 2){
        days= year % 4 == 0 ? 29 : 28;

    }
    else if(mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12){
        //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days= 31;
    }
    else{
        //其他月份，天数为：30.
        days= 30;

    }

    //输出天数
    return days;
}

function mmdd(m){
    if(m<10){
        m="0"+m;
    }
    return m;
}

//后一天点击调用的函数
function nextDay(){

    var d =new Date();
    var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    str=str.split("-");
    var year=parseInt($("#hidYear").val());
    var dayNum=$("#dayNum").html();
    var monthNum=$("#monthNum").html();
    var allMouthDay=getDays(monthNum);
    if(parseInt(dayNum)<parseInt(allMouthDay)){
        dayNum++;
        $("#dayNum").html(dayNum);
        $("#timeDate").val(year+"-"+mmdd(monthNum)+"-"+mmdd(dayNum));
    }else{


        if(parseInt(year)<parseInt(str[0])||parseInt(year)<=parseInt(str[0])&&parseInt(monthNum)<=parseInt(str[1])){
            $("#dayNum").html(1);
            monthNum++;
            if(monthNum>12){
                monthNum=1;
            }
            $("#monthNum").html(monthNum);
            $("#timeDate").val(year+"-"+mmdd(monthNum)+"-"+mmdd(1));

        }

    }
    isHasnext();
    //获得抄回户数
    getCopy();
    // POST /api/MRData/GetComDayFlowData
    // 获取小区日日用量列表,不包括本日
    getDailyForm();
}

//判断是否有后一天
function isHasnext(){
    "use strict";

    var d = new Date();
    var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    str=str.split("-");

    var pageYear=$("#hidYear").val();
    var pageMouth=$("#monthNum").html();
    var pageDay=$("#dayNum").html();

    if((parseInt(pageYear)<parseInt(str[0]))||(parseInt(pageYear)<=parseInt(str[0])&&parseInt(pageMouth)<=parseInt(str[1])&&parseInt(pageDay)<parseInt(str[2]))||(parseInt(pageYear)<=parseInt(str[0])&&parseInt(pageMouth)<parseInt(str[1]))){
        $(".next-day").removeClass("next-readonly");
        if($(".next-day").attr("onclick")==undefined){
            $(".next-day").attr("onclick","nextDay()");
        }
    }else{
        $(".next-day").addClass("next-readonly");
        $(".next-day").removeAttr("onclick");
    }

}

//获取水厂列表
function getWaterList(){
    var index = layer.open({type: 2});


    //计算请求状态
    var status=0;

    var totalPConsumption=0;
    //水厂
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/StationData/GetWaterworks",
        data:{SCTYPE:"水厂"},
        success:function(data){
            data = eval('(' + data.Data+ ')');

            var liArr=$("#waterWorksAll>li");

            var html="";

            for(var j=0;j<data.length;j++){

                var obj=data[j];

                for(var n=0;n<liArr.length;n++){
                    var waterName=$(liArr[n]).find("span:first").html().trim();
                    if(waterName==obj.cSCName){
                        $(liArr[n]).remove();
                    }
                }

                html+=   "<li data-toggle="+obj.iID+"><span class='lf'>"+ obj.cSCName+" </span> <span class='rf'>0</span> <div class='produceGra' style='width:0%'> </div></li>"

            }

            $("#waterWorksAll").append(html);


            var waterWorks=$("#waterWorksAll>li");

            //总制水量
            var totleProduceWater=0;
            //水厂耗电量
            var waterWorksPower=0;
            for(var i=0;i<waterWorks.length;i++){

                (function(i){
                    var scid=$(waterWorks[i]).data("toggle");

                    if(scid){
                        $.ajax({
                            type:"POST",
                            dataType:'json',
                            url:"http://218.201.228.115:8090/api/StationData/GetWaterworksRealData",
                            data:{SCID:scid},
                            success:function(data){
                                data = eval('(' + data.Data+ ')');

                                if(data.length>12){
                                    // $(waterWorks[i]).find(".idPressure").html(data[3].fValue.toFixed(2)+data[3].cUnit);
                                    $(waterWorks[i]).find("span:last").html(data[12].fValue.toFixed(2)+data[12].cUnit);
                                    // $(waterWorks[i]).find(".outputPower").html(data[13].fValue.toFixed(2)+data[13].cUnit);
                                    // $(waterWorks[i]).addClass("blueGra")
                                    $(waterWorks[i]).find("div").css({
                                        width:produceWater(data[12].fValue,100000)
                                    });
                                    totleProduceWater+=data[12].fValue;
                                    waterWorksPower+=data[13].fValue;
                                }else{
                                    // $(waterWorks[i]).addClass("grayGra")
                                }

                                layer.close(index);
                            },
                            error:function(){
                                alert("网络错误！")
                                layer.close(index);
                            }
                        })
                    }

                })(i)


            }

            //设置总制水量
            $("#totleProduceWater").html(totleProduceWater.toFixed(3));
            //设置水厂耗电量
            $("#waterWorks").find("span:last").html(waterWorksPower+"KW·h");
            $("#waterWorks").find("div").css({
                width:produceWater(waterWorksPower,100000)
            });
            totalPConsumption+=waterWorksPower;
            layer.close(index);
            status+=50;
            if(status==100){
                //设置总耗电量
                $("#totlePowerOut").html(totalPConsumption);
            }
        },
        error:function(){
            alert("网络错误！")
            layer.close(index);
        }
    })
    //污水厂
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/StationData/GetWaterworks",
        data:{SCTYPE:"污水厂"},
        success:function(data){
            data = eval('(' + data.Data+ ')');

            var liArr=$("#sewageAll>li");

            var html="";

            for(var j=0;j<data.length;j++){

                var obj=data[j];

                for(var n=0;n<liArr.length;n++){
                    var waterName=$(liArr[n]).find("span:first").html().trim();
                    if(waterName==obj.cSCName){
                        $(liArr[n]).remove();
                    }
                }

                html+=   "<li data-toggle="+obj.iID+"><span class='lf'>"+ obj.cSCName+" </span> <span class='rf'>0</span> <div class='produceGra' style='width:0%'> </div></li>"

            }

            $("#sewageAll").append(html);


            var waterWorks=$("#sewageAll>li");

            //污水处理
            var totleProduceWater=0;
            //污水厂耗电量
            var waterWorksPower=0;
            for(var i=0;i<waterWorks.length;i++){

                (function(i){
                    var scid=$(waterWorks[i]).data("toggle");

                    if(scid){
                        $.ajax({
                            type:"POST",
                            dataType:'json',
                            url:"http://218.201.228.115:8090/api/StationData/GetWaterworksRealData",
                            data:{SCID:scid},
                            success:function(data){
                                data = eval('(' + data.Data+ ')');

                                if(data.length>12){
                                    // $(waterWorks[i]).find(".idPressure").html(data[3].fValue.toFixed(2)+data[3].cUnit);
                                    $(waterWorks[i]).find("span:last").html(data[12].fValue.toFixed(2)+data[12].cUnit);
                                    // $(waterWorks[i]).find(".outputPower").html(data[13].fValue.toFixed(2)+data[13].cUnit);
                                    // $(waterWorks[i]).addClass("blueGra")
                                    $(waterWorks[i]).find("div").css({
                                        width:produceWater(data[12].fValue,100000)
                                    });
                                    totleProduceWater+=data[12].fValue;
                                    waterWorksPower+=data[13].fValue;
                                }else{
                                    // $(waterWorks[i]).addClass("grayGra")
                                    totleProduceWater+=0;
                                }

                                layer.close(index);
                            },
                            error:function(){
                                alert("网络错误！")
                                layer.close(index);
                            }
                        })
                    }

                })(i)


            }

            //设置污水处理
            $("#sewageTreatment").html(totleProduceWater.toFixed(3));
            //设置污水厂耗电量
            $("#sewage").find("span:last").html(waterWorksPower+"KW·h");
            $("#sewage").find("div").css({
                width:produceWater(waterWorksPower,100000)
            });
            totalPConsumption+=waterWorksPower;
            layer.close(index);
            status+=50;
            if(status==100){
                //设置总耗电量
                $("#totlePowerOut").html(totalPConsumption);
            }
        },
        error:function(){
            alert("网络错误！")
        }
    });



}


//制水量算法
function produceWater(fOutFlow,totle){
    var percentage=fOutFlow/totle*100;
    if(percentage>100){
        percentage=100;
    }
    percentage+="%";
    return percentage;

}



//获取统计数据
function getStaData(){
    var index=layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/StationData/GetStationStatisticsData",
        success:function(data){
            data = eval('(' + data.Data+ ')');

            $("#saJin span:nth-child(2)").html(data[0].fOutFlow.toFixed(2));
            $("#saJin div").css({
                width:produceWater(data[0].fOutFlow,100000)
            });

            //总制水量
            $("#totleProduceWater").html(data[0].fOutFlow.toFixed(2));

            //总耗电量
            $("#totlePowerOut").html(data[0].fTotalElectric.toFixed(2));
            //水厂耗电量
            $("#waterWorks span:nth-child(2)").html(data[0].fTotalElectric.toFixed(2));
            $("#waterWorks div").css({
                width:produceWater(data[0].fTotalElectric,100000)
            });

            layer.close(index)
        },
        error:function(){
            alert("网络错误！")
            layer.close(index)
        }
    })
}

//获取抄回数 剩余数
function getCopy(){
    var totleMeter="";
    var str =$("#timeDate").val();
    var index=layer.open({type: 2});
    //获取小区水表总数
    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/MRData/GetMeterCountByCom",

        data:{ community_id:23},
        success:function(data){
            totleMeter=data.Data;


            //获取小区抄回数
            $.ajax({
                type:"POST",
                dataType:'json',
                url:"http://218.201.228.115:8090/api/MRData/GetReadCountByCom",

                data:{ community_id:23,date:str},
                success:function(data){

                    $("#copyHouseholds").html(data.Data);
                    $("#copyGardenHousing span:nth-child(2)").html(data.Data);
                    $("#copyGardenHousing div").css({
                        width:produceWater(data.Data,totleMeter)
                    });
                    layer.close(index)
                },
                error:function(){
                    alert("网络错误！")
                    layer.close(index)

                }
            })

        },
        error:function(){
            alert("网络错误！")

        }
    })




}

// POST /api/MRData/GetComDayFlowData
// 获取小区日日用量列表,不包括本日
function getDailyForm(){
    var index=layer.open({type: 2});
    var str =$("#timeDate").val();
    var d = new Date();
    var n1=d.getDate();

    var n=str.split("-")[2];
    var num=n1-n+1;

    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/MRData/GetComDayFlowData",
        data:{ community_id:"23",days:num},
        success:function(data){
            data=data.Data;
            var totalFlowArr=[];
            var comDateArr=[];
            for(var i=0;i<data.length;i++){
                var obj=data[i];
                totalFlowArr.unshift(obj.TotalFlow);
                var mouth=obj.ComDate.split("-")[1];
                var day=obj.ComDate.split("-")[2];
                var time=mouth+"-"+day;
                comDateArr.unshift(time);
            }

            $("#totleUseWater").html(totalFlowArr[0]);
            $("#gerdenCommunity span:nth-child(2)").html(totalFlowArr[0]);
            $("#gerdenCommunity div").css({
                width:produceWater(totalFlowArr[0],totalFlowArr[0])
            });
            layer.close(index)
        },
        error:function(){
            alert("网络错误！");

        }
    })
}


$(function(){
    "use strict";
    (function(){
        //设置年份的初始值当前年
        var year = new Date().getFullYear();
        $("#hidYear").val(year);

        var d = new Date();
        var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();

        str=str.split("-");


        $("#timeDate").val(str[0]+"-"+mmdd(str[1])+"-"+mmdd(str[2]));
        var mouth=str[1];
        var day=str[2];



        $("#monthNum").html(mouth);
        $("#dayNum").html(day)
    })();

    getWaterList();

    getCopy();

    //判断是否有后一天
    isHasnext();
    //前一天
    $(".prev-day").click(function(){

       var year=parseInt($("#hidYear").val());
        var dayNum=$("#dayNum").html();
        var monthNum=$("#monthNum").html();
        if(dayNum>1){
            dayNum--;
            $("#dayNum").html(dayNum)
            $("#timeDate").val(year+"-"+mmdd(monthNum)+"-"+mmdd(dayNum));
        }else{
            $("#dayNum").html(getDays(monthNum-1));
            if(monthNum>1){
                monthNum--;
                $("#monthNum").html(monthNum)
                $("#timeDate").val(year+"-"+mmdd(monthNum)+"-"+getDays(monthNum));
            }else{
                $("#monthNum").html(12);
                $("#timeDate").val(12+"月"+getDays(12)+"日");
                $("#timeDate").val(year+"-12-"+getDays(12));
                year--;

                $("#hidYear").val(year)
            }

        }

        isHasnext();

        getDailyForm();

        //获得抄回户数
        getCopy();
    })

    $("#footer").on('click','ul li',function(){
        "use strict";
        var jumpPath=$(this).attr("data-toggle");
        window.location.href=jumpPath;

    })

        //日历控件
        $(".YN_TIME").datepicker({
            maxDate: new Date(),
            showOn: "both",
            buttonImage: "images/fenxi_07.png",
            buttonImageOnly: true,
            // showButtonPanel:true,
            changeMonth: true,
            changeYear: true,
            dateFormat:"yy-mm-dd",
            onSelect:function(dateText, inst) {


                var mouth=dateText.split("-")[1];
                var day=parseInt(dateText.split("-")[2]);
                $("#monthNum").html(parseInt(mouth))
                $("#dayNum").html(day)
                isHasnext();
                //获得抄回户数
                getCopy();

                // POST /api/MRData/GetComDayFlowData
            // 获取小区日日用量列表,不包括本日
                getDailyForm();

            }

        });
        $.datepicker.regional['zh-CN'] = {
            closeText: '关闭',
            prevText: '上一月',
            nextText: '下一月',
            currentText: '今天',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['01', '02', '03', '04', '05', '06',
                '07', '08', '09', '10', '11', '12'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            weekHeader: '周',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: ' 年 '
        };
        $.datepicker.setDefaults($.datepicker.regional['zh-CN']);

    //获取统计数据
    // getStaData();

// POST /api/MRData/GetComDayFlowData
// 获取小区日日用量列表,不包括本日
    getDailyForm();

})

