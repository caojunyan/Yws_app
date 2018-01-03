function waterBall(val,unit){
    "use strict";
    var option05, myChart06 = echarts.init(document.getElementById('waterBall'));
    option05 = {

        series: [{
            type: 'liquidFill',
            data: [0.7, 0.6],
            center:['50%','50%'],
            radius:'100%',
            itemStyle: {
                normal: {
                    shadowBlur: 0
                }
            },
            //水颜色
            color: ['rgba(35,148,211,.3)', 'rgba(30,124,181,.3)' ],

            //背景
            backgroundStyle: {
                color: '#19486C',
            },



            label: {
                normal: {
                    formatter:val.toFixed(2)+unit,
                    textStyle: {
                        fontSize: 16,
                        fontWeight:400
                    }
                }
            },
            outline: {
                borderDistance: 0,
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#16C7DE',
                    shadowBlur: false

                }
            }
        }]
    }

    myChart06.setOption(option05);
}


function modalPolyLine(data,color,pid,units,pType,timeArr){
    "use strict";
    var polyline=echarts.init(document.getElementById(pid));
    var res = ''
    var projectArray =[]
    var colorArray =['#02ABEA']
    var showDetails=''
    var option = {
        title: {
            text: ''
        },
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
                for(var i =0;i<params.length;i++){
                    if(params[i].value!='0'){
                        projectArray.push('</br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+colorArray[i]+'"></span>'+params[i].seriesName+':'+params[i].value+units);
                    }
                }
                if(projectArray.length!=0){
                    showDetails =''+params[0].name+projectArray.join("");
                    projectArray=[]
                    return showDetails
                }else{
                    showDetails = ''+params[0].name+'</br>各项暂无数据';
                    projectArray=[]
                    return showDetails
                }

            },
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            show:false,
            data:[pType]
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    show:false
                }
            }
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '3%',
           containLabel: true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : timeArr,
                axisLine: {
                    show: false,
                    onZero: true,

                    lineStyle: {
                        color: '#fff',
                        width: 0,
                        type: 'solid',

                        shadowOffsetX: 0,
                        shadowOffsetY: 0,

                    },
                },
                axisLabel: {
                    margin:26,
                    textStyle: {
                        color: '#000',
                        fontSize:'14'
                    },
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:units,
                nameTextStyle:{
                    color:"#999",

                },
                axisLine: {
                    show: false,
                    onZero: true,

                    lineStyle: {
                        color: '#ccc',
                        width: 0,
                        type: 'solid',

                        shadowOffsetX: 0,
                        shadowOffsetY: 0,

                    },
                },
                axisLabel: {
                    margin:26,
                    textStyle: {
                        color: '#000',
                        fontSize:'14'
                    },
                },
            }
        ],
        series : [
            {
                name:pType,
                type:'line',
                stack: '总量',
                lineStyle:{
                    normal:{
                        color:"transparent"
                    }
                },
                areaStyle: color,

                symbolSize:0,
                data:data
            },


        ]
    };

    polyline.clear();
    polyline.setOption(option,true);
}


//最小值
Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++){
        if (this[i] < min){
            min = this[i];
        }
    }
    return min;
}
//最大值
Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++){
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}

//如果值为负数则显示为 “暂时无法查看”
    function isMinus(num){
        if(num<0||num.length==0){
            return "暂无数据";
        }else{
            return num;
        }
    }

//跳转回上一页
function jumpBack(){
    window.history.go(-1);
}

//为页面中的实时数据赋值
function setVal(idSselector,data){
    if(data.fValue<0){
        data.fValue="暂无数据";
        data.cUnit="";
    }
    $("#"+idSselector).html(data.fValue).next().html(data.cUnit);
    $("#"+idSselector).parent().parent().attr("data-target",data.iDPID);
}

//今日报警
function warningNum(){
    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/AlarmData/GetStatisticsData",
        data:{TIME:"1"},
        success:function(data){
            data = eval('(' + data.Data+ ')');

            $("#warningNum").html(data.length);
        },
        error:function(){
            alert("网络错误！")
        }
    })
}

//获得某个水厂的实时数据
function getRealTimeData(){
    var iid= window.location.href;

    iid=iid.split("?")[1].split("=")[1];

    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/StationData/getwaterworksrealdata",
        data:{SCTYPE:iid},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            console.log(data);
            //压力
            setVal("pressureVal",data[3]);
            //液位
            setVal("liquidLevel",data[5]);

            // //变频器频率采集
            // setVal("transducer",data[6]);
            // setVal("ctrlValveVal",data[7]);

            //瞬时流量
            waterBall(data[9].fValue,data[9].cUnit)
            //今日耗电量
            $("#powerConsumption").html(data[13].fValue.toFixed(2)).parent().find("span").html(data[13].cUnit);
            //今日供水量
            $("#waterDelivery").html(data[12].fValue.toFixed(2)).parent().find("span").html(data[12].cUnit);
        },
        error:function(){
            alert("网络错误！")
        }
    })
}

