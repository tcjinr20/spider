/**
 * Created by Administrator on 2017/9/16 0016.
 */

var level = 0;
function addNexttask(){
level++;
    var item ='<div class="panel panel-default">\
    <input type="hidden" value="#1" name="task[#1][level]">\
    <div class="panel-heading">#1级执行脚本</div>\
    <div class="panel-body">\
    <label class="col-sm-2">脚本</label>\
    <div class="col-sm-10"><textarea name="task[#1][scripts]" class="form-control" rows="3"></textarea></div>\
    <label class="col-sm-2">属性</label>\
    <div class="col-sm-10"><input type="text" class="form-control" name="task[#1][attr]"></div>\
    </div>\
    </div>';
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