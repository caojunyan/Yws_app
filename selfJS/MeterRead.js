
// 求平均数
function evenNum(arr){
    var num=0;
    for(var i=0;i<arr.length;i++){
        num+=arr[i]
    }
    num/=arr.length;
    return num;
}

//圆环图
function lightRing(percentage,val1,val2){
    "use strict";
    var light_ring = echarts.init(document.getElementById('light_ring'));
    var option1 =  {
        title: {
            text: '已抄回户数',
            x: '50%',
            y: '36%',
            textAlign: "center",
            textStyle: {
                fontWeight: 'normal',
                fontSize: 13,
                color: '#7B7E82'
            },
            subtextStyle: {

                fontSize: 20,
                color: '#03D6D2'
            },
            subtext:percentage
        },
        series: [{
            name: ' ',
            type: 'pie',
            radius: ['60%', '69%'],
            startAngle: 225,
            color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#04D6D3'
            }, {
                offset: 1,
                color: '#00BAE1'
            }]), "transparent"],
            hoverAnimation: false,
            legendHoverLink: false,
            itemStyle: {
                normal: {
                    borderColor: "transparent",
                    borderWidth: "20",

                },
                emphasis: {
                    borderColor: "transparent",
                    borderWidth: "20"
                }
            },
            z: 10,
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: val1
            }, {
                value: val2
            }]
        }, {
            name: '',
            type: 'pie',
            radius: ['60%', '69%'],
            startAngle: 225,
            color: ["#1E1E24", "transparent"],
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 75
            }, {
                value: 25
            }]
        }

        ]
    };
    light_ring.clear();
    light_ring.setOption(option1,true);

}

//柱状图
function bar(time,data){
    "use strict";
    //柱状图

    var num=evenNum(data);
    $("#meanLine").html(num.toFixed(2));

    var myChart = echarts.init(document.getElementById('bar'));
    var option2 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        label:{
            normal:{
                formatter:"{c}",
                color:"#6A799B",
                show: true,
                position: 'top',

            },
            emphasis:{
                formatter:"{c}m³",
                color:"#6A799B",
                show: true,
                position: 'top',

            }
        },
        legend: {
            show:false,
            data: [''],
            align: 'right',
            right: 10,
            textStyle:{
                color:'#fff',
                fontSize:18
            }
        },
        grid: {
            top:"10%",
            left: '-8%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        barMaxWidth:26,
        xAxis: [{

            type: 'category',
            axisLine:{
                lineStyle:{
                    color:'#DEDFE2',
                    width:2
                },
                textStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',
                }
            },
            name:"(时间)",
            nameTextStyle:{
                color:"#fff",
                fontSize:18
            },
            data: time
        }],
        yAxis: {
            show:false,

            type: 'value',
            min:function(value){
                return value.min;
            },
            max:function(value){
                return value.max+20
            },
            name:"(单位)",

            nameTextStyle: {
                color:'#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 18
            },
            axisLine:{
                lineStyle:{
                    color:'#274B53',
                    width:3
                }
            },
            axisLabel: {
                formatter: '{value}'
            }

        },
        series: [{
            name: '',
            type: 'bar',
            data: data,
            markLine : {
                data : [{
                        type : 'average',
                        name: '日均',
                        lineStyle:{
                            normal:{
                                color:"#fff"
                            }
                        }
                    }],
                symbolSize:0,
                label:{
                    normal:{
                        position:"middle",
                        formatter:'日均:{c}'
                    }
                },
                lineStyle:{
                    normal:{
                        color:"#fff"
                    }
                }
            }
        }],
        itemStyle: {
            normal: {

                color: function(params) {

                    var colorList = [
                        new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color:"#07C5FD"
                        }, {
                            offset: 1,
                            color: '#01A3E5'
                        }]),new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color:"#FE7193"
                        }, {
                            offset: 1,
                            color: '#E13B78'
                        }]),
                    ];
                    if(params.value>num){
                        return colorList[1]
                    }else{
                        return colorList[0]
                    }

                }

            }
        },
        color:[
            " #fff",

        ],

    };;
    myChart.clear();
    myChart.setOption(option2,true);
}

