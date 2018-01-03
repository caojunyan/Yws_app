//抄表数据
function getData(){

    var customerNo=$("#userNum").val();
    var layerIndex = layer.load(1);
    $.ajax({
        type:"POST",
        dataType:'json',
        url:"http://218.201.228.115:8090/api/MRData/GetUserMRData",
        data:{ CustomerNO:customerNo},
        success:function(data){
                console.log(data);
            $("#singleCopy").html(data.Data[0].TOTALFLOW);

            //数字的逐渐增加效果
            // var n=0;
            // var timer=setInterval(function(){
            //     if(n<=data.Data[0].TOTALFLOW){
            //         $("#singleCopy").html(n++);
            //     }else{
            //         timer=null;
            //     }
            //
            //
            // },0);
            layer.close(layerIndex);
        },
        error:function(){
            alert("网络错误！");
            layer.close(layerIndex);
        }
    })
}

$(function(){
    "use strict";
    $("#confirmBtn").click(function(){
        getData();
    })


});



