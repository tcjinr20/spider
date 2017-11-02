/**
 * Created by Administrator on 2017/10/23.
 */
function SendBold(editor){
    this.editor = editor;
    this.xhr = new XMLHttpRequest();
}

SendBold.prototype.buildForm = function(img,file,param){
    var form = new FormData();
    if(param){
        for(var s in param){
            form.append(s,param[s])
        }
    }
    if(img){
        form.append('img',img.data,img.name);
    }
   if(file){
       form.append('file',file.data,file.name);
   }
    return form;
    //this.xhr.onreadystatechange=function(e){
    //    if(e.currentTarget.readyState==4){
    //        if(fun)fun.call(JSON.parse(e.currentTarget.response));
    //    }else{
    //        layui.layer.alert('发布失败')
    //    }
    //};
    //this.xhr.open('POST', '/index/upload', true);
    //this.xhr.send(form);
}
SendBold.prototype.sendByObj = function(){
    showWaiting('正在导出数据……');
    var object = this.editor.selected;

    if ( object === null ) {

        alert( 'No object selected' );
        return;

    }
    var output = object.toJSON();
    try {
        output = JSON.stringify( output, parseNumber, '\t' );
        output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
    } catch ( e ) {
        output = JSON.stringify( output );
    }

    saveString( output, 'obj.json' );
}

SendBold.prototype.sendByScene = function(){
    var output = editor.scene.toJSON();
    try {

        output = JSON.stringify( output, parseNumber, '\t' );
        output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

    } catch ( e ) {

        output = JSON.stringify( output );

    }

    saveString( output, 'scene.json' );
}

SendBold.prototype.sendByPro = function(){
    showWaiting('初始化数据')
    var self = this;
    var output = editor.toJSON();
    output.metadata.type = 'App';
    var geometries = output.scene.geometries;
    output.scene.geometries=[];
    delete output.history;
    try{
        out = JSON.stringify( output, parseNumber, '\t' );
        out = out.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
    }catch(e){
        out = JSON.stringify( output);
    }

    self.saveAlert('app.json',function(obj,img){
        toolbar.showinfo('发送数据……');
        var blob = new Blob( [ out ], { type: 'text/plain' } );
        var form = self.buildForm(img,{name:'app.json',data:blob},obj);
        $.ajax({url: '/index/upload', type: 'POST', cache: false, data: form, processData: false, contentType: false})
            .done(function(res) {
            if(res.code!=0){
                showWaiting('发送分解数据')
                self.sendChild(res.id,'geometries',geometries)
            }else{
                layui.layer.alert('发布失败')
            }
        }).fail(function(res) {
            console.log(res)
        });
    });
}

SendBold.prototype.sendChild=function(id,type,data){
    var bp=this.txtToBlod(type,data);
    if(bp){
        this.send(id,type,data);
    }else{
        var res= this.splitToBold(type,data);
        var self = this;
        var inter=window.setInterval(function(){
            var po=res.pop();
            if(po){
                self.send(id,type,po);
            }else{
                window.clearInterval(inter);
                layui.layer.alert('发布完成')
            }
        },10)

    }
}
SendBold.prototype.send = function(id,type,bp){
    var fp=this.buildForm(null,bp,{pid:id,type:type});
    $.ajax({url: '/index/saveChild', type: 'POST', cache: false, data: fp, processData: false, contentType: false})
        .done(function(res) {
            console.log(res);
        })
}

SendBold.prototype.saveAlert=function (filename,back) {
    var type = filename.split('.')[0];
    showWaiting('准备发送数据……');
    var con=document.getElementById('alert').innerHTML;
    type=type?type:'scene';
    layui.layer.open({
        type: 1,
        title:filename,
        content: con, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        btn: ['确定', '取消'],
        btn1:function(index){
            var img = editor.screenShot();
            var obj={};
            obj.name=document.getElementById('tlabel').value;
            obj.desc = document.getElementById('desc').value;
            obj.type=type;
            if(!obj.name){
                layui.layer.alert('没有标签');
                return;
            }
            if(back)back.call(null,obj,img);

            layui.layer.close(index);
        },
        btn2:function(index){
            layui.layer.close(index);
        }
    });
    document.getElementById('showimg').src=editor.toDataURL();
}

SendBold.prototype.txtToBlod=function (name,txt){
        try{
            var output = JSON.stringify( txt, parseNumber, '\t' );
            output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
            return {name:name,data:new Blob( [ output ], { type: 'text/plain' } )}
        }catch(e){
            console.log(name)
           if(e.name=='RangeError'){
               return false;
           }
        }
}
SendBold.prototype.splitToBold=function (name,arr){
    var res =[];
    for(var i=0;i<arr.length;i++){
        res[i]=this.txtToBlod(name+"_"+arr[i].uuid,arr[i]);
    }
    return res;
}

function ShowPan(){
    var self=this;
    self.layindex=0
    self.showBar=function (per){
        per=per.toPrecision(2)*100+"%";
        $("#probar .layui-progress-bar").html(per)
        layui.element.progress('probar', per);
        if(self.layindex!=0)return;
        self.layindex=layui.layer.open({
            type: 1
            ,title: false //不显示标题栏
            ,closeBtn: false
            ,area: '300px;'
            ,shade: 0.8
            ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
            ,btnAlign: 'c'
            ,moveType: 1 //拖拽模式，0或者1
            ,content: document.getElementById("probar").innerHTML
        });
    }

    self.hide=function(){
        layui.layer.closeAll()
    }

    self.showWaiting=function (){

        var layindex=layui.layer.open({
            type: 1
            ,title: false //不显示标题栏
            ,closeBtn: false
            ,area: '300px;'
            ,shade: 0.8
            ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
            ,btnAlign: 'c'
            ,moveType: 1 //拖拽模式，0或者1
            ,content: "<div>WAITING……</div>"
        });
    }
}


var NUMBER_PRECISION = 2;
function parseNumber( key, value ) {
    return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;
}



function formApp(id,back){
    if(id>0){
        appback=back
        $.post('/index/ajaxScene',{'id':id},function(re){
            if(re.code==1){
                var loader = new THREE.FileLoader();
                loader.load(re.obj.objurl, function ( text ) {
                    app=JSON.parse(text);
                },function(e){
                    show.showBar(e.loaded/e.total);
                });
                loadMeta(re.child);
            }else{
                layui.layer.alert('找不到项目')
            }
        })
    }
}
var geometries = [];
var app=null;
var loa = new THREE.FileLoader();
var appback = null;
var show = new ShowPan();
function loadMeta(child){
    var po=child.pop();
    if(po){

        loa.load(po.josnurl, function ( text ) {
            geometries.push(JSON.parse(text))
            loadMeta(child);
        },function(e){
            show.showBar(e.loaded/ e.total);
        });
    }else{
        show.hide();
        app.scene.geometries=geometries;
        if(appback)appback.call(null,app);
    }
}





