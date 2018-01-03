// 设置列表高度
function setHt(el){
    "use strict";
    var h=document.documentElement.clientHeight;
    var w=document.documentElement.clientWidth;
    $(el).css({
        height:h,
        width:w
    });
}

$(function(){
    // 初始化 传入dom id
    var victor = new Victor("container", "output");
    var theme = [
        ["#002c4a", "#005584"],
        ["#35ac03", "#3f4303"],
        ["#ac0908", "#cd5726"],
        ["#18bbff", "#00486b"]
    ]

    //登陆验证
    $("#confirmBtn").click(function(){
        var user=$("#aNum").val();
        var passWord=$("#password").val();
        // var layerIndex = layer.load(1);//[参数可为0，1,2，分别是不同的样式]
       var index=layer.open({type: 2});
        $.ajax({
            type:"POST",
            dataType:'json',
            url:"http://218.201.228.115:8090/api/Login/loginsystem",
            data:{user:user,password:passWord},
            success:function(data){
                if(data.ReturnCode==1){
                    $(location).attr('href', 'index.html');

                }else{
                    alert("用户名或密码错误！");
                }
                // layer.close(layerIndex);
                layer.close(index)

            },


            error:function(){
                alert("网络错误！")
                // layer.close(layerIndex);
                layer.close(index)
            }
        })
    });


    setHt("#parent");
    window.onresize=function(){
        setHt("#parent");
    }



});