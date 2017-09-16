/*
Given the name of a beast, get the URL to the corresponding image.
*/
//function beastNameToURL(beastName) {
//  switch (beastName) {
//    case "Frog":
//      return browser.extension.getURL("beasts/frog.jpg");
//    case "Snake":
//      return browser.extension.getURL("beasts/snake.jpg");
//    case "Turtle":
//      return browser.extension.getURL("beasts/turtle.jpg");
//  }
//}

/*
Listen for clicks in the popup.

If the click is on one of the beasts:
  Inject the "beastify.js" content script in the active tab.

  Then get the active tab and send "beastify.js" a message
  containing the URL to the chosen beast's image.

If it's on a button wich contains class "clear":
  Reload the page.
  Close the popup. This is needed, as the content script malfunctions after page reloads.
*/
document.addEventListener("click", function(){
  //if (e.target.classList.contains("beast")) {
  //  var chosenBeast = e.target.textContent;
  //  var chosenBeastURL = beastNameToURL(chosenBeast);
  //
  //  browser.tabs.executeScript(null, {
  //    file: "/content_scripts/beastify.js"
  //  });
  //
  //  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  //  gettingActiveTab.then(function(tabs){
  //    browser.tabs.sendMessage(tabs[0].id, {beastURL: 'http://www.alu.cn/aluEnterprise/EnterpriseList_k_c0_p0_cy0_ct0_vip0_ps20_1.html'});
  //  });
  //}
  //else if (e.target.classList.contains("clear")) {
  //  browser.tabs.reload();
  //  window.close();
  //
  //  return;
  //}
  begin();
})

function begin(){
  var bg = browser.extension.getBackgroundPage();
  bg.benginfrompanel();
}