//获得一天的历史数据
function getStationOneDayDate(pid) {
    //获得今天的日期
    var d = new Date();
    var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();

    var layerIndex = layer.load(1);
    $.ajax({
        type:"POST",
        url:"http://218.201.228.115:8090/api/StationData/GetStationOneDayData",
        data:{PID:pid,QDate:str},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            var dataArr=[];
            for(var i=1;i<=10;i++){
                var oneData=data[Math.floor((data.length-1)/10*i)];
                if(oneData!=undefined&&oneData.fValue>0){
                    dataArr.push(oneData) ;
                }

            }
            if(dataArr.length>0){

                //当前值
                var nowVal=dataArr[dataArr.length-1].fValue;
                nowVal=isMinus(nowVal);
                $("#currentVal").html(nowVal.toFixed(2));

                //平均值
                var totle=0;
                for(var n=0;n<dataArr.length;n++){
                    totle+=dataArr[n].fValue;
                }
                var average=totle/dataArr.length;

                average=isMinus(average);
                $("#meanVal").html(average.toFixed(2));


                //x轴的时间
                var dataTime=[];
                for(var j=0;j<dataArr.length;j++){
                    var dateTime=dataArr[j].dCollectDate.split("T")[1].split(":");
                    dateTime=dateTime[0]+":"+dateTime[1];
                    dataTime.push(dateTime)
                }


                //所有值的数组
                var dataVal=[];
                for(var k=0;k<dataArr.length;k++){
                    var val=dataArr[k].fValue;
                    dataVal.push(val)
                }


                //今日最高
                var maxVal=dataVal.max();
                maxVal=isMinus(maxVal)
                $("#maxVal").html(maxVal.toFixed(2));
                //今日最低
                var minVal=dataVal.min();
                minVal=isMinus(minVal);
                $("#minVal").html(minVal.toFixed(2));


                var colorArr=[
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#07C7FF'},
                                {offset: 1, color: '#00A2E3'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#29A7C9'},
                                {offset: 1, color: '#A260F5'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#F44778'},
                                {offset: 1, color: '#FF7A7D'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2D5EC4'},
                                {offset: 1, color: '#52B7F5'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#B245FE'},
                                {offset: 1, color: '#4D89FF'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#04A8EA'},
                                {offset: 1, color: '#4AD8EC'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#F2F2F2'},
                                {offset: 1, color: '#2B2B2B'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#166656'},
                                {offset: 1, color: '#FFC468'}
                            ]
                        ),
                        opacity:1
                    }},
                    {normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#07C5FD'},
                                {offset: 1, color: '#01A3E5'}
                            ]
                        ),
                        opacity:1
                    }}
                ];
                if(dataArr.length>0){
                    $("#polyLine1").show();
                    modalPolyLine(dataVal,colorArr[0],"polyLine1"," "," ",dataTime)
                }

            }else{
                $("#polyLine1").hide();
                $("#minVal").html("无数据");
                $("#maxVal").html("无数据");
                $("#meanVal").html("无数据");
                $("#currentVal").html("无数据");
            }


                layer.close(layerIndex);

        },
        error:function(){
            alert("网络错误!")
            layer.close(layerIndex);
        }
    })
}


$(function(){
    "use strict";
    //获得某个水厂的实时数据
    getRealTimeData();

    $("#footer").on('click','ul li',function(){
        "use strict";
        var jumpPath=$(this).attr("data-toggle");
        window.location.href=jumpPath;

    })

    //今日报警数
    warningNum();

    //返回按钮
    $("#header img").click(function(){
        jumpBack();
    })
    //确认按钮
    $(".foot-button button").click(function(){
        jumpBack();
    })



    //点击显示模态框
    $("#main").on('click','.body-content',function(){
        var pid=$(this).attr("data-target");

        if(pid!==undefined){
            //获取一天的历史数据
            getStationOneDayDate(pid);
            $(".modal").show(500);
            var title=$(this).find("div:first-child span").html();

            $("#modal-title").html(title);
        }


        //单位数组
        var unitArr=["MPa","MPa1","MPa2","MPa3","MPa4","MPa5","MPa6"];
        // modalPolyLine(true,colorArr[0],"polyLine1","Mpa","压力");
    })

})

$(document).ready(function(){


   // var $dragBln = false;
   //  $(".main_image").touchSlider({
   //      flexible : true,
   //      speed : 200,
   //      btn_prev : $("#btn_prev"),
   //      btn_next : $("#btn_next"),
   //      paging : $(".flicking_con a"),
   //      counter : function (e){
   //          $(".flicking_con a").removeClass("on").eq(e.current-1).addClass("on");
   //
   //          //为模态框中的值加单位
   //          var _index=$(".flicking_con a").eq(e.current-1).html();
   //              $("._unit").html(unitArr[_index-1])
   //
   //      }
   //  });
   //
   //  var timer = setInterval(function(){
   //      $("#btn_next").click();
   //  }, 5000);
   //
   //
   //
   //  $(".main_image").bind("touchstart",function(){
   //      clearInterval(timer);
   //  }).bind("touchend", function(){
   //      timer = setInterval(function(){
   //          $("#btn_next").click();
   //      }, 3000);
   //  });

    // modalPolyLine(true,colorArr[1],"polyLine2","Mpa1","压力");
    // modalPolyLine(true,colorArr[2],"polyLine3","Mpa2","压力");
    // modalPolyLine(true,colorArr[3],"polyLine4","Mpa3","压力");
    // modalPolyLine(true,colorArr[4],"polyLine5","Mpa4","压力");
    // modalPolyLine(true,colorArr[5],"polyLine6","Mpa5","压力");
    // modalPolyLine(true,colorArr[6],"polyLine7","Mpa6","压力");


    //模态框关闭按钮
    $("#close").click(function(){
        "use strict";
        $(".modal").hide(500);
    })

});