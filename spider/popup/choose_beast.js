layui.use(['form','jquery'],function(){
  var $= layui.jquery;
  var bg = browser.extension.getBackgroundPage();
  var itemnum = 0;
  var alldata=null;
  document.addEventListener("click", function(e){
    var cls = e.target.classList;
    if(cls.contains("begin")){
      begin();
      return false;
    }else if(cls.contains("find")){
      var arr = e.target.id.split("_");
      var key = document.querySelector(".k_"+arr[1]).value;
      if(key.length==0){
        document.querySelector(".error").innerHTML="缺少key";
        return
      }
      var tab = bg.getTab();
      browser.tabs.sendMessage(tab.id, {type:"pack",data:key});
    }else if(cls.contains("setting")){
      bg.openTab($('#urlopt').val());
    }else if(cls.contains('add')){
      addItem();
    }else if(cls.contains('clear')){
      browser.storage.local.clear();
    }else if(cls.contains('del')){
      var trs = e.target.id.split("_");
      var kkey = document.querySelector(".k_"+trs[1]).value;
      browser.storage.local.get().then(function(obj){
        if(obj['packval']){
          var arr =obj['packval'];
          for(var i=0;i<arr.length;i++){
            if(arr[i]['key'][0]==kkey){
              arr.splice(i,1);
              var no = document.getElementById('p_'+trs[1]);
              no.parentNode.removeChild(no);
              browser.storage.local.set({'packval':arr});
              return
            }
          }
        }
      });
    }else if(cls.contains('save')){
      //browser.tabs.sendMessage(tab.id, {type:"pack",data:[key,arr[1]]});
      browser.storage.local.get().then(function(obj){
        if(obj['packval']){
          var arr =obj['packval'];
          var p = {};
          p['level'] = $('#levelopt').val();
          p['script']=arr;
          p['taskid']=$("#list").val();
          bg.sendSer(p);
        }
      });
    }
  })

  function addItem(k,v,c) {
    k = k ? k : '';
    v = v ? v : '';
    itemnum++;
    var item = '<tr id="p_' + itemnum + '">\
        <td><input class="layui-input k_' + itemnum + '" value="' + k + '"></td>\
        <td><input class="layui-input v_' + itemnum + '" value="' + v + '"></td>'
    if(c==null){
      item+='<td><input type="button" class="layui-btn find layui-btn-small" value="Q" id="d_'+itemnum+'">';
    }else{
      item+='<td><input type="button" class="layui-btn del layui-btn-small" value="del" id="del_'+itemnum+'"></td>';
    }
    item+='</tr>';

    document.querySelector("tbody").innerHTML+=item;
  }

  function begin(){
    var tid = $('#list').val();
    var deplay =parseInt($('#opt').val());
    bg.benginfrompanel(tid,deplay);
  }

  function changeSelect(tar){
    var p= tar['value'];
    $('#levelopt').html('');
    var le=0;
    for(var i=0;i<alldata.length;i++){
      if(alldata[i].id==p){
        for(var j=0;j<alldata[i]['level'].length;j++){
          le=alldata[i].level[j]['level'];
          $('#levelopt').append("<option value='"+alldata[i].level[j]['level']+"' >"+alldata[i].level[j]['level']+"</option>");
        }
      }
    }
    layui.form.render()
  }

  function initdata(){
    $.getJSON(bg.getSer()+"/ajax/ajax_alltask",function(data){
      if(data && data.length){
        alldata=data;
        for(var i =0;i<data.length;i++){
          if(data[i].level){
            var le='';
            for(var j=0;j<data[i].level.length;j++){
              if(i==0){
                $('#levelopt').append("<option value='"+data[i].level[j]['level']+"' >"+data[i].level[j]['level']+"</option>");
              }
              le+=","+data[i].level[j]['level'];
            }
          }

          $('#list').append("<option value='"+data[i].id+"' opt='"+le+"'>"+data[i].name+"</option>");
        }
        layui.form.on('select(task)',changeSelect);
        layui.form.render()
      }
    });


  }
  initdata();

  browser.storage.local.get().then(function(obj){
    if(obj['packval']){
      var arr =obj['packval'];
      for(var i=0;i<arr.length;i++){
        addItem(arr[i]['key'],arr[i]['class'],1);
      }
    }
  });
});





