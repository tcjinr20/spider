/**
 * Created by Administrator on 2017/9/15 0015.
 */

function Task(id,lay,fter,ser){
    var self = this;
    self.taskid = id;
    self.server = ser;
    self.delay = lay;
    self.curtab = null;
    self.stack = [];
    self.param=null;
    self.inttime = -1;
    self.sendtime = -1;
    self.packmine=fter?fter:[];
    self.open = function(){
        self.server.getFrom('/ajax/ajax_next',{'taskid':self.taskid});
        return self;
    }
    self.update = function(){
        self.server.getFrom('/ajax/ajax_next',{'taskid':self.taskid});
    }

    self.backfun = function(backser){
        var p ={};
        p['serback'+self.taskid]=backser;
        self.param = backser;

        browser.storage.local.set(p);
        self.openTab(backser['url']);
    }

    self.push =function(send){
        console.log('push send');
        self.stack.push({'list':send,taskid:self.param['taskid'],optionid:self.param['id']})
        self.sendByPack()
    }
    self.sendByPack=function(){
        if(self.inttime!=-1)return;
        self.inttime = setInterval(function(){
            if(self.stack.length>0){
                console.log('send to server')
                self.server.getFrom("/ajax/ajax_form",self.stack.shift());
            }else{
                clearInterval(self.inttime);
                self.inttime=-1;
            }
        },self.delay*1000);
    }

    self.openTab = function(url,test){
        if(self.curtab){
            browser.tabs.update(self.curtab.id,{url:url});
        }else{
            browser.tabs.create({url:url}).then(function(tab){
                self.curtab=tab;
                br
            });
        }
        if(!test)self.sendToTab({type:"init", task: self.taskid});
        return self;
    }

    self.sendToTab=function(obj){
        if(self.sendtime !=-1)return
        self.sendtime=setInterval(function(){
            browser.tabs.sendMessage(self.curtab.id,obj).then(function(m){
                clearInterval(self.sendtime);
                self.sendtime=-1;
                console.log('init back')
            });
        },100)
    }

    self.clearMine=function (){
        browser.webRequest.onBeforeSendHeaders.addListener(rewriteUserAgentHeader,{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
        browser.webRequest.onErrorOccurred.addListener(rewriteError,{urls: ["<all_urls>"]})
    }
    function rewriteUserAgentHeader(e){
        if(self.packmine.indexOf(e.type)!=-1){
            return {cancel: true};
        }
    }
    function rewriteError(){

    }

    self.error =function(){

    }

    self.delete = function(){
        console.log('del',self.taskid);
        browser.webRequest.onBeforeSendHeaders.remove(rewriteUserAgentHeader);
        browser.webRequest.onErrorOccurred.remove(rewriteError);
        clearInterval(self.sendtime);
        clearInterval(self.inttime);
    }
}

function Server(){
    var self = this;
    self.serhost = 'http://basezhushou.cn';
    //self.serhost = 'http://spider.com';
    self.getFrom=function(url,obj){
        self.sendToSer(url,obj).then(function(param){
            if(param.code==1){
                if(statisTsak[param['taskid']])
                statisTsak[param['taskid']].backfun(param);
            }else{
                console.log(param)
            }
        });
    }

    self.sendToSer=function (url,param){
        var fd = buildParam(param);
        const requestURL = self.serhost+url+'?XDEBUG_SESSION_START=13781';
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
                console.log('error',fd);
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

    function handleMessage(request, sender, sendResponse){
        if(request.type=='ser'){
            if(statisTsak[request.taskid]){
                statisTsak[request.taskid].push(request.sendto);
            }
        }
    }
    function handleRemoved(tabId, removeInfo) {
        for(var s in statisTsak){
            var t = statisTsak[s];
            if(removeInfo.isWindowClosing){
                if(t.curtab.windowId==removeInfo.windowId){
                    statisTsak[s].delete()
                    delete statisTsak[s];
                }
            }else{
                if(t.curtab.id==tabId){
                    statisTsak[s].delete()
                    delete statisTsak[s];
                }
            }
        }
    }

    browser.runtime.onMessage.addListener(handleMessage);
    browser.tabs.onRemoved.addListener(handleRemoved);
}
var statisTsak ={};
var server = new Server();

function getHost(url){
    var p = url.indexOf('/',7);
    var host=url.substring(0,p);
    var arr = host.split(".");
    var pro = arr[0].substring(0,arr[0].indexOf('//')+2)
    return pro+"www."+arr[arr.length-2]+"."+arr[arr.length-1];
}

function benginfrompanel(taskid,lay,proxy,filter){
    delay=lay?lay:2000;
    if(proxy){
        //setProxyIP(proxy);
    }
    if(statisTsak[taskid]){
        statisTsak[taskid].update();
    }else{
        statisTsak[taskid]=new Task(taskid,lay,filter,server).open();
    }
}

function openTest(url){
    if(statisTsak['-1']){
        statisTsak['-1'].openTab(url,1);
    }else{
        statisTsak['-1']=new Task('-1').openTab(url,1);
    }
}

function openPack(bal){
    statisTsak['-1'].sendToTab({'type':'test',data:bal});
}

function getTab(){
    return curtab;
}

function sendSer(param,back){
    server.sendToSer("/ajax/Spscript",param,0).then(function(p){
        if(p.code==0){
            if(back)back.call(null);
            browser.storage.local.clear();
        }else{
            console.log(p);
        }
    });
}

function getSer(){
    return server.serhost;
}

//function getActiveTab() {
//    return browser.tabs.query({active: true, currentWindow: true});
//}
//
//getActiveTab().then(function(tabs){
//    if(tabs[0].url){
//        browser.cookies.get({
//            url: tabs[0].url,
//            name:'begin'
//        }).then(function(cookie){
//            if(cookie && cookie.value==1){
//                getURL({'init':'0'});
//            }
//        });
//    }
//})








