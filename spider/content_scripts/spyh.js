/**
 * Created by Administrator on 2017/9/30.
 */

(function(win,$){

  function spTool(){};
  spTool.__update=0;
  spTool.__open=0;

  var self = null;
  spTool.prototype.setPanel=function (da) {
    if (spTool.__open == 1)return;
    self = this;
    self.data = da
    self.init();
    self.initEvent();
    spTool.__open=1;
  }

  spTool.prototype.close = function(){
    if(self.act.classlist){
      var type=$('#switch').attr('checked')?1:2;
      var indexs=[];
      $("#spinfo p").each(function(i,e){
        if($(e).attr('staus')==1){
          indexs.push(i);
        }
      })
      var po= {};
      po['type']=type;
      po['index']=indexs;
      po['class']=self.act.classlist;
      po['attr']=$('#spattr').val();
      po['sprex'] =$("#spvalue").val();
      po['key'] =self.data;
      spTool.__open = 0;
      self.savePack(po);
      layer.close(layer.index);
    }else{
      $("#spinfo").text("没有抓取");
    }
    return false;
  }

  spTool.prototype.savePack =function(con){
    browser.storage.local.get().then(function(obje){
      var po = [];
      if(obje['packval']){
        po = obje['packval'];
      }
      po.push(con);
      browser.storage.local.set({'packval':po});
    });
  }

  spTool.prototype.closeInscript = function() {
    var po= {};
    po['type']=3;
    po['script']=$('.layui-code').text();
    spTool.__open = 0;
    $("#spresult").text(JSON.stringify(po)).attr('staus',1);
    layer.close(layer.index);
  }

  spTool.prototype.initEvent = function(){

    $('.pack').on("click",function(){
      if(self.act)self.act.begin();
    })
    $(".uplevel").on("click",self.uplevel)
    $(".downlevel").on("click",self.downlevel);
    $(".sure").on("click",self.close);
    layui.form.on("switch(loop)",function(elem){
      if(self.act.classlist){
        self.act.update(spTool.__update)
      }
    })
  }

  spTool.prototype.init=function (){
    var item1= '\
        <div class="layui-form">\
        <button class="layui-btn layui-btn-small pack">抓取</button>\
        <div class="layui-form-item">\
            <label class="layui-form-label">取值属性</label>\
            <div class="layui-input-inline">\
            <input type="text" placeholder="属性名称" id="spattr" autocomplete="off" value="innerHTML" class="layui-input">\
            </div>\
            <div class="layui-form-mid layui-word-aux">默认innerHTML</div>\
        </div>\
        <div class="layui-form-item">\
            <label class="layui-form-label">填充取值</label>\
            <div class="layui-input-block">\
            <input type="text" placeholder="#z代表取值" id="spvalue" autocomplete="off" value="" class="layui-input">\
            </div>\
        </div>\
        <div class="layui-form-item">\
           <label class="layui-form-label">循环</label>\
            <div class="layui-input-block">\
                <input type="checkbox" checked id="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="loop">\
            </div>\
        </div>\
        <div class="layui-form-item">\
            <div class="layui-input-block">\
            <button class="layui-btn sure">确定</button>\
            <button class="layui-btn uplevel">升品</button>\
            <button class="layui-btn downlevel">降品</button>\
            </div>\
        </div>\
        <div class="layui-form-item">\
        <label class="layui-form-label">提示</label>\
        <div class="layui-input-inline">\
        <div id="spinfo"></div>\
        </div>\
        </div>\
        </div>'
    var item2 = '<textarea placeholder="" rows="7" class="layui-textarea"></textarea>\
        <pre class="layui-code">\
        </pre>\
        <div id="sperror"></div>\
        <button class="layui-btn" onclick="sptool.closeInscript()">保存</button>\
        <button class="layui-btn" onclick="testJS()">测试</button>';
    self.act=new PackClass();
    layer.tab({
      area: ['600px', '400px'],
      tab: [{
        title: 'xpath',
        content: item1
      },{
        title: '脚本',
        content: item2
      }],
      offset:["10px"],
      shade: 0,
      cancel :function(){
        spTool.__open = 0;
      }
    });
    layui.form.render();
  }

  spTool.prototype.uplevel = function(){
    spTool.__update++;
    self.act.update(spTool.__update)
  }
  spTool.prototype.downlevel = function(){
    spTool.__update--;
    if(spTool.__update<0)spTool.__update=0;
    self.act.update(spTool.__update)
  };
  spTool.prototype.execute = function(js){
    try{
      eval(js);
      var list =getSpiderData();
      $("#sperror").html(list);
    }catch(e){
      $("#sperror").html(e.message);
    }
  }

  function PackClass(){
    var selfm = this;
    selfm.pre=null,self.old='';
    var oldclick = null;
    selfm.begin= function(){
      this.stop();
      setTimeout(function(){
        document.body.addEventListener("mousemove",pack);
        document.body.addEventListener("click",getpack);
      },100)
    }

    selfm.update = function (level){
      if(!selfm.pre)return;

      var att = $('#spattr').val();
      if(att.length==0){
        $('#spattr').val('textContent');
        att ='textContent';
      }
      if(!selfm.pre.hasAttributes(att)){
        layui.layer.msg("属性不存在")
        return;
      }
      if($('#switch')[0].checked){
        selfm.classlist = new IterClass(level).getTar(selfm.pre);
        var lists = document.querySelectorAll(selfm.classlist);
      }else{
        selfm.classlist= new IterClass(level).readXPath(selfm.pre);
        var lists = document.body.selectNodes(selfm.classlist);
      }

      $('#spinfo').html('');
      $('#spinfo').append("<p>共："+lists.length+"条数据</p>");
      for(var i =0;i<lists.length;i++){
        var spval=$("#spvalue").val();
        var attr = '';
        if(spval){
          attr = spval.replace(/#z/g,lists[i][att]);
        }else{
          attr = lists[i][att]
        }
        if(attr)$('#spinfo').append("<p style='cursor: hand' class='result' staus='1'>"+i+":"+attr+"</p>");
        else{
          $('#spinfo').append("<p style='background:red;cursor: hand' title='红色=不选' class='result' staus='0'>"+i+":"+attr+"</p>");
        }
      }
    }
    selfm.stop=function (){
      document.body.removeEventListener("mousemove",pack)
      document.body.removeEventListener("click",getpack);
    }

    function pack(e){
      sinfo();
      ginfo(e.target);
    }

    function getpack(e){
      if(e.target!=selfm.pre){
        sinfo()
        ginfo(e.target);
      }
      if(!selfm.pre)return;
      sinfo()
      selfm.stop();
      selfm.update(0);
    }

    function ginfo(tar){
      try{
        selfm.pre = tar;
        if(selfm.pre.style){
          self.old = selfm.pre.style.border;
          selfm.pre.style.border = "1px solid red";
        }
        oldclick=selfm.pre.onclick;
        selfm.pre.onclick = function(){return false};
      }catch(e){
        console.log(e);
        console.log(selfm.pre);
      }

    }

    function sinfo(){
      if(selfm.pre==null)return;
      selfm.pre.onclick= oldclick;
      if(selfm.pre.style)
        selfm.pre.style.border=self.old?self.old:'';
    }
  }

  function IterClass(level){
    var selfm= this;
    selfm.level = level;
    selfm.getTar= function(tar){
      var cla = selfm.getClass(tar);
      var supcla = '';
      var p = tar.parentNode;
      for(var i = 0;i<selfm.level;i++){
        cla = selfm.getClass(p)+">"+cla;
        p = p.parentNode;
      }
      return cla;
    }

    selfm.getClass = function(tar){
      var cla = tar.nodeName;
      tar.classList.forEach(function(c,i){
        cla+='.'+c;
      })
      return cla;
    };
    selfm.getNth=function(tar){
      var p = tar.parentNode.childNodes;
      for(var i=0;i<p.length;i++){
        if(p[i]==tar){
          return i;
        }
      }
    }

    selfm.readXPath = function (element) {
      for(var i = 0;i<selfm.level;i++){
        element = element.parentNode;
      }

      if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id=\"' + element.id + '\"]';
      }
      //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
      if (element == document.body) {//递归到body处，结束递归
        return '/html/' + element.tagName.toLowerCase();
      }
      var ix = 1,//在nodelist中的位置，且每次点击初始化
          siblings = element.parentNode.childNodes;//同级的子元素

      for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
          return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
          //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
          ix++;
        }
      }
    };

    return selfm;
  }
  Element.prototype.selectNodes = function(sXPath) {
    var oEvaluator = new XPathEvaluator();
    var oResult = oEvaluator.evaluate(sXPath, this, null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var aNodes = new Array();
    if (oResult != null) {
      var oElement = oResult.iterateNext();
      while (oElement) {
        aNodes.push(oElement);
        oElement = oResult.iterateNext();
      }
    }
    return aNodes;
  };
  Element.prototype.selectSingleNode = function(sXPath) {
    var oEvaluator = new XPathEvaluator();
    var oResult = oEvaluator.evaluate(sXPath, this, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (oResult != null) {
      return oResult.singleNodeValue;
    } else {
      return null;
    }
  };

  document.body.addEventListener('click',function(e){
    if(e.target.classList.contains("result")){
      var jt =$(e.target)
      if(jt.attr('staus')==1){
        jt.attr('staus',0);
        jt.css('background',"red")
      }else{
        jt.attr('staus',1);
        jt.css('background','white');
      }
      return false;
    }
  })

  win.sptool = new spTool();
})(window,layui.jquery)

