//流动的水背景
function waterBg(){
    var  myChart06 = echarts.init(document.getElementById('chart_barrel'));
    option05 = {

        grid:{
            left:0,
            right:0,
            width:"100%"
        },
        series: [{
            type: 'liquidFill',

            data: [0.6, 0.55],
            radius: '100%',
            shape: 'rect',
            center: ['25%', '25%'],
            itemStyle: {
                normal: {
                    shadowBlur:0
                }
            },
            //水颜色
            color: ['rgba(34,53,78,.9)', 'rgba(31,65,91,.5)' ],

            //背景
            backgroundStyle: {
                color: '#252D42'
            },



            label: {
                normal: {
                    formatter: '',
                    textStyle: {
                        fontSize: 20
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

//判断颜色 蓝色 红色 灰色
function setColor(data,status){
        if(data.length==0){
            //灰色
            return "grayGra"
        }
        if(status==1){
            //蓝色
            return "blueGra"
        }
        if(status==0){
            //红色
            return "redGra"
        }
    }


//获取水厂列表
function getWaterList(){
    //颜色渐变的数组
    var colorArr=["blueGra","redGra","grayGra"];
    function setColor(obj){
        if(obj.length==0){
            return colorArr[2];
        }
        return colorArr[0];
    }
    var index = layer.open({type: 2});
    //水厂
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/StationData/GetWaterworks",
        data:{SCTYPE:"水厂"},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            var liArr=$(".main_2>.waterData:first-child>.data-body>ul.flex>li");

            var html="";

                for(var j=0;j<data.length;j++){

                    var obj=data[j];

                    for(var n=0;n<liArr.length;n++){
                        var waterName=$(liArr[n]).find("div:first").html().trim();
                        if(waterName==obj.cSCName){
                            $(liArr[n]).remove();
                        }
                    }

                    html+=  "<li data-target="+obj.iID+"><div>"+ obj.cSCName+"</div> <ul> <li class='flex'><span>压力</span><span class='idPressure'>无</span></li> <li class='flex'><span>供水量</span><span class='supplyingWater'>无</span></li> <li class='flex'><span>耗电量</span><span class='outputPower'>无</span></li>  </ul> </li>"



                }

            $(".main_2>.waterData:first-child>.data-body>ul.flex").append(html);


            var waterWorks=$(".main_2>.waterData:first-child>.data-body>ul.flex>li");
            for(var i=0;i<waterWorks.length;i++){

                (function(i){
                    var scid=$(waterWorks[i]).data("target");

                    if(scid){
                        $.ajax({
                            type:"POST",
                            dataType:'json',
                            url:"http://218.201.228.115:8090/api/StationData/GetWaterworksRealData",
                            data:{SCID:scid},
                            success:function(data){
                                data = eval('(' + data.Data+ ')');
                                if(data.length>12){
                                    $(waterWorks[i]).find(".idPressure").html(data[3].fValue.toFixed(2)+data[3].cUnit);
                                    $(waterWorks[i]).find(".supplyingWater").html(data[12].fValue.toFixed(2)+data[12].cUnit);
                                    $(waterWorks[i]).find(".outputPower").html(data[13].fValue.toFixed(2)+data[13].cUnit);
                                    $(waterWorks[i]).addClass("blueGra")
                                }else{
                                    $(waterWorks[i]).addClass("grayGra")
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




            layer.close(index);


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
            var html="";
            var liArr=$(".main_2>.waterData:eq(1)>.data-body>ul.flex>li");
                for(var i=0;i<data.length;i++){
                    var obj=data[i];

                    for(var n=0;n<liArr.length;n++){
                        var waterName=$(liArr[n]).find("div:first").html().trim();
                        if(waterName==obj.cSCName){
                            $(liArr[n]).remove();
                        }
                    }

                    html+=  "<li data-target="+obj.iID+" class="+setColor(obj)+"><div>"+ obj.cSCName+"</div> <ul> <li class='flex'><span>压力</span><span class='idPressure'></span></li> <li class='flex'><span>供水量</span><span class='supplyingWater'></span></li> <li class='flex'><span>耗电量</span><span class='outputPower'></span></li>  </ul> </li>"


                }

            $(".main_2>.waterData:eq(1)>.data-body>ul.flex").append(html);


            var waterWorks=$(".main_2>.waterData:eq(1)>.data-body>ul.flex>li");
            for(var i=0;i<waterWorks.length;i++){

                (function(i){
                    var scid=$(waterWorks[i]).data("target");
                    if(scid){
                        $.ajax({
                            type:"POST",
                            dataType:'json',
                            url:"http://218.201.228.115:8090/api/StationData/GetWaterworksRealData",
                            data:{SCID:scid},
                            success:function(data){
                                data = eval('(' + data.Data+ ')');
                                if(data.length>12){
                                    $(waterWorks[i]).find(".idPressure").html(data[3].fValue.toFixed(2)+data[3].cUnit);
                                    $(waterWorks[i]).find(".supplyingWater").html(data[12].fValue.toFixed(2)+data[12].cUnit);
                                    $(waterWorks[i]).find(".outputPower").html(data[13].fValue.toFixed(2)+data[13].cUnit);
                                    $(waterWorks[i]).addClass("blueGra")
                                }else{
                                    $(waterWorks[i]).addClass("grayGra")
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




            layer.close(index);
        },
        error:function(){
            alert("网络错误！")
        }
    })

    //水库

    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/StationData/GetWaterworks",
        data:{SCTYPE:"水库"},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            var html="";
            var liArr=$(".main_2>.waterData:last-child>.data-body>ul>li");
                for(var i=0;i<data.length;i++){
                    var obj=data[i];

                    for(var n=0;n<liArr.length;n++){
                        var waterName=$(liArr[n]).find("div:first").html().trim();
                        if(waterName==obj.cSCName){
                            $(liArr[n]).remove();
                        }
                    }

                    html+=  "<li data-target="+obj.iID+"><div>"+ obj.cSCName+"</div> <ul> <li class='flex'><span>压力</span><span class='idPressure'>无</span></li> <li class='flex'><span>供水量</span><span class='supplyingWater'>无</span></li> <li class='flex'><span>耗电量</span><span class='outputPower'>无</span></li>  </ul> </li>"



                }


            $(".main_2>.waterData:last-child>.data-body>ul").append(html);

            var waterWorks=$(".main_2>.waterData:last-child>.data-body>ul.flex>li");
            for(var i=0;i<waterWorks.length;i++){

                (function(i){
                    var scid=$(waterWorks[i]).data("target");

                    if(scid){
                        $.ajax({
                            type:"POST",
                            dataType:'json',
                            url:"http://218.201.228.115:8090/api/StationData/GetWaterworksRealData",
                            data:{SCID:scid},
                            success:function(data){
                                data = eval('(' + data.Data+ ')');

                                if(data.length>12){
                                    $(waterWorks[i]).find(".idPressure").html(data[3].fValue.toFixed(2)+data[3].cUnit);
                                    $(waterWorks[i]).find(".supplyingWater").html(data[12].fValue.toFixed(2)+data[12].cUnit);
                                    $(waterWorks[i]).find(".outputPower").html(data[13].fValue.toFixed(2)+data[13].cUnit);
                                    $(waterWorks[i]).addClass("blueGra")
                                }else{
                                    $(waterWorks[i]).addClass("grayGra")
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

            layer.close(index);
        },
        error:function(){
            alert("网络错误！")
        }
    })


}

//获取统计数据
function getStaData(){
    var index = layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/StationData/GetStationStatisticsData",
        success:function(data){
            data = eval('(' + data.Data+ ')');
            $("#totalSupply").html(data[0].fOutFlow.toFixed(2));
            $("#totalPower").html(data[0].fTotalElectric.toFixed(2));
            layer.close(index);
        },
        error:function(){
            alert("网络错误！")
            layer.close(index);
        }
    })
}

//获取几天的报警数据
function getStatisticsData(){
    var index = layer.open({type: 2});
    $.ajax({
        type:"POST",
        dataType:'json',

        url:"http://218.201.228.115:8090/api/AlarmData/GetStatisticsData",
        data:{TIME:"1"},
        success:function(data){
            data = eval('(' + data.Data+ ')');
            $("#abnormityWarning").html(data.length);
            layer.close(index);
        },
        error:function(){
            alert("网络错误！")
            layer.close(index);
        }
    })

}

//获得空气质量
function getAqi(){
    var index = layer.open({type: 2});
    $.ajax({
        type:"GET",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/OtherData/GetAqi",
        data:{city:"guiyang"},
        success:function(data){

            data = eval('(' + data+ ')');
          $("#quality").html(data[0].quality);
          $("#airNum").html(data[0].pm2_5);
            layer.close(index);
        },
        error:function(){
            alert("网络错误！")
            layer.close(index);
        }
    })
}
//获得天气
function getTq(){
    var index = layer.open({type: 2});
    $.ajax({
        type:"GET",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/OtherData/GetTQ",
        data:{city:"xingyi"},
        success:function(data){
            data = (eval('(' + data+ ')')).results[0];
            $("#addrName").html(data.location.name);
            $("#temperature").html(data.now.temperature);
            $("#weatherSta").html(data.now.text);
            switch(data.now.text){
                case "晴":
                    $("#timg").attr("src","images/timg1.png");
                    break;
                case "多云":
                    $("#timg").attr("src","images/zhuye_10.png");
                    break;
                case "阴":
                    $("#timg").attr("src","images/timg2.png");
                    break;
                default:
                    $("#timg").attr("src","images/timg3.png");
            }
            layer.close(index);
        },
        error:function(){
            alert("网络错误！")
            layer.close(index);
        }
    })
}


//页面加载完成时执行
$(function(){

    //获得空气质量
    getAqi();

    //获得天气
    getTq();


    //获取水厂列表
    getWaterList();
    //流动的水背景
    waterBg();
    //获取统计数据
    getStaData();
    //获取几天的报警数据
    getStatisticsData();

    //点击显示实时数据模态框    水厂
    $(".main_2").find(".waterData:first-child").on("click","li",function(){
        var iid=$(this).data("target");
        if(!$(this).hasClass("grayGra")){
            if(iid){
                $(location).attr('href', 'waterData.html?iid='+iid);
            }
        }


    })

    //点击显示实时数据模态框    污水厂
    $(".main_2").find(".waterData:nth-child(2)").on("click","li",function(){
        var iid=$(this).data("target");
        if(!$(this).hasClass("grayGra")){
            if(iid){
                $(location).attr('href', 'waterData.html?iid='+iid);
            }
        }

    })





    $("#footer").on('click','ul li',function(){
        "use strict";
        var jumpPath=$(this).attr("data-toggle");
        window.location.href=jumpPath;

    })


})