//折线图
function monthPoly(time,data){
    "use strict";
    var num=evenNum(data);
    $("#monthMeanLine").html(num.toFixed(2));
//折现图
    var polyline=echarts.init(document.getElementById('monthPoly'));
    var option4= {

        xAxis: {
            data: time,
            name:"",
            nameTextStyle:{
                color:'#fff',
                fontSize:18
            },
            axisLine:{
                show:true,
                lineStyle:{
                    color:"#fff",
                    width:2
                },
                textStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',
                }
            }
        },
        yAxis: {
            splitNumber:5,
            show:false,
            splitLine:{
                show:false
            },
            name:"(单位)",
            nameTextStyle:{
                color:'#fff',
                fontSize:18
            },
            axisLine:{
                show:true,
                lineStyle:{
                    color:"#264650",
                    width:3
                }
            }
        },

        grid: {
            top:"20%",
            left: '-8%',
            right: '3%',
            bottom: '10%',
            containLabel: true
        },

        series: [{
            type: 'line',
            label:{
                normal:{

                    formatter:"{c}",
                    color:"#6A799B",
                    show: true,
                    position: 'top',

                },
                emphasis:{
                    formatter:"{c}m³",
                    color:"#6A799B",
                    show: true,
                    position: 'top',

                }
            },
            markLine : {
                data : [{
                    type : 'average',
                    name: '日均',
                    lineStyle:{
                        normal:{
                            color:"#fff"
                        }
                    }
                }],
                symbolSize:0,
                label:{
                    normal:{
                        position:"middle",
                        formatter:'月均:{c}'
                    }
                },
                lineStyle:{
                    normal:{
                        color:"#fff"
                    }
                }
            },
            data:data,
            symbolSize:8,
            symbol:"circle",
            itemStyle:{
                normal:{
                    color:'#A94FFF',
                    lineStyle:{
                        color:"#A94FFF"
                    }
                }
            }
        }],

    };
    polyline.clear();
    polyline.setOption(option4,true);
}


//获取抄回数 剩余数
function getCopy(community){
    var totleMeter="";
    var d = new Date(new Date().getTime() - 86400000);
    var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
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

                data:{ community_id:community,date:str},
                success:function(data){

                    //已抄回
                    $("#hasUWater").html(data.Data);
                    //未抄回
                    $("#evenWaterDay").html(totleMeter-data.Data);

                    //已抄回百分比
                    var percentage=(data.Data/totleMeter*100).toFixed(2)+"%";

                    var val1=parseInt(data.Data/totleMeter*75);
                    var val2=parseInt(100-val1);
                    lightRing(percentage,val1,val2);

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
    function getDailyForm(community){
        var index=layer.open({type: 2});
        $.ajax({
            type:"POST",
            dataType:'json',
            url:"http://218.201.228.115:8090/api/MRData/GetComDayFlowData",
            data:{ community_id:community,days:"8"},
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
                $("#evenWaterMonth").html(totalFlowArr[totalFlowArr.length-1]);
                bar(comDateArr,totalFlowArr);
                layer.close(index)
            },
            error:function(){
                alert("网络错误！");
                layer.close(index)
            }
        })
    }

// POST /api/MRData/GetComMonthFlowData
// 获获取小区月用量列表,不包括本月
    function getMouthForm(community){
        var index=layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/MRData/GetComMonthFlowData",
        data:{ community_id:community,months:8},
        success:function(data){
            data=data.Data;

            var totalFlowArr=[];
            var comDateArr=[];
            for(var i=0;i<data.length;i++){
                var obj=data[i];
                totalFlowArr.unshift(obj.TotalFlow);

                var time=obj.ComDate;
                comDateArr.unshift(time);
            }

            monthPoly(comDateArr,totalFlowArr)
            layer.close(index)
        },
        error:function(){
            alert("网络错误！")
            layer.close(index)
        }
    })
}

//获得小区列表
    function getHomeList(){
        var index=layer.open({type: 2});
        $.ajax({
            type:"POST",
            dataType:'json',
            url:"http://218.201.228.115:8090/api/MRData/GetCommunityList",
            success:function(data){
            var html="";
               data=data.Data;
                for(var i=0;i<data.length;i++){
                       html+="<li data-community="+data[i].COMMUNITY_ID+">"+data[i].COMMUNITY_NAME+"</li>";
                }
                $("#homes").html(html);
                firstChildClick();
                layer.close(index)
            },
            error:function(){
                alert("网络错误！");
                layer.close(index)
            }
        })
    }

    //默认第一个小区
    function firstChildClick(){
        $("#homes").find("li").eq(0).trigger("click");
    }


$(function(){
    "use strict";
    //选择小区
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
    });

    $("#classify ul").on('click','li',function(){

        var toggle=$(this).data("toggle");

        $("#classify>span").html($(this).html()).attr("data-toggle",toggle);

        $("#classify ul").hide(200);
        $("#putDown").data("toggle",0)
    });

    $("#footer").on('click','ul li',function(){
        "use strict";
        var jumpPath=$(this).attr("data-toggle");
        window.location.href=jumpPath;

    });
    //获得小区列表
    getHomeList();
        //小区的点击事件
    $("#homes").on("click","li",function(){
        var  communityId=$(this).data("community");
        //获取抄回数 剩余数
        getCopy(communityId);
        // 获取小区日日用量列表,不包括本日
        getDailyForm(communityId);
        // 获获取小区月用量列表,不包括本月
        getMouthForm(communityId)
    })


})
