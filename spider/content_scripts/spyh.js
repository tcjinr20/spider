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

function beastify(request, sender, sendResponse) {
  console.log('getCookie',getCookie("begin"));
  if(getCookie("begin")==1){
    insertBeast();
  }
  browser.runtime.onMessage.removeListener(beastify);
}

function insertBeast() {
  browser.storage.local.get().then(onUpdate, onError);
}

function onUpdate(setting){
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
  var sending = browser.runtime.sendMessage({
    sendto: b
  });
  sending.then(function(message){
    console.log('from bg',message);
    location.href=message.response;
  }, function(error){
    console.log("error"+error.message);
  });
}


function onError(){
  console.log('storage wrong');
}

beastify();
browser.runtime.onMessage.addListener(beastify);

function getSpiderData(){
  return [1];
}
