/**
 * Created by Administrator on 2017/9/16 0016.
 */

var level = 0;
function addNexttask(){
level++;
var item ='<div class="panel-title">#1级任务</div>\
    <div class="panel-body">\
        <span>执行脚本</span>\
        <textarea name="task[#1][scripts]"></textarea>\
        </div>\
        <input type="hidden" value="#1" name="task[#1][level]">\
        <span>将该字段数据生成#1级任务(执行脚本返回的数据好友该字段，否者视为整个数据)</span>\
    <input type="text" class="form-control" name="task[#1][attr]">';

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