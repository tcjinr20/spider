/**
 * Created by Administrator on 2017/9/30.
 */
layui.define(['layer', 'form'], function(exports){
    var layer = layui.layer
        ,form = layui.form;

    layer.msg('Hello World');

    exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});