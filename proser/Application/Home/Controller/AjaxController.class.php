<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/2
 * Time: 10:44
 */

namespace Home\Controller;


use Think\Controller;

class AjaxController extends Controller
{
    public function _initialize(){
        header('Access-Control-Allow-Origin:*');
        header('Access-Control-Allow-Methods:POST');
        header('Access-Control-Allow-Headers:x-requested-with,content-type');
        $this->title="互联网web数据处理";
    }

    public function Aindex(){
        $all['data']=D("task")->getAllTask();
        $all['count']=D("task")->count();
        $all['code']=0;
        $all['msg']='';
        $this->ajaxReturn($all);
    }

    public function Alevel(){
        $id = I("id",'','intval');
        $res = array();
        if(empty($id)){
            $res['code'] =101;
            $res['msg']='参数错误';
        }else{
            $res['code'] =0;
            $res['msg']='';
            $res['count']=M("TaskLevel")->where("taskid=$id")->count();
            $res['data']=M("TaskLevel")->where("taskid=$id")->select();
        }
        $this->ajaxReturn($res);
    }

    public function Aoption(){
        $id = I("id",'','intval');
        $res = array();
        if(empty($id)){
            $res['code'] =101;
            $res['msg']='参数错误';
        }else{
            $res['code'] =0;
            $res['msg']='';
            $res['count']=M("TaskOption")->where("taskid=$id")->count();
            $res['data']=M("TaskOption")->where("taskid=$id")->limit(10)->select();
        }
        $this->ajaxReturn($res);
    }
}