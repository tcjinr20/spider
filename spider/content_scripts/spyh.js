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
  console.log(request);
  if(request.type=='init'){


      try{
        doScript(request.task);
        sendResponse('stop');
      }catch(e){
        console.log("doScript:",e);
      }


    return;
  }else if(request['type']=='test'){
    if(!document.getElementById("sptoolstaus")){
      var script = document.createElement("script");
      script.src="http://basezhushou.cn/Public/insert.js";
      script.id = 'sptoolscript';
      document.head.appendChild(script);
      var dd = document.createElement("div");
      dd.id='sptoolstaus';
      dd.setAttribute('staus',1);
      document.body.appendChild(dd);
    }else{
      document.getElementById("sptoolstaus").setAttribute('staus',1);
    }
    packkey=request['data']
    checkresult();
  }
}

function checkresult(){
  var ele = document.getElementById('spresult');
  if(ele){
    if(ele.getAttribute('staus')==1){
      try{
        var con = JSON.parse(ele.textContent);
      }catch(e){
        console.log(e);
      }
      con['key']=packkey;
      browser.storage.local.get().then(function(obje){
        var po = [];
        if(obje['packval']){
          po = obje['packval'];
        }
        po.push(con);
        browser.storage.local.set({'packval':po});
        ele.setAttribute('staus',0)
      });
    }
  }
  setTimeout(checkresult,1000);
}


function doScript(task){
  if(!task)
  {
    console.log('script is null');
    return;
  }
  var sp = task['scripts'];
  if(sp){
    try{
      var script=eval(HTMLDecode(sp));
    }catch(e){
      console.log('自动化脚本出错', e);
      return 0;
    }
  }

  if(script&&script.length>0) {
    var res = [];
    var keys = [];
    var values ={};
    var max = 0;
    for (var l = 0; l < script.length; l++) {
      var arr;
      //1 多条 2 一条 3 脚本
      if(script[l]['type']==1){
        arr=doScriptByXpathMut(script[l]);
      }else if(script[l]['type']==3){
        arr=doScriptByfun(script[l])
      }else if(script[l]['type']==2){
        arr=doScriptByXpathOne(script[l]);
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

  }else{
    try{
      var res = getSpiderData();
    }catch(e){
      res=[1];
    }
    if(!res.length){
      res=[1];
    }
  }
  console.log('send to ser');
  var sending = browser.runtime.sendMessage({type:"ser",'taskid':task['taskid'] ,sendto: res});
  sending.then(function(message){
    //location.href=message.response;
  }, function(error){
    console.log("error"+error.message);
  });
  return 1;
}
function doScriptByXpathOne(bp){
  var res=[];
  bp['class']=HTMLDecode(bp.class);
  var elist =document.body.selectNodes(bp['class']);
  for(var i=0;i<elist.length;i++){
    if(bp.index.indexOf(i.toString())!=-1){
      res.push(elist[i][bp.attr]);
    }
  }
  return res;
}
function doScriptByXpathMut(bp){
  var res=[];
    bp.class=HTMLDecode(HTMLDecode(bp['class']));
    var elist =document.querySelectorAll(bp.class);
    for(var i=0;i<elist.length;i++){
      if(bp.index.indexOf(i.toString())!=-1){
        res.push(elist[i][bp.attr]);
      }
    }
  return res;
}

function doScriptByfun(bp){
  return bp['script'].call(bp);
}

function onError(){
  console.log('storage wrong');
}

function getSpiderData(){
  return [1];
}

browser.runtime.onMessage.addListener(frombgData);

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
/**
 * 查找第一个匹配XPath表达式的节点（Mozilla实现selectSingleNode方法；IE自带该方法）
 *
 * @param sXPath
 *            XPAHT表达式
 * @return 节点元素对象 instanceof Element is true
 */
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

function HTMLDecode(text) {
  var temp = document.createElement("div");
  temp.innerHTML = text;
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}
