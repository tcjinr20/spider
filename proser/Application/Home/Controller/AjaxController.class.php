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
    }

    public function index(){
        echo 'empty';
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
            $res['code'] =1006;
            $res['msg']='参数错误';
        }else{
            $res['code'] =1;
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
            $res['code'] =1006;
            $res['msg']='参数错误';
        }else{
            $res['code'] =1;
            $res['msg']='';
            $res['count']=M("TaskOption")->where("taskid=$id")->count();
            $res['data']=M("TaskOption")->where("taskid=$id")->limit(10)->select();
        }
        $this->ajaxReturn($res);
    }

    public function ajax_form(){
        $param = I("param",[]);
        $optionid =$param['optionid'];
        $taskid=$param['taskid'];
        $list=$param['list']?$param['list']:'1';
        if(empty($optionid)|| empty($taskid)){
            $this->ajaxReturn(['code'=>1006]);
        }
        if(IS_POST && $list){
            $task =D("Task")->backTask($optionid,$list)->getNextLevel($taskid);
            $task['code']=1;
            $this->ajaxReturn($task);
        }
    }

    public function ajax_next(){
        $param = I('param',[]);
        $taskid =$param['taskid'];
        if(empty($taskid)){
            $this->ajaxReturn(array('code'=>1007));
        }
        $task = D("Task")->getNextLevel($taskid);
        if(empty($task)){
            $this->ajaxReturn(array('code'=>1008));
        }else{
            $task['code']=1;
            $this->ajaxReturn($task);
        }
    }

    public function ajax_alltask(){
        $d = D("Task")->getAllTask();
        $this->ajaxReturn($d);
    }

    public function Spscript(){
        $param = I('param');
        $level=$param['level'];
        $taskid=$param['taskid'];
        $P['scripts']=json_encode($param['script']);
        if(M("TaskLevel")->where('taskid='.$taskid.' and level='.$level)->select()){
            $b =M("TaskLevel")->where('taskid='.$taskid.' and level='.$level)->save($P);
        }else{
            $P['taskid']=$taskid;
            $P['level']=$level;
            M("TaskLevel")->add($P);
        }
        $this->ajaxReturn(array(code=>0,msg=>"ok"));
    }
}