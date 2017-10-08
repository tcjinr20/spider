layui.use(['form','jquery','layer'],function(){
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

  $(".begin").on('click',function(){
    begin();
    var task = $('#list').val();
    var lel = $("#levelopt").val();
    var delay=$('#opt').val();
    browser.storage.local.set({'packkey':[task,lel,delay]});
  })

  $(".test").on('click',function(){
    if(!$('#urlopt').val()){
      layui.layer.msg('没有测试网址');
      return
    }
    bg.openTest($('#urlopt').val());
    browser.storage.local.set({"testurl":$('#urlopt').val()})
  })

  $(".add").on("click",function(){
    addItem();
  })

  $(".clear").on("click",function(){
    browser.storage.local.clear();
  })

  $(".save").on('click',function(){
    browser.storage.local.get().then(function(obj){
      if(obj['packval']){
        var val =obj['packval'];
        var p = {};
        p['level'] = $('#levelopt').val();
        p['script']=val;
        p['taskid']=$("#list").val();
        bg.sendSer(p,function(){
          $("tbody").html('');
          layui.form.render();
        });
      }
    });
  })

  document.addEventListener("click", function(e){
    var cls = e.target.classList;
    if(cls.contains("find")){
      var arr = e.target.id.split("_");
      var key = $(".k_"+arr[1]).val();
      var task = $('#list').val();
      var lel = $("#levelopt").val();
      var delay=$('#opt').val();
      var testurl =$("#urlopt").val();
      if(key.length==0){
        layui.layer.msg('缺少key');
        return
      }
      bg.openPack([key]);
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
    }
  })

  function addItem(k,v,c) {
    k = k ? k : '';
    v = v ? v : '';
    itemnum++;
    var item = '<tr id="p_' + itemnum + '">\
        <td><input class="layui-input k_' + itemnum + '" value="' + k + '"></td>\
        <td><input disabled class="layui-input v_' + itemnum + '" value="' + v + '"></td>'
    if(c==null){
      item+='<td><input type="button" class="layui-btn find layui-btn-small" value="Q" id="d_'+itemnum+'">';
    }else{
      item+='<td><input type="button" class="layui-btn del layui-btn-small" value="del" id="del_'+itemnum+'"></td>';
    }
    item+='</tr>';
    $('tbody').append(item);
  }
  function begin(){
    var tid = $('#list').val();
    var deplay =parseInt($('#opt').val());
    var proxy = $('#proxy').val();
    var check = [];
    $("input[lay-filter=mine]:checked").each(function(i,e){
      check.push(e.value)
    })
    bg.benginfrompanel(tid,deplay,proxy,check);

  }

  function changeSelect(tar){
    var p= tar['value'];
    $('#levelopt').html('');
    var le=0;
    var j=0;
    for(var i=0;i<alldata.length;i++){
      if(alldata[i].id==p){
        for(;j<alldata[i]['level'].length;j++){
          le=alldata[i].level[j]['level'];
          $('#levelopt').append("<option value='"+alldata[i].level[j]['level']+"' >"+alldata[i].level[j]['level']+"</option>");
        }
      }
    }
    $('#levelopt').append("<option value='"+(j+1)+"' >新增"+(j+1)+"</option>");
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
          console.log(obj);
          $('#urlopt').val(obj['testurl']);
          if(obj['packval']){
            var arr =obj['packval'];
            for(var i=0;i<arr.length;i++){
              addItem(arr[i]['key'],arr[i]['class'],1);
            }
          }
          $('#proxy').val(obj['packproxy']);
          if(obj['packkey']){
            var pp = obj['packkey'];
            $('#list').val(pp[0]);
            $("#levelopt").val(pp[1]);
            $('#opt').val(pp[2]);
          }

          if(obj['packmine']){
            var arl = obj['packmine'];
            for(var i =0;i<arl.length;i++){
              if(arl[i])
              $('input.'+arl[i])[0].checked=true;
            }
          }
          layui.form.render();
        });
      }
    });
  }

  initdata();

});






