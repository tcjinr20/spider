<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/2
 * Time: 10:44
 * 只提供工具调用接口，web的ajax 在自身的controller内实现
 */

namespace Home\Controller;
use Think\Controller;

class AjaxController extends Controller
{
    public function _initialize(){
        if(!$this->filter(ACTION_NAME)){
            $ser =unserializeurl(I("secret",""));
            if($ser){
                $arr=explode('spy',$ser);
                if(time()-$arr[2]>24*60*60){
                    $this->ajaxReturn(['code'=>1005]);
                }else{
                    if(is_login()){

                    }else{
                        if($t=M("User")->where('id='.$arr[0].' and username="'.$arr[1].'"')->select()){
                            $_SESSION['user']=$t[0];
                        }else{
                            $this->ajaxReturn(['code'=>1005]);
                        }
                    }
                }
            }else{
                //$this->ajaxReturn(['code'=>1005]);
            }
        }
    }

    public function filter($action){
        return in_array($action,['login']);
    }


    public function getUser(){
        return $_SESSION['user'];
    }

    public function getUserID(){
        return $_SESSION['user']['id'];
    }

    public function index(){
        $e=serializeurl("2spytest1".time());
        echo $e;
        echo unserializeurl('g203c2OTQyMGFkZjJjZQ==');
        echo 'empty';
    }

    public function login(){
        if($param=I("param")){
            $w['password']=md5($param["password"]);
            $w['username']= $param["username"];
            $user = M("User")->where($w)->select();
            if($user){
                $_SESSION['user']=$user[0];
                $set=serializeurl($user[0]['id']."spy".$user[0]['username'].'spy'.time());
                $this->ajaxReturn(['code'=>1,'secret'=>$set]);
            }else{
                $this->ajaxReturn(['code'=>1003]);
            }
        }else{
            $this->ajaxReturn(['code'=>1004]);
        }

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
            $task['scripts']=json_decode(html_entity_decode($task['scripts']));
            $task['code']=1;
            $this->ajaxReturn($task);
        }
    }

    public function ajax_alltask(){
        $d = D("Task")->getAllByTool($this->getUserID());
        if($d){
            $this->ajaxReturn(['code'=>1,data=>$d]);
        }else{
            $this->ajaxReturn(['code'=>1009]);
        }
    }

    public function proxyip(){
        $this->ajaxReturn(M("Ips")->order('rand()')->limit(1)->select());
    }

    public function spsave(){
        $param = I('param');
        $level=$param['level'];
        $taskid=$param['taskid'];
        $P['scripts']=htmlentities(json_encode($param['script']));
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