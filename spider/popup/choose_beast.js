layui.use(['form','jquery'],function(){
  var $= layui.jquery;
  var bg = browser.extension.getBackgroundPage();
  var itemnum = 0;
  document.addEventListener("click", function(e){
    var cls = e.target.classList;
    if(cls.contains("begin")){
      begin();
      return false;
    }else if(cls.contains("find")){
      var arr = e.target.id.split("_");
      var key = document.querySelector(".k_"+arr[1]).value;
      if(key.length==0){
        document.querySelector(".error").innerHTML="»±…Ÿkey";
        return
      }
      var tab = bg.getTab();
      browser.tabs.sendMessage(tab.id, {type:"pack",data:[key,arr[1]]});
    }else if(cls.contains("setting")){
      bg.openTab($('#urlopt').val());
    }else if(cls.contains('add')){
      addItem();
    }else if(cls.contains('clear')){
      browser.storage.local.clear();
    }
  })

  function addItem(k,v){
    k=k?k:'';
    v=v?v:'';
    itemnum++;
    var item = '<tr>\
        <td><input class="layui-input k_'+itemnum+'" value="'+k+'"></td>\
        <td><input class="layui-input v_'+itemnum+'" value="'+v+'"></td>\
        <td><input type="button" class="layui-btn find" value="Q" class="find" id="d_'+itemnum+'"></td>\
        </tr>';
    document.querySelector("tbody").innerHTML+=item;
  }

  function begin(){
    var tid = $('#list').val();
    var deplay =parseInt($('#opt').val());
    bg.benginfrompanel(tid,deplay);
  }


  function initdata(){
    $.getJSON(bg.getSer()+"/index/ajax_alltask",function(data){
      if(data && data.length){
        alldata=data;
        for(var i =0;i<data.length;i++){
          $('#list').append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
        }
        layui.form.render()
      }
    });
  }
  initdata();

  browser.storage.local.get().then(function(obj){
    for(var s in obj){
      var bb = s.split("_")
      if(bb.length>1){
        addItem(bb[0],obj[s]);
      }
    }
  });
});





