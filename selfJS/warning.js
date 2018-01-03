
//改变日期显示格式
function mmdd(m){
    if(m<10){
        m="0"+m;
    }
    return m;
}
// 设置列表高度
// function setHt(){
//     "use strict";
//     var h=document.documentElement.clientHeight;
//     $(".warning-list").css("height",h-203);
// }
//红色或灰色图标
function setIClass(iid,idArr){
    for(var i=0;i<idArr.length;i++){
        if(idArr[i]==iid){
            return "ibg-gray";
        }
    }
    return "ibg-red";
}
//获取报警列表
function getAlarmData(){
    var startDate=$("#timeSta").val();
    var endDate=$("#timeEnd").val();
    var projectid= $("#classify>span").attr("data-toggle");
    var index=layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/AlarmData/GetAlarmData",
        data:{STARTDATE:startDate,ENDDATE:endDate,PROJECTID:projectid},
        success:function(data){

            data = eval('(' + data.Data+ ')');
            console.log(data);
            var idArr=localStorage["idArr"].split(",");
            var html="";
            if(data.length==0){
                html+="<li class='text-center black'>暂无数据</li>"
            }else{
                for(var i=0;i<data.length;i++){
                    var obj=data[i];
                    var alarmTime=obj.alarm_time;
                    var date=alarmTime.split("T")[0];
                    date=date.substr(date.indexOf("-")+1)
                    var time=alarmTime.split("T")[1];
                    time=time.substr(time.indexOf(":")+1)
                    alarmTime=date+" "+time;
                    var c=setIClass(obj.ID,idArr);

                    html+= "<li class='flex' data-toggle="+obj.ID+"> <div> <i class= 'lf "+c+"'></i> <div> <h2>"+obj.position+" </h2> <p>"+obj.reason_name+" </p> </div> </div> <p><span>"+alarmTime+"</span> <img src='images/right_03.png'> </p> </li>"
                }
            }


            $("#warning-list ul").html(html);
            layer.close(index)
        },
        error:function(){
            alert("网络错误！")
            layer.close(index)
        }
    })
}
//获取报警详情
function getAlarmdealData(alarmid,alarmReason){
    var index=layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/AlarmData/GetAlarmData",
        data:{ALARMID:alarmid},
        success:function(data){

            data = eval('(' + data.Data+ ')');

            if(data){
                //报警地点
                $("#alarmAddr").html(data[0].position);
                //报警项目
                $("#alarmProject").html(data[0].reason_name);
                //报警原因
                $("#warningReason").html(alarmReason);
                //实际值
                $("#actualVal").html(data[0].real_value);
                //参考值
                $("#referenceVal").html(data[0].reference_value);
                //最后发生时间
                $("#lastHappenTime").html(data[0].alarm_time.split("T")[0]);
            }

            layer.close(index)

        },
        error:function(){
            alert("网络错误！")
            layer.close(index)
        }
    })
}
//获取报警类型列表
function getAlarmProjectData(){
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/AlarmData/GetAlarmProjectData",
        success:function(data){

             data = eval('(' + data.Data+ ')');
            var html="";
            for(var i=0;i<data.length;i++){
                var obj=data[i];
                html+="<li data-toggle="+obj.project_id+">"+obj.project_content+"</li>"
            }
            $("#classify ul").html(html);
        },
        error:function(){
            alert("网络错误！")
        }
    })
}
//获取几天的报警数据
function getStatisticsData(){
    var index=layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/AlarmData/GetStatisticsData",

        data:{TIME:"1"},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            $("#todayWarning").html(data.length);
            layer.close(index)
        },
        error:function(){
            alert("网络错误！");
            layer.close(index)
        }
    })

    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/AlarmData/GetStatisticsData",
        data:{TIME:"7"},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            $("#sevenWarning").html(data.length);
        },
        error:function(){
            alert("网络错误！")
        }
    })
}

//主函数
$(function(){
    "use strict";

    //设置日期初始值
    (function(){
        //设置初始搜索时间 默认为当天
        var d = new Date();
        var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        str=str.split("-");
        $(".YN_TIME").val(str[0]+"-"+mmdd(str[1])+"-"+mmdd(str[2]));
    })();

    $("#footer").on('click','ul li',function(){
        "use strict";
        var jumpPath=$(this).attr("data-toggle");
        window.location.href=jumpPath;

    })

    //日历控件
    $(".YN_TIME").datepicker({
        maxDate: new Date(),
        // showButtonPanel:true,
        changeMonth: true,
        changeYear: true,
        dateFormat:"yy-mm-dd"

    })
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

    // 设置列表高度
    // setHt();
    //分类下拉列表
    $("#putDown").click(function(){
        var sta=$(this).data("toggle");
        if(sta==1){
            $("#classify ul").hide(200);

            $(this).data("toggle",0);
        }else if(sta==0){
            $("#classify ul").show(200);

            $(this).data("toggle",1);
        }
    })
    $("#classify ul").on('click','li',function(){

        var toggle=$(this).data("toggle");

        $("#classify>span").html($(this).html()).attr("data-toggle",toggle);

        $("#classify ul").hide(200);
        $("#putDown").data("toggle",0)
    })

    //模态框关闭按钮
    $(".close").click(function(){
        "use strict";
        $(".modal").hide(500);
    })

    //localStorage存储已查看的id  全局变量idArr
    if(localStorage["idArr"]==undefined){
        var idArr=[];
        localStorage["idArr"]=idArr;
    }else{
        var idArr=[];
        var did=localStorage["idArr"];
        did=did.split(",");
        for(var z=0;z<did.length;z++){
            idArr.push(did[z])
        }

    }


    //点击列表显示模态框
    $(".warning-list").on("click","li",function(){

        if($(this).data("toggle")){
            $(".modal").show(500);
            var alarmReason=$(this).find("div p").html();

            var alarmid=$(this).data("toggle");
            getAlarmdealData(alarmid,alarmReason);

            //点击之后变成灰色
            $(this).find("i").addClass("ibg-gray");

            (function(){
                for(var i=0;i<idArr.length;i++){
                    if(idArr[i]==alarmid){
                        return;
                    }
                }
                idArr.push(alarmid);
            })()
            localStorage["idArr"]=idArr;
        }



    })



    //获取报警类型列表
    getAlarmProjectData();

    //获取几天的报警数据
    getStatisticsData();
    //点击搜索
    $("#search").click(function(){

        if( $("#classify>span").html()=="分类"){
            alert("请选择报警类型!")
        }else{
            //获取报警列表
            getAlarmData();
        }

    })





})
