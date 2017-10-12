/**
 * Created by Administrator on 2017/9/15 0015.
 */

function Task(id,lay,filter,ser){
    var self = this;
    self.taskid = id;
    self.server = ser;
    self.delay = lay;
    self.curtab = null;
    self.stack = [];
    self.inttime = -1;
    self.sendtime = -1;
    self.packmine = [];
    if(filter){
        for(var i=0;i<filter.length;i++){
            self.packmine.push(filter[i]);
        }
    }

    self.open = function(){
        self.server.getFrom('/ajax/ajax_next',{'taskid':self.taskid});
        return self;
    }
    self.update = function(lay,filter){
        self.delay = lay;
        self.packmine = [];
        for(var i=0;i<filter.length;i++){
            self.packmine.push(fter[i]);
        }
        self.server.getFrom('/ajax/ajax_next',{'taskid':self.taskid});
    }

    self.backfun = function(backser){
        self.openTab(backser);
    }

    self.push =function(id,send){
        console.log('push send '+id);
        self.stack.push({'list':send,taskid:self.taskid,optionid:id})
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

    self.openTab = function(param,test){
        if(self.curtab){
            browser.tabs.update(self.curtab.id,{url:param['url']});
        }else{
            browser.tabs.create({url:param['url']}).then(function(tab){
                self.curtab=tab;
            });
        }
        if(!test)self.sendToTab({type:"init", task: param});
        return self;
    }

    self.sendToTab=function(obj){
        if(self.sendtime !=-1)return
        self.sendtime=setInterval(function(){
            if(self.curtab){
                browser.tabs.sendMessage(self.curtab.id,obj).then(function(m){
                    clearInterval(self.sendtime);
                    self.sendtime=-1;
                    console.log('init back')
                },function(e){
                    console.log(e);
                });
            }
        },1000)
    }

    self.clearMine=function (type){
        return self.packmine.indexOf(type)==-1?false:true
    }
    self.error =function(){

    }
    self.delete = function(){
        console.log('del',self.taskid);
        clearInterval(self.sendtime);
        clearInterval(self.inttime);
    }
}

function Server(){
    var self = this;
    self.serhost = 'http://basezhushou.cn';
    //self.serhost = 'http://spider.com';
    self.sceret='';
    self.getFrom=function(url,obj){
        self.sendToSer(url,obj).then(function(param){
            if(param.code==1){
                if(statisTsak[param['taskid']])
                statisTsak[param['taskid']].backfun(param);
            }else{
                console.log(param)
            }
        },function(e){
            console.log(e);
        });
    }

    self.sendToSer=function (url,param){
        var fd = buildParam(param);
        const requestURL = self.serhost+url;
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
                console.log('error',fd.toString());
                throw response.status;
            }
        });
    }

    function buildParam(param){
        var fda = new FormData();
        if(typeof param =='object' || typeof param == 'array'){
            build(param,'param');
        }else{
            fda.append('param',param);
        }
        function build(pa,name){
            for(var ss in pa){
                if(typeof pa[ss] =='object' || typeof pa[ss] == 'array'){
                    build(pa[ss],name+"["+ss+"]");
                }else{
                    fda.append(name+"["+ss+"]",pa[ss]);
                }
            }
        }

        fda.append('secret',self.sceret);
        return fda;
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
    function rewriteUserAgentHeader(e){
        for(var s in statisTsak){
            if(statisTsak[s] &&statisTsak[s].curtab&& statisTsak[s].curtab.id==e.tabId){
                if(statisTsak[s].clearMine(e.type)){
                    return {cancel: true};
                }
            }
        }
    }
    function rewriteError(){

    }

    function handleToSer(request, sender, sendResponse){
        if(request.type=='toser'){
            var taskid = request['taskid'];
            if(statisTsak[taskid]){
                statisTsak[taskid].push(request['id'],request['sendto']);
            }
        }
    }
    browser.runtime.onMessage.addListener(handleToSer);
    browser.tabs.onRemoved.addListener(handleRemoved);
    browser.webRequest.onBeforeSendHeaders.addListener(rewriteUserAgentHeader,{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
    browser.webRequest.onErrorOccurred.addListener(rewriteError,{urls: ["<all_urls>"]})
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
        statisTsak[taskid].update(lay,filter);
    }else{
        statisTsak[taskid]=new Task(taskid,lay,filter,server).open();
    }
}

function openTest(url){
    if(statisTsak['-1']){
        statisTsak['-1'].openTab({'url':url},1);
    }else{
        statisTsak['-1']=new Task('-1',1,[],server).openTab({'url':url},1);
    }
}

function openPack(key){
    if(statisTsak['-1']){
        browser.tabs.insertCSS(statisTsak['-1'].curtab.id, {file:"/content_scripts/layui.css"});
        statisTsak['-1'].sendToTab({'type':'test',data:[key]});
    }
}

function getTab(){
    return curtab;
}

function sendSer(param,back){
    server.sendToSer("/ajax/spsave",param).then(function(p){
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

function setSecret(val){
    server.sceret=val
}

function getTask(back){
    server.sendToSer('/ajax/ajax_alltask',{}).then(function(ber){
        try{
            if(back){
                back.call(null,ber);
            }
        }catch(e){
            console.log(e)
        }
    })
}

function login(param,back){
    server.sendToSer('/ajax/login',param).then(function(ber){
        if(ber.code==1){
            var exp=new Date().getTime()+24*60*60
            browser.cookies.set({'url':server.serhost,name:'user',value:ber.secret,'expirationDate':exp});
        }
        try{
            if(back){
                back.call(null,ber);
            }
        }catch(e){
            console.log(e)
        }
    })
}