var $=layui.jquery;
function setCookie(c_name,value,expiredays)
{
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
      ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function getCookie(c_name)
{
  if (document.cookie.length>0)
  {
    c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1)
    {
      c_start=c_start + c_name.length+1
      c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}

var packkey=null;
function frombgData(request, sender, sendResponse) {
  if(!request)return
  if(request.type=='init'){
      try{
        sendResponse('stop');
        doScript(request.task);
      }catch(e){
        console.log("doScript:",e);
      }
    return;
  }else if(request['type']=='test'){
    sptool.setPanel(request['data']);
    sendResponse('stop');
  }
}

browser.runtime.onMessage.addListener(frombgData);

function doScript(task){
  var res = new ScriptClass().eval(task['scripts']);
  browser.runtime.sendMessage({type:'toser','taskid':task['taskid'],'id':task['id'],'sendto':res});
  return 1;
}

function ScriptClass(){
  var self = this;
  self.eval = function(script){
    var res = [];
    var keys = [];
    var values ={};
    var max = 0;
    for (var l = 0; l < script.length; l++) {
      var arr;
      //1 多条 2 一条 3 脚本
      if(script[l]['type']==1){
        arr=self.doScriptByXpathMut(script[l]);
      }else if(script[l]['type']==3){
        arr=self.doScriptByfun(script[l])
      }else if(script[l]['type']==2){
        arr=self.doScriptByXpathOne(script[l]);
      }
      keys.push(script[l]['key'][0]);
      values[script[l]['key'][0]]=arr;
      if(arr.length>max)max=arr.length;
    }
    for(var h =0;h<max;h++){
      var o={};
      for(var j =0;j<keys.length;j++){
        o[keys[j]]=values[keys[j]].length>h?values[keys[j]][h]:"";
      }
      res.push(o);
    }
    return res;
  }
  self.doScriptByXpathOne=function(bp){
    var res=[];
    var elist =document.body.selectNodes(HTMLDecode(bp['class']));
    for(var i=0;i<elist.length;i++){
      if(bp.index.indexOf(i.toString())!=-1){
        res.push(elist[i][bp.attr]);
      }
    }
    return res;
  }
  self.doScriptByXpathMut=function(bp){
    var res=[];
    var elist =document.querySelectorAll(HTMLDecode(bp.class));
    for(var i=0;i<elist.length;i++){
      if(bp.index.indexOf(i.toString())!=-1){
        res.push(elist[i][bp.attr]);
      }
    }
    return res;
  }

  self.doScriptByfun=function(){
    try{
      var src=eval(bp['scripts']);
      console.log(src);
    }catch(e){

    }
    return bp['scripts'].call(bp);
  }
}

function onError(){
  console.log('storage wrong');
}
window.errors = function(e){
  console.log(e);
}


function HTMLDecode(text) {
  var temp = document.createElement("div");
  temp.innerHTML = text;
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}