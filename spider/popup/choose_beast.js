var bg = browser.extension.getBackgroundPage();
document.addEventListener("click", function(e){
  if(e.target.classList.contains("begin"))
  begin();
})

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
    }
  });
}
$(initdata);




