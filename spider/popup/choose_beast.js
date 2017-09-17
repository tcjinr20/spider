var bg = browser.extension.getBackgroundPage();
document.addEventListener("click", function(){
  begin();
})

function begin(){
  bg.benginfrompanel();
}

function initdata(){
  bg.getSer()
}



