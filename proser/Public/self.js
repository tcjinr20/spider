/**
 * Created by Administrator on 2017/9/16 0016.
 */

var level = 0;
function addNexttask(){
level++;
    var item ='<div class="layui-form-item">\
        <label class="layui-form-label">#1级js脚本</label>\
        <input type="hidden" value="#1" name="task[#1][level]">\
        <div class="layui-input-block">\
        <textarea name="task[#1][scripts]" placeholder="请输入内容" class="layui-textarea"></textarea>\
        </div>\
        <label class="layui-form-label">#1级关键属性</label><div class="layui-form-mid layui-word-aux"><input type="text" placeholder="属性" name="task[#1][attr]" autocomplete="off" class="layui-input"></div>\
    </div>'
    var lk=  item.replace(/#1/g,level);
$("#tasklevel").append(lk);
}

function onpreview(){
    var max = parseInt($("input[name=maxpage]").val());
    var min = parseInt($("input[name=minpage]").val());
    var urls = $("input[name=urls]").val();
    for(var i=min;i<max;i++){
        $('#pref').append("<div>"+urls.replace(/\*/g,i)+"</div>");
    }
}

function redirect(url){
    setTimeout(function () {
        location.href = url;
    },1000)
}