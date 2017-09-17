var bg = browser.extension.getBackgroundPage();
document.addEventListener("click", function(e){
  if(e.target.classList.contains("begin"))
  begin();
})

function begin(){
  var tid = $('#list').val();
  var level = $("#listlevel").val();
  bg.benginfrompanel(tid,level);
}

function onchange(){
  $("#list").val();
}

function initdata(){
  $.getJSON(bg.getSer()+"/index/ajax_alltask",function(data){
    if(data && data.length){
      alldata=data;
      for(var i =0;i<data.length;i++){
        $('#list').append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
      }
      var ll = data[0]['level'];
      for(var j = 0;j<ll.length;j++){
        $("#listlevel").append("<option value='"+ll[j].level+"'>"+ll[j].level+"</option>");
      }
    }
  });
}
$(initdata);




