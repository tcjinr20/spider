/**
 * Created by Administrator on 2017/10/8.
 */
layui.use(["jquery",'form','layer'],function(){
    var $=layui.jquery;
    var bg = browser.extension.getBackgroundPage();
    layui.form.on("submit(login)",function(elem){
        bg.login(elem.field,function(ber){
            if(ber.code==1){
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
                if(parent.initSpy)parent.initSpy(ber.secret);
            }else{
                layui.layer.msg(ber.code);
            }
        });
    })

})