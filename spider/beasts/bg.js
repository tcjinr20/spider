/**
 * Created by Administrator on 2017/9/15 0015.
 */

var param = '';
var curtab;
var delay = 2000;//刷新频率
var serpack=[];//发送服务端的数据包
var inttime = 0;
function handleMessage(request, sender, sendResponse) {
    if(request.sendto){
        serpack.push({list:request.sendto,init:param['nid']});
        sendByPack();
    }
}

function sendByPack(){
    if(inttime!=0)return;
    inttime = setInterval(function(){
        if(serpack.length>0){
            getURL(serpack.shift());
        }else{
            inttime=0;
        }
    },delay);
}

browser.runtime.onMessage.addListener(handleMessage);

const serhost = 'http://spider.com/index.php/home/index/ajax_form?XDEBUG_SESSION_START=10271';
function sendToSer(param){
    var fd = buildParam(param);
    const requestURL = serhost;
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


function getURL(obj,cookie){
    sendToSer(obj).then(function(p){
        param=p;
        if(param.staus==1 && param['url']){
             if(curtab){
                 browser.tabs.update(curtab.id,{url:param['url']});
             }else{
                 curtab = browser.tabs.create({url:param['url']});
             }
            if(cookie){
                if(param['url']){
                    browser.cookies.set({
                        url: param['url'],
                        name: "begin",
                        value: "1"
                    });
                }
            }
        }
    });
}

function benginfrompanel(v){
    v=v?v:1;
    getURL({'init':'0'},v);
}

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

getActiveTab().then(function(tabs){
    browser.cookies.get({
        url: tabs[0].url,
        name:'begin'
    }).then(function(cookie){
        if(cookie && cookie.value==1){
            getURL({'init':'0'});
        }
    });
})
