
const proxyScriptURL = "bgs/proxy-script.js";
var proxyinit = false;
var proxyip = '';
browser.proxy.registerProxyScript(proxyScriptURL);
browser.proxy.onProxyError.addListener(function(error){
  console.log("Proxy error:"+error.message);
});

function setProxyIP(ip) {
	proxyip= ip;
	if(proxyinit){
      proxyinit= true;
      browser.runtime.sendMessage(ip, {toProxyScript: true});
	}
}
function handleMessage(message, sender) {
  if (sender.url !=  browser.extension.getURL(proxyScriptURL)) {
    return;
  }
}

browser.runtime.onMessage.addListener(handleMessage);
