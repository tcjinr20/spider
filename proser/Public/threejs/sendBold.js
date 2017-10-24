/**
 * Created by Administrator on 2017/10/23.
 */
function SendBold(editor){
    this.editor = editor;
}
SendBold.prototype.send = function(img,file,param,fun){
    var form = new FormData();
    if(param){
        for(var s in param){
            form.append(s,param[s])
        }
    }
    form.append('img',img.data,img.name);
    form.append('file',file.data,file.name);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=fun;
    xhr.open('POST', '/build/index/upload', true);
    xhr.send(form);
}

