layui.use(['form','jquery'],function(){
  var $= layui.jquery;

  var bg = browser.extension.getBackgroundPage();
  var itemnum = 0;
  var alldata=null;

  $(".getproxy").click(function(){
    var url = bg.getSer()+"/ajax/proxyip";
    $.post(url,{},function(ba){
      if(ba.length>0){
        $('#proxy').val(ba[0]['ip']);
        browser.storage.local.set({'packproxy':ba[0]['ip']});
      }
    })
  });

  layui.form.on("checkbox(mine)",function(b){
    var arr = [];
    $('input[type=checkbox]').each(function(i,e){
      if(e.checked){
        arr.push(e.value)
      }
    });
    browser.storage.local.set({'packmine':arr});
  });

  document.addEventListener("click", function(e){
    var cls = e.target.classList;
    if(cls.contains("begin")){
      begin();
      var task = $('#list').val();
      var lel = $("#levelopt").val();
      var delay=$('#opt').val();
      browser.storage.local.set({'packkey':[task,lel,delay]});
      return false;
    }else if(cls.contains("find")){
      var arr = e.target.id.split("_");
      var key = $(".k_"+arr[1]).val();

      var task = $('#list').val();
      var lel = $("#levelopt").val();
      var delay=$('#opt').val();
      var testurl =$("#urlopt").val();
      if(key.length==0){
        document.querySelector(".error").innerHTML="缺少key";
        return
      }
      browser.storage.local.set({'packkey':[task,lel,delay,testurl]});
      var tab = bg.getTab();
      browser.tabs.sendMessage(tab.id, {type:"pack",data:[key]});

    }else if(cls.contains("setting")){
      bg.openTab($('#urlopt').val());
    }else if(cls.contains('add')){
      addItem();
    }else if(cls.contains('clear')){
      browser.storage.local.clear();
      //browser.cookies.remove();
    }else if(cls.contains('del')){
      var trs = e.target.id.split("_");
      var kkey = $(".k_"+trs[1]).val();
      browser.storage.local.get().then(function(obj){
        if(obj['packval']){
          var arr =obj['packval'];
          for(var i=0;i<arr.length;i++){
            if(arr[i]['key'][0]==kkey){
              arr.splice(i,1);
              $('#p_'+trs[1]).remove();
              browser.storage.local.set({'packval':arr});
              return
            }
          }
        }
      });
    }else if(cls.contains('save')){
      browser.storage.local.get().then(function(obj){
        if(obj['packval']){
          var val =obj['packval'];
          var p = {};
          p['level'] = $('#levelopt').val();
          p['script']=val;
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
    var proxy = $('#proxy').val();

    bg.benginfrompanel(tid,deplay,proxy);
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
            for(var j=0;j<data[i].level.length;j++){
              if(i==0){
                $('#levelopt').append("<option value='"+data[i].level[j]['level']+"'>"+data[i].level[j]['level']+"</option>");
              }
            }
          }
          $('#list').append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
        }
        layui.form.on('select(task)',changeSelect);
        browser.storage.local.get().then(function(obj){
          if(obj['packval']){
            var arr =obj['packval'];
            console.log(arr)
            for(var i=0;i<arr.length;i++){
              addItem(arr[i]['key'],arr[i]['class'],1);
            }
          }
          if(obj['packkey']){
            var pp = obj['packkey'];
            $('#list').val(pp[0]);
            $("#levelopt").val(pp[1]);
            $('#opt').val(pp[2]);
            $("#urlopt").val(pp[3]);
          }
          if(obj['packproxy']){
            $('#proxy').val(obj['packproxy']);
          }
          if(obj['packmine']){
            var arl = obj['packmine'];
            for(var i =0;i<arl.length;i++){
              $('input[value='+arl[i]+']')[0].checked=true;
            }
          }
          layui.form.render();
        });
      }
    });
  }
  initdata();


});





