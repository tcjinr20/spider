/**
 * Created by Administrator on 2017/9/30.
 */
(function(win,$){

    function spTool(){};
    spTool.__update=0;
    spTool.__open=0;

    var self = null;
    spTool.prototype.setPanel=function (da) {
        if (spTool.__open == 1)return;
        self = this;
        self.data = da
        self.init();
        self.initEvent();
        spTool.__open=1;
    }

    spTool.prototype.close = function(){
        if(self.act.classlist){
            var type=$('#switch').attr('checked')?1:2;
            var indexs=[];
            $("#spinfo p").each(function(i,e){
                if($(e).attr('staus')==1){
                    indexs.push(i);
                }
            })
            var po= {};
            po['type']=type;
            po['index']=indexs;
            po['class']=self.act.classlist;
            po['attr']=$('#spattr').val();
            po['sprex'] =$("#spvalue").val();
            po['key'] =self.data;
            spTool.__open = 0;
            self.savePack(po);
            layer.close(layer.index);
        }else{
            $("#spinfo").text("没有抓取");
        }
        return false;
    }

    spTool.prototype.savePack =function(con){
        browser.storage.local.get().then(function(obje){
            var po = [];
            if(obje['packval']){
                po = obje['packval'];
            }
            po.push(con);
            browser.storage.local.set({'packval':po});
        });
    }

    spTool.prototype.closeInscript = function() {
        var po= {};
        po['type']=3;
        po['script']=$('.layui-code').text();
        spTool.__open = 0;
        $("#spresult").text(JSON.stringify(po)).attr('staus',1);
        layer.close(layer.index);
    }

    spTool.prototype.initEvent = function(){

        $('.pack').on("click",function(){
            if(self.act)self.act.begin();
        })
        $(".uplevel").on("click",self.uplevel)
        $(".downlevel").on("click",self.downlevel);
        $(".sure").on("click",self.close);
        layui.form.on("switch(loop)",function(elem){
            if(self.act.classlist){
                self.act.update(spTool.__update)
            }
        })
    }

    spTool.prototype.init=function (){
       var item1= '\
        <div class="layui-form">\
        <button class="layui-btn layui-btn-small pack">抓取</button>\
        <div class="layui-form-item">\
            <label class="layui-form-label">取值属性</label>\
            <div class="layui-input-inline">\
            <input type="text" placeholder="属性名称" id="spattr" autocomplete="off" value="innerHTML" class="layui-input">\
            </div>\
            <div class="layui-form-mid layui-word-aux">默认innerHTML</div>\
        </div>\
        <div class="layui-form-item">\
            <label class="layui-form-label">填充取值</label>\
            <div class="layui-input-block">\
            <input type="text" placeholder="#z代表取值" id="spvalue" autocomplete="off" value="" class="layui-input">\
            </div>\
        </div>\
        <div class="layui-form-item">\
           <label class="layui-form-label">循环</label>\
            <div class="layui-input-block">\
                <input type="checkbox" checked id="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="loop">\
            </div>\
        </div>\
        <div class="layui-form-item">\
            <div class="layui-input-block">\
            <button class="layui-btn sure">确定</button>\
            <button class="layui-btn uplevel">升品</button>\
            <button class="layui-btn downlevel">降品</button>\
            </div>\
        </div>\
        <div class="layui-form-item">\
        <label class="layui-form-label">提示</label>\
        <div class="layui-input-inline">\
        <div id="spinfo"></div>\
        </div>\
        </div>\
        </div>'
        var item2 = '<textarea placeholder="" rows="7" class="layui-textarea"></textarea>\
        <pre class="layui-code">\
        </pre>\
        <div id="sperror"></div>\
        <button class="layui-btn" onclick="sptool.closeInscript()">保存</button>\
        <button class="layui-btn" onclick="testJS()">测试</button>';
        self.act=new PackClass();
        layer.tab({
            area: ['600px', '400px'],
            tab: [{
                title: 'xpath',
                content: item1
            },{
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

    spTool.prototype.uplevel = function(){
        spTool.__update++;
        self.act.update(spTool.__update)
    }
    spTool.prototype.downlevel = function(){
        spTool.__update--;
        if(spTool.__update<0)spTool.__update=0;
        self.act.update(spTool.__update)
    };
    spTool.prototype.execute = function(js){
        try{
            eval(js);
            var list =getSpiderData();
            $("#sperror").html(list);
        }catch(e){
            $("#sperror").html(e.message);
        }
    }

    function PackClass(){
        var selfm = this;
        selfm.pre=null,self.old='';
        var oldclick = null;
        selfm.begin= function(){
            this.stop();
            setTimeout(function(){
                document.body.addEventListener("mousemove",pack);
                document.body.addEventListener("click",getpack);
            },100)
        }

        selfm.update = function (level){
            if(!selfm.pre)return;

            var att = $('#spattr').val();
            if(att.length==0){
                $('#spattr').val('textContent');
                att ='textContent';
            }
            if(!selfm.pre.hasAttributes(att)){
                layui.layer.msg("属性不存在")
                return;
            }
            if($('#switch')[0].checked){
                selfm.classlist = new IterClass(level).getTar(selfm.pre);
                var lists = document.querySelectorAll(selfm.classlist);
            }else{
                selfm.classlist= new IterClass(level).readXPath(selfm.pre);
                var lists = document.body.selectNodes(selfm.classlist);
            }

            $('#spinfo').html('');
            for(var i =0;i<lists.length;i++){
                var spval=$("#spvalue").val();
                var attr = '';
                if(spval){
                    attr = spval.replace(/#z/g,lists[i][att]);
                }else{
                    attr = lists[i][att]
                }
                if(attr)$('#spinfo').append("<p style='cursor: hand' class='result' staus='1'>"+i+":"+attr+"</p>");
                else{
                    $('#spinfo').append("<p style='background:red;cursor: hand' title='红色=不选' class='result' staus='0'>"+i+":"+attr+"</p>");
                }
            }
        }
        selfm.stop=function (){
            document.body.removeEventListener("mousemove",pack)
            document.body.removeEventListener("click",getpack);
        }

        function pack(e){
            sinfo();
            ginfo(e.target);
        }

        function getpack(e){
            if(e.target!=selfm.pre){
                sinfo()
                ginfo(e.target);
            }
            if(!selfm.pre)return;
            sinfo()
            selfm.stop();
            selfm.update(0);
        }

        function ginfo(tar){
            try{
                selfm.pre = tar;
                if(selfm.pre.style){
                    self.old = selfm.pre.style.border;
                    selfm.pre.style.border = "1px solid red";
                }
                oldclick=selfm.pre.onclick;
                selfm.pre.onclick = function(){return false};
            }catch(e){
                console.log(e);
                console.log(selfm.pre);
            }

        }

        function sinfo(){
            if(selfm.pre==null)return;
            selfm.pre.onclick= oldclick;
            if(selfm.pre.style)
            selfm.pre.style.border=self.old?self.old:'';
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

        selfm.readXPath = function (element) {
            for(var i = 0;i<selfm.level;i++){
                element = element.parentNode;
            }

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

    document.body.addEventListener('click',function(e){
        if(e.target.classList.contains("result")){
            var jt =$(e.target)
            if(jt.attr('staus')==1){
                jt.attr('staus',0);
                jt.css('background',"red")
            }else{
                jt.attr('staus',1);
                jt.css('background','white');
            }
            return false;
        }
    })

    win.sptool = new spTool();
})(window,layui.jquery)


function changeStaus(tar){

}

function changeText(tar){
    var js = "function getSpiderData(){\n";
    js+=tar.value;
    js+="\n}";
    $("pre.layui-code").html(js);
}

function testJS(){
    sptool.execute($("pre.layui-code").html())
}
