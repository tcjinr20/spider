/**
 * Created by Administrator on 2017/9/30.
 */
(function(win){
    function spTool(){};
	var ser ="http://basezhushou.cn";
    spTool.__update=0;
    spTool.__open=0;
    var self = null;
    spTool.prototype.setPanel=function (){
        if(spTool.__open==1)return;
        self = this;
        if(window.layui==null){
            var link = document.head.appendChild(document.createElement('link'));
            link.rel='stylesheet';
            link.href=ser+"/Public/css/layui.css";

            var script = document.head.appendChild(document.createElement('script'));
            script.src=ser+"/Public/layui.js";
            script.addEventListener("load",function(){
                layui.config({
                    dir: ser+'/Public/' //你存放新模块的目录，注意，不是layui的模块目录
                }).use(['layer','element','form','code'],self.init); //加载入口
            })
        }else{
            self.init();
        }
    }

    spTool.prototype.close = function(){
        if(self.act.classlist){
            var indexs=[self.act.classlist];
            $("#spinfo p").each(function(i,e){
                if($(e).attr('staus')==1){
                    indexs.push(i);
                }
            })
            spTool.__open = 0;
            $("#spresult").text(JSON.stringify(indexs)).attr('staus',1);
            layer.close(layer.index);
        }else{
            $("#spinfo").text("没有抓取");
        }
        return false;
    }

    spTool.prototype.init=function (){
       var item1= '<button class="layui-btn layui-btn-small" onclick="sptool.pack()"><i class="layui-icon"></i>抓取</button>\
        <div class="layui-form"><div class="layui-form-item">\
            <label class="layui-form-label">取值属性</label>\
            <div class="layui-input-inline">\
            <input type="text" placeholder="属性名称" id="spattr" autocomplete="off" value="innerHTML" class="layui-input">\
            </div>\
            <div class="layui-form-mid layui-word-aux">默认innerHTML</div>\
        </div>\
        <div class="layui-form-item">\
           <label class="layui-form-label">循环</label>\
            <div class="layui-input-block">\
            <input type="radio" name="sex" value="1" title="是" checked>\
            <input type="radio" name="sex" value="0" title="否" >\
        </div>\
        </div>\
        <div class="layui-form-item">\
            <label class="layui-form-label">抓取值</label>\
            <div class="layui-input-block">\
            <input type="text" placeholder="抓取值" id="spattrval" autocomplete="off" en class="layui-input" disabled>\
            </div>\
        </div>\
        <div class="layui-form-item">\
        <label class="layui-form-label">提示</label>\
        <div class="layui-input-inline">\
        <div id="spinfo"></div>\
        </div>\
        </div>\
        <div class="layui-form-item">\
            <div class="layui-input-block">\
            <button class="layui-btn" onclick="return sptool.close()">确定</button>\
            <button class="layui-btn" onclick="sptool.uplevel()">升品</button>\
            <button class="layui-btn" onclick="sptool.downlevel()">降品</button>\
            </div>\
        </div></div>'
        var item2 = '<textarea placeholder="" rows="7" class="layui-textarea" oninput="changeText(this)"></textarea>\
        <pre class="layui-code">\
        </pre>\
        <button class="layui-btn" onclick="">保存</button>';
        var div =document.querySelector("#spresult");
        if(!div){
            div=document.createElement("div");
            div.id = "spresult";
            div.style.display='none';
            document.body.appendChild(div);
        }
        div.setAttribute('staus',0);
        self.act=new PackClass();
        layer.tab({
            area: ['600px', '400px'],
            tab: [{
                title: 'xpath',
                content: item1
            }, {
                title: '正则匹配',
                content: '内容2'
            }, {
                title: '脚本',
                content: item2
            }],
            offset:["10px"],
            shade: 0,
            cancel :function(){
                spTool.__open = 0;
            }
        });
        layui.form.render();
    }

    spTool.prototype.pack = function(){
        self.act.begin();
    }

    spTool.prototype.uplevel = function(){
        spTool.__update++;
        self.act.update(spTool.__update)
    }
    spTool.prototype.downlevel = function(){
        spTool.__update--;
        if(spTool.__update<0)spTool.__update=0;
        self.act.update(spTool.__update)
    }


    function PackClass(){
        var packstop = true;
        var pre=null,old='';
        var selfm = this;
        var oldclick = null;
        selfm.begin= function(){
            packstop = false;
            document.body.addEventListener("mousemove",pack);
            document.body.addEventListener("click",getpack);
            //browser.runtime.sendMessage({"content": '开始提取：'+act});
        }
        selfm.update = function (level){
            if(!pre)return;

            var att = $('#spattr').val();
            if(att.length==0){
                $('spattr').val('textContent');
                att ='textContent';
            }
            if(!pre.hasAttributes(att)){
                $("#spinfo").text("属性不存在");
                return;
            }
            selfm.classlist = new IterClass(level).getTar(pre);
            var lists = document.querySelectorAll(selfm.classlist);
            $('#spinfo').html('');
            var str = '';
            for(var i =0;i<lists.length;i++){
                $('#spinfo').append("<p style='cursor: hand' onclick='changeStaus(this)' staus='1'>"+i+":"+lists[i][att]+"</p>");
                if(i>30){
                    $('#spinfo').append(lists.length+":……");
                    return;
                }
            }
        }

        function pack(e){
            if(pre){
                pre.onclick= oldclick;
                pre.style.border=old;
            }
            pre = e.target;
            old = pre.style.border;
            pre.style.border = "1px solid red";
            oldclick=pre.onclick;
            pre.onclick = function(){return false};
        }

        function getpack(e){
            if(!pre)return;
            pre.onclick= oldclick;
            selfm.stop();
            selfm.update(0);
        }



        function readXPath(element) {
            if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
                return '//*[@id=\"' + element.id + '\"]';
            }
            //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
            if (element == document.body) {//递归到body处，结束递归
                return '/html/' + element.tagName.toLowerCase();
            }
            var ix = 1,//在nodelist中的位置，且每次点击初始化
                siblings = element.parentNode.childNodes;//同级的子元素

            for (var i = 0, l = siblings.length; i < l; i++) {
                var sibling = siblings[i];
                //如果这个元素是siblings数组中的元素，则执行递归操作
                if (sibling == element) {
                    return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
                    //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
                } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
                    ix++;
                }
            }
        };

        selfm.stop=function (){
            packstop = true;
            document.body.removeEventListener("mousemove",pack)
            document.body.removeEventListener("click",getpack);
            pre.style.border=old;
        }
    }


    function IterClass(level){
        var selfm= this;
        selfm.level = level;

        selfm.getTar= function(tar){
            var cla = selfm.getClass(tar);
            var supcla = '';
            var p = tar.parentNode;
            for(var i = 0;i<selfm.level;i++){
                cla = selfm.getClass(p)+">"+cla;
                p = p.parentNode;
            }
            return cla;
        }

        selfm.getClass = function(tar){
            var cla = tar.nodeName;
            tar.classList.forEach(function(c,i){
                cla+='.'+c;
            })
            return cla;
        };
        selfm.getNth=function(tar){
            var p = tar.parentNode.childNodes;
            for(var i=0;i<p.length;i++){
                if(p[i]==tar){
                    return i;
                }
            }
        }

        return selfm;
    }

    Element.prototype.selectNodes = function(sXPath) {
        var oEvaluator = new XPathEvaluator();
        var oResult = oEvaluator.evaluate(sXPath, this, null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var aNodes = new Array();
        if (oResult != null) {
            var oElement = oResult.iterateNext();
            while (oElement) {
                aNodes.push(oElement);
                oElement = oResult.iterateNext();
            }
        }
        return aNodes;
    };
    /**
     * 查找第一个匹配XPath表达式的节点（Mozilla实现selectSingleNode方法；IE自带该方法）
     *
     * @param sXPath
     *            XPAHT表达式
     * @return 节点元素对象 instanceof Element is true
     */
    Element.prototype.selectSingleNode = function(sXPath) {
        var oEvaluator = new XPathEvaluator();
        var oResult = oEvaluator.evaluate(sXPath, this, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (oResult != null) {
            return oResult.singleNodeValue;
        } else {
            return null;
        }
    };
    win.sptool = new spTool();
})(window)


function changeStaus(tar){
    var jt =$(tar)
    if(jt.attr('staus')==1){
        jt.attr('staus',0);
        jt.css('background',"red")
    }else{
        jt.attr('staus',1);
        jt.css('background','white');
    }
}

function changeText(tar){
    $("pre.layui-code").html(tar.value);
}

function checkstuas(){
    var div=document.getElementById('sptoolstaus');
    if(div){
        console.log(div.getAttribute('staus'));
        if(div.getAttribute('staus')==1){
            console.log('open')
            sptool.setPanel();
            div.setAttribute('staus',0);
        }
    }
    setTimeout(checkstuas,1000);
}
checkstuas()