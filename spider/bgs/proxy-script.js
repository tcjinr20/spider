
const allow = "DIRECT";
var deny = "";
browser.runtime.onMessage.addListener(function(message){
	 deny = "PROXY "+message;
});
function FindProxyForURL(url, host) {
	if('basezhushou.cn'==host)return allow;
	if(!deny || deny=="PROXY ")return allow;
	browser.runtime.sendMessage('Proxy-blocker: blocked '+url);
	return deny;
}
