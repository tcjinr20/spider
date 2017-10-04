/**
 * Created by Administrator on 2017/9/15 0015.
 */

var param = '';
var curtab;
var delay = 2000;//刷新频率
var serpack=[];//发送服务端的数据包
var inttime = -1;
const serhost = 'http://spider.com';

function handleMessage(request, sender, sendResponse){
    if(request.sendto){
        serpack.push({list:request.sendto,taskid:param['taskid'],optionid:param['id']});
        sendByPack();
    }
}
var endt=0;
function sendByPack(){
    if(inttime!=-1)return;
    inttime = setInterval(function(){
        if(serpack.length>0){
            getFrom("/ajax/ajax_form",serpack.shift(),1);
        }else{
            clearInterval(inttime);
            inttime=-1;
        }
    },delay);
}

browser.runtime.onMessage.addListener(handleMessage);


function sendToSer(url,param){
    var fd = buildParam(param);
    const requestURL = serhost+url+'?XDEBUG_SESSION_START=17021';
    const requestHeaders = new Headers();
    const driveRequest = new Request(requestURL, {
        method: "POST",
        headers: requestHeaders,
        body:fd
    });
    return fetch(driveRequest).then(function(response){
            if (response.status === 200) {
            return response.json();
            } else {
                throw response.status;
            }
    });
}


function buildParam(param){
    var fd = new FormData();
    if(typeof param =='object' || typeof param == 'array'){
        build(param,'param');
    }

    function build(pa,name){
        for(var ss in pa){
            if(typeof pa[ss] =='object' || typeof pa[ss] == 'array'){
                build(pa[ss],name+"["+ss+"]");
            }else{
                fd.append(name+"["+ss+"]",pa[ss]);
            }
        }
    }
    return fd;
}


function getFrom(url,obj,cookie){
    sendToSer(url,obj).then(function(p){

        param=p;
        if(param['url']){
            param['url']=param['url'].replace('supply','contact');
        }
        browser.storage.local.set(param);
        if(param.staus==1 && param['url']){
            openTab(param['url']);
            if(cookie){
                if(param['url']){

                    browser.cookies.set({
                        url: getHost(param['url']),
                        name: "begin",
                        value: "1"
                    })
                    browser.cookies.set({
                        url: param['url'],
                        name: "begin",
                        value: "1"
                    })
                }
            }
        }
    });
}
function getHost(url){
    var p = url.indexOf('/',7);
    var host=url.substring(0,p);
    var arr = host.split(".");
    var pro = arr[0].substring(0,arr[0].indexOf('//')+2)
    return pro+"www."+arr[arr.length-2]+"."+arr[arr.length-1];
}

function benginfrompanel(taskid,lay){
    delay=lay?lay:2000;
    getFrom('/ajax/ajax_next',{'taskid':taskid},1);
}

function getTab(){
    return curtab;
}

function sendSer(param){
    sendToSer("/ajax/Spscript",param,0).then(function(p){
        if(p.code==0){
            browser.storage.local.clear();
        }
    });
}


function openTab(url){
    if(curtab){
        browser.tabs.update(curtab.id,{url:url});
    }else{
        browser.tabs.create({url:url}).then(function(tab){
            curtab=tab;
        });
    }
}

function getSer(){
    return serhost;
}

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

getActiveTab().then(function(tabs){
    if(tabs[0].url){
        browser.cookies.get({
            url: tabs[0].url,
            name:'begin'
        }).then(function(cookie){
            if(cookie && cookie.value==1){
                getURL({'init':'0'});
            }
        });
    }
})

function ClearMine(){
    var self= this;
    self.active = true;
    browser.webRequest.onBeforeSendHeaders.addListener(rewriteUserAgentHeader,{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
    browser.webRequest.onErrorOccurred.addListener(rewriteError,{urls: ["<all_urls>"]})
    function rewriteUserAgentHeader(e){
        if(!self.active)return;
        if(['script','image','stylesheet'].indexOf(e.type)!=-1){
            return {cancel: true};
        }
    }
    function rewriteError(){

    }
}





