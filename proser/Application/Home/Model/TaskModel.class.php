<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/9/15 0015
 * Time: 下午 6:10
 */

namespace Home\Model;

use Think\Model;

class TaskModel extends Model
{
    public function getNextTask($tid){

        $level=M('TaskLevel')->where("taskid=$tid and staus=0")->order('id')->find();

        if(empty($level)){
            if(IS_AJAX){
                exit(json_encode(array('staus'=>0,'message'=>"no task")));
            }else{
                return false;
            }
        }
        $w['level']=$level['level'];
        $w['staus']=0;
        $option = M("TaskOption")->where($w)->limit(1)->find();
        $ret['id']=$option['id'];
        $ret['taskid'] = $tid;
        $ret['url'] = $option['url'];
        $ret['scripts'] = $level['scripts'];
        return $ret;
    }

    public function backTask($optionid,$list){
        $d['content'] = json_encode($list);
        $d['updatetime'] = time();
        $this->where('id='.$optionid)->save($d);
    }

    public function addTask($name){
        $d['name']=$name;
        return $this->add($d);
    }

    public function addOptions($opt){
        M('TaskOption')->addAll($opt);
    }

    public function addLevels($opl){
        M('TaskLevel')->addAll($opl);
    }

    public function getAllTask(){
        return $this->find();
    }
}